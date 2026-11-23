import { DeepPartial, VendureEntity } from "@vendure/core";
import { Column, Entity } from "typeorm";

/**
 * Singleton row holding system-wide payment switches. A single record is
 * created/managed by SystemSettingsService; the `onlinePaymentEnabled` master
 * switch gates the entire online-payment subsystem (checkout listing + API).
 */
@Entity()
export class SystemSettings extends VendureEntity {
  constructor(input?: DeepPartial<SystemSettings>) {
    super(input);
  }

  /** Master kill-switch for all online payments. */
  @Column({ default: true })
  onlinePaymentEnabled: boolean;
}
