import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from './core';
import { DaysOffEntity } from './days-off';
import { ScheduleType } from './schedule-type';
import { UserEntity } from './user';
import { LocationEntity } from './location';

@Entity({ name: '_schedules' })
export class ScheduleEntity extends CoreEntity {
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.schedules, {
    onDelete: 'NO ACTION',
    cascade: false,
  })
  @JoinColumn()
  doctor: UserEntity;

  @Column({ name: 'day' })
  day: number;

  @Column({ name: 'start_hour' })
  startHour: string;

  @Column({ name: 'end_hour' })
  endHour: string;

  @ManyToOne(() => LocationEntity, (location) => location.doctorSchedules, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  location: LocationEntity;

  @Column({ name: 'type' })
  type: ScheduleType;

  @Column({ name: 'room', nullable: true })
  room: number;

  @OneToMany(() => DaysOffEntity, (daysOff) => daysOff.schedule)
  daysOff: DaysOffEntity[];
}
