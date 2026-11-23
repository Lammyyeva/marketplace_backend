import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import {
  PromotionEvent,
  ProductEvent,
  ProductVariantEvent,
  EventBus,
  CollectionService,
  RequestContextService,
  Logger,
} from "@vendure/core";
import { ActiveSaleSyncService } from "./active-sale-sync.service";

@Injectable()
export class PromotionCollectionSyncService implements OnApplicationBootstrap {
  constructor(
    private eventBus: EventBus,
    private collectionService: CollectionService,
    private requestContextService: RequestContextService,
    private activeSaleSyncService: ActiveSaleSyncService,
  ) {}

  onApplicationBootstrap() {
    this.activeSaleSyncService.triggerSyncJob();

    this.eventBus.ofType(PromotionEvent).subscribe(async (event) => {
      try {
        const ctx = await this.requestContextService.create({
          apiType: "admin",
        });
        await this.collectionService.triggerApplyFiltersJob(ctx);
        this.activeSaleSyncService.triggerSyncJob();
      } catch (err: any) {
        Logger.error(
          `[Promotion Sync] Failed to queue sync jobs`,
          err.message,
          "PromotionCollectionSyncService",
        );
      }
    });

    this.eventBus.ofType(ProductEvent).subscribe(async (event) => {
      this.activeSaleSyncService.triggerSyncJob();
    });

    this.eventBus.ofType(ProductVariantEvent).subscribe(async (event) => {
      this.activeSaleSyncService.triggerSyncJob();
    });
  }
}
