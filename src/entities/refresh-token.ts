import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './core';
import { UserEntity } from './user';

@Entity({ name: '_refresh_tokens' })
export class RefreshTokenEntity extends CoreEntity {
  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
