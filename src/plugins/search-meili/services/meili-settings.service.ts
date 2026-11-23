import { Injectable, Logger } from '@nestjs/common';
import { MeiliClientService } from '../meili.client';
import { PRODUCT_INDEX } from '../constants';

export interface MeiliIndexSettings {
  searchableAttributes: string[];
  filterableAttributes: string[];
  sortableAttributes: string[];
  synonyms: Record<string, string[]>;
  stopWords: string[];
  rankingRules: string[];
  typoTolerance: {
    enabled: boolean;
    minWordSizeForTypos: { oneTypo: number; twoTypos: number };
  };
}

export interface MeiliLocalConfig {
  isEnabled: boolean;
  autoSync: boolean;
  batchSize: number;
  indexPrefix: string;
}

export interface MeiliSettingsInput {
  searchableAttributes?: string[];
  filterableAttributes?: string[];
  sortableAttributes?: string[];
  synonyms?: Record<string, string[]>;
  stopWords?: string[];
  rankingRules?: string[];
  typoToleranceEnabled?: boolean;
  typoOneTypo?: number;
  typoTwoTypos?: number;
  isEnabled?: boolean;
  autoSync?: boolean;
  batchSize?: number;
  indexPrefix?: string;
}

@Injectable()
export class MeiliSettingsService {
  private readonly logger = new Logger(MeiliSettingsService.name);

  constructor(private readonly clientService: MeiliClientService) {}

  async getIndexSettings(): Promise<MeiliIndexSettings> {
    try {
      const index = this.clientService.getClient().index(PRODUCT_INDEX);
      const settings = await index.getSettings();
      return {
        searchableAttributes: settings.searchableAttributes || [],
        filterableAttributes: settings.filterableAttributes || [],
        sortableAttributes: settings.sortableAttributes || [],
        synonyms: (settings.synonyms as Record<string, string[]>) || {},
        stopWords: settings.stopWords || [],
        rankingRules: settings.rankingRules || [],
        typoTolerance: {
          enabled: settings.typoTolerance?.enabled !== false,
          minWordSizeForTypos: {
            oneTypo: settings.typoTolerance?.minWordSizeForTypos?.oneTypo ?? 4,
            twoTypos: settings.typoTolerance?.minWordSizeForTypos?.twoTypos ?? 8,
          },
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get index settings: ${(error as any).message}`);
      throw error;
    }
  }

  async updateSettings(input: MeiliSettingsInput): Promise<MeiliIndexSettings> {
    const index = this.clientService.getClient().index(PRODUCT_INDEX);

    const patch: Record<string, any> = {};
    if (input.searchableAttributes) patch.searchableAttributes = input.searchableAttributes;
    if (input.filterableAttributes) patch.filterableAttributes = input.filterableAttributes;
    if (input.sortableAttributes) patch.sortableAttributes = input.sortableAttributes;
    if (input.synonyms !== undefined) patch.synonyms = input.synonyms;
    if (input.stopWords) patch.stopWords = input.stopWords;
    if (input.rankingRules) patch.rankingRules = input.rankingRules;

    if (
      input.typoToleranceEnabled !== undefined ||
      input.typoOneTypo !== undefined ||
      input.typoTwoTypos !== undefined
    ) {
      const current = await index.getSettings();
      patch.typoTolerance = {
        enabled: input.typoToleranceEnabled ?? current.typoTolerance?.enabled ?? true,
        minWordSizeForTypos: {
          oneTypo: input.typoOneTypo ?? current.typoTolerance?.minWordSizeForTypos?.oneTypo ?? 4,
          twoTypos: input.typoTwoTypos ?? current.typoTolerance?.minWordSizeForTypos?.twoTypos ?? 8,
        },
      };
    }

    if (Object.keys(patch).length > 0) {
      await index.updateSettings(patch);
      this.logger.log('Meilisearch index settings updated');
    }

    return this.getIndexSettings();
  }

  async resetIndexSettings(): Promise<void> {
    const index = this.clientService.getClient().index(PRODUCT_INDEX);
    await index.resetSettings();
    this.logger.log('Meilisearch index settings reset to defaults');
  }
}
