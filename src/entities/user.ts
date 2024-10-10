import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { CoreEntity } from './core';
import { DegtreeOfEducation } from './degtree-of-education';
import { Gender } from './gender';
import { CategoryEntity } from './category';
import { ScheduleEntity } from './schedule';
import { OrderEntity } from './order';
import { UserType } from './user-type';

@Entity({ name: '_users' })
export class UserEntity extends CoreEntity {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'phone2', nullable: true })
  phone2: string;

  @Column({ name: 'bio', nullable: true })
  bio: string;

  @Column({ name: 'address', nullable: true })
  address: string;

  @Column({ name: 'degree_of_education', nullable: true })
  degreeOfEducation: DegtreeOfEducation;

  @Column({ name: 'gender', nullable: true })
  gender: Gender;

  @Column({ name: 'image', nullable: true })
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

  @Column({ name: 'user_type' })
  type: UserType;
}
