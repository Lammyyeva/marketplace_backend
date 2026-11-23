import { ID } from "@vendure/core";
import {
  Channel,
  DeepPartial,
  EntityId,
  VendureEntity,
} from "@vendure/core";
import { Column, DeleteDateColumn, Entity, Index, ManyToOne } from "typeorm";

export enum WorkerRole {
  Courier = "Courier",
}

@Entity()
export class Worker extends VendureEntity {
  constructor(input?: DeepPartial<Worker>) {
    super(input);
  }

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column({ select: false })
  passwordHash: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  erpCode: string;

  @Column({ type: "text", nullable: true })
  note: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  externalCode: string;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: true })
  enabled: boolean;

  @Column({
    type: "varchar",
    default: WorkerRole.Courier,
  })
  role: WorkerRole;

  @Column({ nullable: true })
  vehicle: string;

  @Column({ nullable: true })
  vehiclePlate: string;

  @ManyToOne((type) => Channel)
  channel: Channel;

  @EntityId()
  channelId: ID;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
