import { Injectable } from '@nestjs/common';
import {
    ID,
    ListQueryBuilder,
    ListQueryOptions,
    PaginatedList,
    RequestContext,
    TransactionalConnection,
    TranslatorService,
    assertFound,
} from '@vendure/core';
import { CreateSeasonInput, UpdateSeasonInput } from '../season.types';
import { Season } from '../entities/season';
import { SeasonTranslation } from '../entities/season-translation';
import { Product } from '@vendure/core';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class SeasonService {
    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private translator: TranslatorService,
    ) {}

    async findAll(ctx: RequestContext, options?: ListQueryOptions<Season>): Promise<PaginatedList<Season>> {
        const [items, totalItems] = await this.listQueryBuilder
            .build(Season, options, {
                ctx,
                relations: ['translations'],
            })
            .getManyAndCount();

        return {
            items: items.map(s => this.translator.translate(s, ctx)),
            totalItems,
        };
    }

    async findOne(ctx: RequestContext, id: ID): Promise<Season | undefined> {
        const season = await this.connection.getRepository(ctx, Season).findOne({
            where: { id },
            relations: ['translations'],
        });
        return season ? this.translator.translate(season, ctx) : undefined;
    }

    async getActiveSeasons(ctx: RequestContext): Promise<Season[]> {
        const today = new Date();
        const seasons = await this.connection.getRepository(ctx, Season).find({
            where: {
                isActive: true,
                startDate: LessThanOrEqual(today),
                endDate: MoreThanOrEqual(today),
            },
            relations: ['translations'],
            order: { startDate: 'DESC' },
        });
        return seasons.map(s => this.translator.translate(s, ctx));
    }

    async getSeasonBySlug(ctx: RequestContext, slug: string): Promise<Season | undefined> {
        const season = await this.connection.getRepository(ctx, Season).findOne({
            where: { slug },
            relations: ['translations'],
        });
        return season ? this.translator.translate(season, ctx) : undefined;
    }

    async create(ctx: RequestContext, input: CreateSeasonInput): Promise<Season> {
        const season = new Season(input);
        const createdSeason = await this.connection.getRepository(ctx, Season).save(season);
        
        // Handle translations
        for (const translationInput of input.translations) {
            const translation = new SeasonTranslation(translationInput);
            translation.base = createdSeason;
            await this.connection.getRepository(ctx, SeasonTranslation).save(translation);
        }
        
        return assertFound(this.findOne(ctx, createdSeason.id));
    }

    async update(ctx: RequestContext, input: UpdateSeasonInput): Promise<Season> {
        const season = await this.connection.getEntityOrThrow(ctx, Season, input.id);
        if (input.slug) season.slug = input.slug;
        if (input.startDate) season.startDate = input.startDate;
        if (input.endDate) season.endDate = input.endDate;
        if (input.isActive !== undefined) season.isActive = input.isActive;
        
        await this.connection.getRepository(ctx, Season).save(season);

        if (input.translations) {
            for (const translationInput of input.translations) {
                let translation = await this.connection.getRepository(ctx, SeasonTranslation).findOne({
                    where: {
                        base: { id: season.id },
                        languageCode: translationInput.languageCode,
                    },
                });
                if (translation) {
                    Object.assign(translation, translationInput);
                } else {
                    translation = new SeasonTranslation(translationInput);
                    translation.base = season;
                }
                await this.connection.getRepository(ctx, SeasonTranslation).save(translation);
            }
        }

        return assertFound(this.findOne(ctx, season.id));
    }

    async delete(ctx: RequestContext, id: ID) {
        const season = await this.connection.getEntityOrThrow(ctx, Season, id);
        await this.connection.getRepository(ctx, Season).softRemove(season);
        return {
            result: 'DELETED',
            message: `Season ${id} deleted successfully`,
        };
    }

    async assignProducts(ctx: RequestContext, seasonId: ID, productIds: ID[]): Promise<Season> {
        const season = await assertFound(
            this.connection.getRepository(ctx, Season).findOne({
                where: { id: seasonId },
                relations: ['products'],
            }),
        );
        const products = await this.connection.getRepository(ctx, Product).findByIds(productIds);
        season.products = [...(season.products || []), ...products];
        return this.connection.getRepository(ctx, Season).save(season);
    }

    async removeProducts(ctx: RequestContext, seasonId: ID, productIds: ID[]): Promise<Season> {
        const season = await assertFound(
            this.connection.getRepository(ctx, Season).findOne({
                where: { id: seasonId },
                relations: ['products'],
            }),
        );
        season.products = (season.products || []).filter(p => !productIds.includes(p.id));
        return this.connection.getRepository(ctx, Season).save(season);
    }

    async findForProduct(ctx: RequestContext, productId: ID): Promise<Season[]> {
        const seasons = await this.connection.getRepository(ctx, Season)
            .createQueryBuilder('season')
            .leftJoin('season.products', 'product')
            .leftJoinAndSelect('season.translations', 'translation')
            .where('product.id = :productId', { productId })
            .andWhere('season.deletedAt IS NULL')
            .getMany();
        
        return seasons.map(s => this.translator.translate(s, ctx));
    }

    async syncSeasonStatus(ctx: RequestContext): Promise<void> {
        const today = new Date();
        await this.connection
            .getRepository(ctx, Season)
            .createQueryBuilder()
            .update()
            .set({ isActive: false })
            .where('endDate < :today', { today })
            .execute();
    }
}
