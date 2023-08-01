import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateOrderDTO {
  @IsString()
  title: string;

  @IsString({ each: true })
  image: string[];

  @IsDateString()
  time: Date;

  @IsDateString()
  dateTop: Date;

  @IsNumber()
  price: number;

  @IsString()
  source: string;

  @IsString()
  destiny: string;

  @IsString()
  shop: string;

  @IsString()
  url: string;

  @IsNumber()
  reward: number;

  @IsBoolean()
  box: boolean;
}
