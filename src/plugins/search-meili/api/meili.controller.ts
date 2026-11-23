import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { RequestContextService } from '@vendure/core';
import { MeiliInitialSyncService } from '../sync/initial-sync.service';

@Controller('meili')
export class MeiliController {
    constructor(
        private requestContextService: RequestContextService,
        private initialSyncService: MeiliInitialSyncService,
    ) {}

    @Post('sync')
    async sync(@Req() req: Request) {
        console.log('>>> [MEILI REST] sync request received <<<');
        const ctx = await this.requestContextService.create({
            apiType: 'admin',
            req: req as any,
        });
        
        // We run it asynchronously just like the resolver
        this.initialSyncService.syncAll().catch(err => {
            console.error('Meili sync failed:', err);
        });

        return { success: true, message: 'Meilisearch sync started' };
    }
}
