import { OnApplicationBootstrap } from '@nestjs/common';
import { PluginCommonModule, RuntimeVendureConfig, Type, VendurePlugin } from '@vendure/core';
import { adminApiExtensions } from './api/api-extensions';
import { ImportAdminResolver } from './api/import.admin.resolver';
import { ImportController } from './api/import.controller';
import { ImportJob } from './entities/import-job.entity';
import { ImportLog } from './entities/import-log.entity';
import { AssetMappingService } from './services/asset-mapping.service';
import { ExcelParserService } from './services/excel-parser.service';
import { ExcelReportService } from './services/excel-report.service';
import { ExcelTemplateService } from './services/excel-template.service';
import { ImportHistoryService } from './services/import-history.service';
import { ImportService } from './services/import.service';
import { SlugService } from './services/slug.service';
import { PluginInitOptions } from './types';

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [ImportJob, ImportLog],
    providers: [
        SlugService,
        ExcelTemplateService,
        ExcelParserService,
        ExcelReportService,
        AssetMappingService,
        ImportService,
        ImportHistoryService,
    ],
    controllers: [ImportController],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [ImportAdminResolver],
    },
    configuration: (config: RuntimeVendureConfig) => {
        return config;
    },
    compatibility: '^3.0.0',
    dashboard: {
        location: './dashboard',
    },
})
export class ProductImportPlugin implements OnApplicationBootstrap {
    static options: PluginInitOptions = {};

    static init(options: PluginInitOptions): Type<ProductImportPlugin> {
        this.options = options;
        return ProductImportPlugin;
    }

    constructor(private importService: ImportService) {}

    async onApplicationBootstrap() {
        // Initialize job queues after app bootstrap
        await this.importService.init();
    }
}
