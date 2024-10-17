import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SubmitTransactionDTO } from 'src/dtos/submit-transaction';
import { VerifyTransactionDTO } from 'src/dtos/verify-transaction.dto';
import { VerifyZarinpalTransactionResponseDTO } from 'src/dtos/verify-zarinpal-transaction-response.dto';
import { ZarinpalRequestGatewayResponseDTO } from 'src/dtos/zarinpal-request-gateway-response.dto';
import { OrderEntity } from 'src/entities/order';
import { OrderStatus } from 'src/entities/order-status';
import { TransactionEntity } from 'src/entities/transaction';
import { TransactionStatus } from 'src/entities/transaction-status';

@Injectable()
export class TransactionService {
  constructor(@Inject() private readonly configService: ConfigService) {}

  async submitTransaction(dto: SubmitTransactionDTO) {
    const requestedPayGateway =
      await axios.post<ZarinpalRequestGatewayResponseDTO>(
        this.getZarinpalRequestGatewayUrl(),
        {
          merchant_id: this.getZarinpalMerchantId(),
          amount: this.getZarinpalAmount(),
          callback_url: this.getZarinpalCallbackUrl(),
          description: 'd',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    if (!requestedPayGateway.data?.data?.authority) {
      return;
    }

    const authority = requestedPayGateway.data.data.authority;

    return TransactionEntity.save(
      TransactionEntity.create({
        amount: this.getZarinpalAmount(),
        order: dto.order,
        payedLink: this.getZarinpalPayLink(authority),
        authority: authority,
        status: TransactionStatus.NotPayed,
        customer: dto.customer,
        doctor: dto.doctor,
      }),
    );
  }

  async getTransactions(page: number, limit: number) {
    const content = await TransactionEntity.find({
      skip: page * limit,
      take: limit,
      relations: { doctor: true, customer: true, order: true },
      order: { createdAt: -1 },
    });
    const count = await TransactionEntity.count();
    return { content, count };
  }

  async verifyTransaction(dto: VerifyTransactionDTO) {
    const transaction = await TransactionEntity.findOne({
      where: { authority: dto.authority },
    });

    if (!transaction) {
      throw new NotFoundException('error: invalid transaction authority');
    }

    const verifyResponse =
      await axios.post<VerifyZarinpalTransactionResponseDTO>(
        this.getZarinpalVerify(),
        {
          merchant_id: this.getZarinpalMerchantId(),
          amount: this.getZarinpalAmount(),
          authority: dto.authority,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

    if (!verifyResponse?.data?.data?.code) {
      throw new BadRequestException("error: can't verify");
    }

    if (verifyResponse?.data?.data?.code === 101) {
      throw new BadRequestException('error: this transaction verify before');
    }

    transaction.refId = verifyResponse?.data?.data?.ref_id;
    transaction.payedAt = new Date();
    transaction.status = TransactionStatus.Payed;
    await OrderEntity.update(
      { transaction: { id: transaction.id } },
      { status: OrderStatus.Pending },
    );
    await transaction.save();
  }

  private getZarinpalRequestGatewayUrl() {
    return this.configService.get('ZARINPAL_REQUEST');
  }

  private getZarinpalCallbackUrl() {
    return this.configService.get('ZARINPAL_CALLBACK_URL');
  }

  private getZarinpalMerchantId() {
    return this.configService.get('ZARINPAL_MERCHANT_ID');
  }

  private getZarinpalVerify() {
    return this.configService.get('ZARINPAL_VERIFY_PAY');
  }

  private getZarinpalPayLink(authority: string) {
    return this.configService.get('ZARINPAL_START_PAY') + authority;
  }

  private getZarinpalAmount() {
    return +this.configService.get<number>('ORDER_AMOUNT');
  }
}
