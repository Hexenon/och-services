import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDTO {
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  perPage?: number;

  @IsOptional()
  search?: string;
}
