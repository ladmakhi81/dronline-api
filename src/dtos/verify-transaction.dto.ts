import { IsNotEmpty } from 'class-validator';

export class VerifyTransactionDTO {
  @IsNotEmpty()
  authority: string;
}
