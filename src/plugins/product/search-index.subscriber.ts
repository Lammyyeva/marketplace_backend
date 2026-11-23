import { Injectable, OnModuleInit } from "@nestjs/common";
import { EventBus, TransactionalConnection, ProductEvent } from "@vendure/core";

@Injectable()
export class SearchIndexSubscriber implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private connection: TransactionalConnection,
  ) {}

  onModuleInit() {
    this.eventBus.ofType(ProductEvent).subscribe(async (event) => {
      if (event.type === "updated" || event.type === "created") {
        // Here we would trigger a reindex of the product variants
        // to ensure the categorySlug is updated.
      }
    });
  }
}
