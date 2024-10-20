import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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

  @Get()
  @UseGuards(AccessTokenGuard, RoleCheckerGuard)
  @SetMetadata('user-type', UserType.Admin)
  getOrders(
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query() query: Record<string, any>,
  ) {
    return this.orderService.getOrders(
      Number.isNaN(+page) ? 0 : +page,
      Number.isNaN(+limit) ? 10 : +limit,
      query,
    );
  }

  @Patch('cancel/:id')
  @UseGuards(AccessTokenGuard, RoleCheckerGuard)
  @SetMetadata('user-type', UserType.Admin)
  cancelOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.cancelOrder(id);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RoleCheckerGuard)
  @SetMetadata('user-type', UserType.Admin)
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(id);
  }
}
