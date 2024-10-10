import {
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { UserType } from 'src/entities/user-type';

export class SigninDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('IR')
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType;
}
