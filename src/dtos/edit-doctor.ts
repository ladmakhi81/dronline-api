import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CategoryEntity } from 'src/entities/category';
import { DegtreeOfEducation } from 'src/entities/degtree-of-education';
import { Gender } from 'src/entities/gender';

export class EditDoctorDTO {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  phone2?: string;

  @IsOptional()
  @IsString()
  @IsEnum(DegtreeOfEducation)
  degreeOfEducation?: DegtreeOfEducation;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  workingFields?: (number | CategoryEntity)[];

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
