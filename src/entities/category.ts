import { Column, Entity, ManyToMany } from 'typeorm';
import { CoreEntity } from './core';
import { UserEntity } from './user';

@Entity()
export class CategoryEntity extends CoreEntity {
  @Column({ name: 'fa_name' })
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.workingFields)
  doctors: UserEntity[];

  @Column({ name: 'icon', default: null })
  icon?: string;
}
