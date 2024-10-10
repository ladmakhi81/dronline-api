import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupPatientDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('IR')
  phone: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  lastName: string;
}
