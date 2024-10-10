import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}
