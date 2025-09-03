import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  search?: string;

  @IsOptional()
  role?: string;

  @IsOptional()
  department?: string;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
