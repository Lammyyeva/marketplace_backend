import { ID, LanguageCode } from '@vendure/core';

export interface SeasonTranslationInput {
    id?: ID;
    languageCode: LanguageCode;
    name?: string;
    description?: string;
}

export interface CreateSeasonInput {
    translations: SeasonTranslationInput[];
    slug: string;
    startDate: Date;
    endDate: Date;
    isActive?: boolean;
}

export interface UpdateSeasonInput {
    id: ID;
    translations?: SeasonTranslationInput[];
    slug?: string;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
}
