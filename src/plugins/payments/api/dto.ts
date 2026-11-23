import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Length } from "class-validator";
import { PaymentStatus } from "../types";

/**
 * Validated DTOs for the GraphQL/REST surface. `class-validator` decorators give
 * defence-in-depth input validation independent of the GraphQL schema types.
 */

export class InitiatePaymentDto {
  @IsString()
  orderId: string;

  @IsString()
  @Length(1, 64)
  gatewayCode: string;
}

export class RefundPaymentDto {
  @IsString()
  transactionId: string;

  /** Minor units. */
  @IsInt()
  @IsPositive()
  amount: number;

  @IsString()
  @Length(1, 512)
  reason: string;
}

export class CancelPaymentDto {
  @IsString()
  transactionId: string;
}

export class TransactionFilterDto {
  @IsOptional() @IsString() orderId?: string;
  @IsOptional() @IsString() transactionId?: string;
  @IsOptional() @IsString() customerId?: string;
  @IsOptional() @IsEnum(PaymentStatus) status?: PaymentStatus;
  @IsOptional() @IsString() gatewayCode?: string;
  @IsOptional() @IsString() dateFrom?: string;
  @IsOptional() @IsString() dateTo?: string;
  @IsOptional() @IsInt() skip?: number;
  @IsOptional() @IsInt() take?: number;
}
