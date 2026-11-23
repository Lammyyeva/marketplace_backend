import { OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PluginCommonModule, VendurePlugin, RequestContextService } from '@vendure/core';
import { Season } from './entities/season';
import { SeasonTranslation } from './entities/season-translation';
import { SeasonService } from './services/season.service';
import { SeasonAdminResolver } from './api/season-admin.resolver';
import { SeasonShopResolver } from './api/season-shop.resolver';
import { SeasonEntityResolver } from './api/season-entity.resolver';
import { ProductEntityResolver } from './api/product-entity.resolver';
import { seasonAdminApiSchema, seasonShopApiSchema } from './api/season.schema';

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [Season, SeasonTranslation],
    providers: [SeasonService],
    adminApiExtensions: {
        schema: seasonAdminApiSchema,
        resolvers: [SeasonAdminResolver, SeasonEntityResolver, ProductEntityResolver],
    },
    shopApiExtensions: {
        schema: seasonShopApiSchema,
        resolvers: [SeasonShopResolver, SeasonEntityResolver],
    },
    dashboard: {
        location: './dashboard',
    },
})
export class SeasonalPlugin implements OnApplicationBootstrap {
    constructor(
        private seasonService: SeasonService,
        private requestContextService: RequestContextService,
    ) {}

    async onApplicationBootstrap() {
        await this.syncStatuses();
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        await this.syncStatuses();
    }

    private async syncStatuses() {
        const ctx = await this.requestContextService.create({
            apiType: 'admin',
        });
        await this.seasonService.syncSeasonStatus(ctx);
    }
}
