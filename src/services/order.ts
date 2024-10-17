import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderEntity } from 'src/entities/order';
import { OrderStatus } from 'src/entities/order-status';
import { ScheduleEntity } from 'src/entities/schedule';
import { UserEntity } from 'src/entities/user';
import { TransactionService } from './transaction';
import { SubmitOrderDTO } from 'src/dtos/submit-order';
import * as moment from 'moment';

@Injectable()
export class OrderService {
  constructor(
    @Inject() private readonly transactionService: TransactionService,
  ) {}

  async submitOrder(dto: SubmitOrderDTO) {
    const patient = await UserEntity.findOne({ where: { id: dto.patient } });
    if (!patient) {
      throw new NotFoundException('error: patient is not found');
    }
    const schedule = await ScheduleEntity.findOne({
      where: { id: dto.schedule },
      relations: { doctor: true, location: true },
    });
    if (!schedule) {
      throw new NotFoundException('error: schedule is not found');
    }

    if (
      moment(dto.date, 'YYYY-MM-DD').isBefore(
        moment(moment.now(), 'YYYY-MM-DD'),
      )
    ) {
      throw new BadRequestException('date is invalid');
    }

    const order = await OrderEntity.save(
      OrderEntity.create({
        patient,
        doctor: schedule.doctor,
        address: schedule?.location?.address,
        city: schedule?.location?.city,
        day: schedule.day,
        date: dto.date,
        room: schedule?.room,
        type: dto.type,
        startHour: schedule.startHour,
        endHour: schedule.endHour,
        status: OrderStatus.NotPayed,
      }),
    );

    await this.transactionService.submitTransaction({
      customer: patient,
      doctor: schedule.doctor,
      order,
    });

    return order;
  }
}