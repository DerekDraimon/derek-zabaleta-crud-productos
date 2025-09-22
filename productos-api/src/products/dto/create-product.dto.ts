import { IsString, IsNotEmpty, IsNumber, Min, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) precio: number;
  @IsInt() @Min(0) stock: number;
}