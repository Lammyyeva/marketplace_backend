import { Inject, Injectable } from "@nestjs/common";
import { PAYMENT_PROVIDER_STRATEGIES } from "../constants";
import { PaymentProviderInterface } from "./payment-provider.interface";

/**
 * Factory that resolves a provider strategy by gateway code.
 *
 * Strategies are supplied via DI (the `PAYMENT_PROVIDER_STRATEGIES` multi-token),
 * so registering a new bank means: add the provider to the plugin's providers
 * array and to that token's array — no edit to this factory, the PaymentService,
 * controllers, or jobs. Closed for modification, open for extension.
 */
@Injectable()
export class PaymentProviderFactory {
  private readonly registry = new Map<string, PaymentProviderInterface>();

  constructor(
    @Inject(PAYMENT_PROVIDER_STRATEGIES)
    strategies: PaymentProviderInterface[],
  ) {
    for (const strategy of strategies) {
      this.registry.set(strategy.code, strategy);
    }
  }

  /** Resolve the strategy for a gateway code, throwing if unknown. */
  get(code: string): PaymentProviderInterface {
    const provider = this.registry.get(code);
    if (!provider) {
      throw new Error(
        `No payment provider registered for gateway code "${code}". ` +
          `Known codes: ${[...this.registry.keys()].join(", ") || "(none)"}`,
      );
    }
    return provider;
  }

  has(code: string): boolean {
    return this.registry.has(code);
  }

  codes(): string[] {
    return [...this.registry.keys()];
  }
}
