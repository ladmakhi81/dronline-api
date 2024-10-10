import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './core';
import { OrderEntity } from './order';

@Entity()
export class UserDocumentationEntity extends CoreEntity {
  @Column({ name: 'file' })
  file: string;

  @ManyToOne(() => OrderEntity)
  @JoinColumn()
  order: OrderEntity;
}
