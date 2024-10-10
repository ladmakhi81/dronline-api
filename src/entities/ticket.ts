import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { jsonTransformer } from './json-transformer';
import { UserEntity } from './user';
import { TicketStatus } from './ticket-status';

@Entity({ name: '_tickets' })
export class TicketEntity extends BaseEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({
    name: 'attachments',
    type: 'text',
    default: '[]',
    transformer: jsonTransformer,
  })
  attachments: string[] = [];

  @Column({ name: 'answer', default: null })
  answer?: string;

  @Column({ name: 'answer_at', default: null })
  answerAt?: Date;

  @Column({ name: 'status', default: TicketStatus.Open })
  status: TicketStatus;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  patient: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'close_at', default: null })
  closeAt?: Date;

  @Column({ name: 'title' })
  title: string;

  @OneToMany(() => TicketEntity, (c) => c.parent, { nullable: true })
  childrens: TicketEntity[];

  @ManyToOne(() => TicketEntity, (p) => p.childrens, { nullable: true })
  @JoinColumn()
  parent: TicketEntity;
}
