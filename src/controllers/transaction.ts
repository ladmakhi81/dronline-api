import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VerifyTransactionDTO } from 'src/dtos/verify-transaction.dto';
import { AccessTokenGuard } from 'src/guards/access-token';
import { TransactionService } from 'src/services/transaction';

@Controller('/transactions')
export class TransactionController {
  constructor(
    @Inject() private readonly transactionService: TransactionService,
  ) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getTransactions(@Query('page') page: string, @Query('limit') limit: string) {
    return this.transactionService.getTransactions(
      Number.isNaN(+page) ? 0 : +page,
      Number.isNaN(+limit) ? 10 : +limit,
    );
  }

  @Post('verify')
  verifyTransaction(@Body() dto: VerifyTransactionDTO) {
    return this.transactionService.verifyTransaction(dto);
  }
}
