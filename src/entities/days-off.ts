import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './core';
import { ScheduleEntity } from './schedule';

@Entity({ name: '_days_off' })
export class DaysOffEntity extends CoreEntity {
  @ManyToOne(() => ScheduleEntity, {
    cascade: true,
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  schedule: ScheduleEntity;

  @Column({ name: 'date', default: '' })
  date: string;
}
