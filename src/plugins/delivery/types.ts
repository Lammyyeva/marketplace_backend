import { DeliveryMethod } from "./entities/delivery-method.entity";

/**
 * @description
 * The plugin can be configured using the following options:
 */
export interface PluginInitOptions {
  exampleOption?: string;
}

export interface DeliverySlot extends Omit<
  DeliveryMethod,
  "translations" | "days"
> {
  isDisabled: boolean;
}

export class DeliveryCredentialGroup {
  key: number;
  day: string;
  data: DeliverySlot[];
  date: string | null;
  type: "express" | "default";
}
