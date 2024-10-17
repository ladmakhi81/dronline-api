import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CoreEntity } from './core';
import { OrderEntity } from './order';
import { TransactionStatus } from './transaction-status';
import { UserEntity } from './user';

@Entity({ name: '_transactions' })
export class TransactionEntity extends CoreEntity {
  @Column({ name: 'amount' })
  amount: number;

  @OneToOne(() => OrderEntity, (order) => order.transaction)
  order: OrderEntity;

  @Column({ name: 'payed_at', nullable: true })
  payedAt: Date;

  @Column({ name: 'payed_link' })
  payedLink: string;

  @Column({ name: 'merchant_id' })
  authority: string;

  @Column({ name: 'ref_id', nullable: true })
  refId: number;

  @Column({ name: 'status' })
  status: TransactionStatus;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  customer: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  doctor: UserEntity;
}
