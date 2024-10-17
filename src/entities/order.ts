import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CoreEntity } from './core';
import { UserDocumentationEntity } from './user-documentation';
import { UserEntity } from './user';
import * as moment from 'moment';
import { ScheduleType } from './schedule-type';
import { OrderStatus } from './order-status';
import { TransactionEntity } from './transaction';

@Entity({ name: '_orders' })
export class OrderEntity extends CoreEntity {
  @OneToMany(
    () => UserDocumentationEntity,
    (userDocumentationEntity) => userDocumentationEntity.order,
  )
  documentation: UserDocumentationEntity[];

  @ManyToOne(() => UserEntity, (patient) => patient.orders)
  @JoinColumn()
  patient: UserEntity;

  @ManyToOne(() => UserEntity, (doctor) => doctor.patientsOrders)
  @JoinColumn()
  doctor: UserEntity;

  @Column({ name: 'day' })
  day: number;

  @Column({ name: 'city', nullable: true })
  city: string;

  @Column({ name: 'address', nullable: true })
  address: string;

  @Column({ name: 'date', default: moment.now() })
  date: string;

  @Column({ name: 'room', nullable: true })
  room: number;

  @Column({ name: 'type' })
  type: ScheduleType;

  @Column({ name: 'start_hour' })
  startHour: string;

  @Column({ name: 'end_hour' })
  endHour: string;

  @Column({ name: 'status', default: OrderStatus.Pending })
  status: OrderStatus = OrderStatus.Pending;

  @OneToOne(() => TransactionEntity, (transactions) => transactions.order)
  @JoinColumn()
  transaction: TransactionEntity;
}
