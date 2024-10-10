import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { CoreEntity } from './core';
import { DegtreeOfEducation } from './degtree-of-education';
import { Gender } from './gender';
import { CategoryEntity } from './category';
import { ScheduleEntity } from './schedule';
import { OrderEntity } from './order';

@Entity({ name: '_users' })
export class UserEntity extends CoreEntity {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'phone2', default: '' })
  phone2: string;

  @Column({ name: 'bio', default: '' })
  bio: string;

  @Column({ name: 'address', default: '' })
  address: string;

  @Column({ name: 'degree_of_education' })
  degreeOfEducation: DegtreeOfEducation;

  @Column({ name: 'gender', default: null })
  gender: Gender;

  @Column({ name: 'image', default: '' })
  image: string;

  @Column({ name: 'is_active' })
  isActive?: boolean;

  @Column({ name: 'password' })
  password: string;

  @OneToMany(() => OrderEntity, (orderEntity) => orderEntity.patient)
  orders: OrderEntity[];

  @ManyToMany(() => CategoryEntity, (categories) => categories.doctors)
  @JoinTable()
  workingFields: CategoryEntity[];

  @OneToMany(() => ScheduleEntity, (schedules) => schedules.doctor)
  schedules: ScheduleEntity[];

  @OneToMany(() => OrderEntity, (order) => order.doctor)
  patientsOrders: OrderEntity[];
}
