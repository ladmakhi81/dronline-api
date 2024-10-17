import { OrderEntity } from 'src/entities/order';
import { UserEntity } from 'src/entities/user';

export interface SubmitTransactionDTO {
  order: OrderEntity;
  doctor: UserEntity;
  customer: UserEntity;
}
