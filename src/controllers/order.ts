import {
  Body,
  Controller,
  Inject,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { SubmitOrderDTO } from 'src/dtos/submit-order';
import { UserType } from 'src/entities/user-type';
import { AccessTokenGuard } from 'src/guards/access-token';
import { RoleCheckerGuard } from 'src/guards/role-checker';
import { OrderService } from 'src/services/order';

@Controller('/orders')
export class OrderController {
  constructor(@Inject() private readonly orderService: OrderService) {}

  @Post('/admin/submit')
  @SetMetadata('user-type', UserType.Admin)
  @UseGuards(AccessTokenGuard, RoleCheckerGuard)
  submitOrderByAdmin(@Body() dto: SubmitOrderDTO) {
    return this.orderService.submitOrder(dto);
  }
}
