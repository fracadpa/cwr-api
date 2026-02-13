import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsUrl,
} from 'class-validator';

export class CreateArtworkDto {
  @ApiProperty({
    type: String,
    example: 'Starry Night',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    example: 'Vincent van Gogh',
    required: false,
  })
  @IsOptional()
  @IsString()
  artist?: string;

  @ApiProperty({
    type: Number,
    example: 1889,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty({
    type: String,
    example: 'Oil on canvas',
    required: false,
  })
  @IsOptional()
  @IsString()
  medium?: string;

  @ApiProperty({
    type: String,
    example: '73.7 cm × 92.1 cm',
    required: false,
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiProperty({
    type: Number,
    example: 1000000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    type: String,
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
