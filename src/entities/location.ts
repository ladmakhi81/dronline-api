import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from './core';
import { ScheduleEntity } from './schedule';

@Entity({ name: '_locations' })
export class LocationEntity extends CoreEntity {
  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'address' })
  address: string;

  @OneToMany(() => ScheduleEntity, (scheduleEntity) => scheduleEntity.location)
  doctorSchedules: ScheduleEntity[];
}
