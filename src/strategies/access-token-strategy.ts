import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/entities/user';

export class JsonWebTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(@Inject() configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }

  validate({ id }: { id: number }) {
    return UserEntity.findOne({ where: { id } });
  }
}
