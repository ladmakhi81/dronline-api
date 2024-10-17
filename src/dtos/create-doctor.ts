import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { DegtreeOfEducation } from 'src/entities/degtree-of-education';
import { Gender } from 'src/entities/gender';

export class CreateDoctorDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  phone2: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(DegtreeOfEducation)
  degreeOfEducation: DegtreeOfEducation;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsArray()
  workingFields: number[];
}
