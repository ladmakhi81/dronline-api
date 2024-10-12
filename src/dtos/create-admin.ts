import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAdminDTO {
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
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
