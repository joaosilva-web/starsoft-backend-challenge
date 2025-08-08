import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { OrderStatus } from '../entities/order-satus.enum';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];

  @IsOptional()
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status?: OrderStatus;
}
