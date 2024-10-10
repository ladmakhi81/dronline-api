import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignupPatientDto } from 'src/dtos/signup-patient';
import { UserEntity } from 'src/entities/user';
import * as bcrypt from 'bcryptjs';
import { UserType } from 'src/entities/user-type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from 'src/entities/refresh-token';
import * as moment from 'moment';
import { randomBytes } from 'crypto';
import { SigninDto } from 'src/dtos/signin';
import { ChangePasswordDTO } from 'src/dtos/change-password';
import { ChangePasswordByAdminDTO } from 'src/dtos/change-password-by-admin';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly jwtService: JwtService,
    @Inject() private readonly configService: ConfigService,
  ) {}

  async signupPatient(dto: SignupPatientDto) {
    const isDuplicated = await this.getByPhoneNumber(dto.phone);
    if (isDuplicated) {
      throw new ConflictException('error: phone number duplicated');
    }
    const hashedPassword = await this.hashPassword(dto.password);
    const user = await UserEntity.save(
      UserEntity.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: hashedPassword,
        isActive: true,
        type: UserType.Patient,
        phone: dto.phone,
      }),
    );
    const accessToken = await this.generateToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async signin(dto: SigninDto) {
    const user = await this.getByPhoneNumber(dto.phone);
    if (
      !user ||
      user.type !== dto.type ||
      !(await this.comparePassword(dto.password, user.password))
    ) {
      throw new NotFoundException('error: user not found');
    }
    await this.deleteRefreshTokens(user);
    const accessToken = await this.generateToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async changePasswordByAdmin(id: number, dto: ChangePasswordByAdminDTO) {
    const user = await this.getById(id);
    if (!user) {
      throw new NotFoundException('error: user is not found');
    }
    user.password = await this.hashPassword(dto.password);
    await user.save();
    await this.deleteRefreshTokens(user);
    return;
  }

  async updateToken(refreshTokenCode: string, user: UserEntity) {
    const refreshToken = await RefreshTokenEntity.findOne({
      where: { refreshToken: refreshTokenCode, user: { id: user.id } },
    });
    if (!refreshToken) {
      throw new NotFoundException('error: refresh token is not found');
    }
    if (
      moment(refreshToken.expiresAt, 'YYYY/MM/DD HH:mm').isBefore(
        moment(moment.now(), 'YYYY/MM/DD HH:mm'),
      )
    ) {
      throw new NotFoundException('error: refresh token expired');
    }
    const accessToken = await this.generateToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);
    await this.deleteRefreshTokens(user);
    return { accessToken, refreshToken: newRefreshToken };
  }

  async changePassword(dto: ChangePasswordDTO, loggedInUser: UserEntity) {
    const user = await UserEntity.findOne({ where: { id: loggedInUser.id } });
    if (!user || !(await this.comparePassword(dto.password, user.password))) {
      throw new NotFoundException('user not found');
    }
    await this.deleteRefreshTokens(user);
    user.password = await this.hashPassword(dto.newPassword);
    await user.save();
    return;
  }

  getByPhoneNumber(phone: string) {
    return UserEntity.findOne({ where: { phone } });
  }

  getById(id: number) {
    return UserEntity.findOne({ where: { id } });
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 8);
  }

  comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  getSigninKey() {
    return this.configService.get<string>('SECRET_KEY');
  }

  generateToken(user: UserEntity) {
    return this.jwtService.sign(
      { id: user.id, type: user.type },
      { secret: this.getSigninKey(), expiresIn: '1h' },
    );
  }

  async generateRefreshToken(user: UserEntity) {
    const { refreshToken } = await RefreshTokenEntity.save(
      RefreshTokenEntity.create({
        expiresAt: moment().add(1, 'day'),
        refreshToken: randomBytes(10).toString('hex'),
        user,
      }),
    );

    return refreshToken;
  }

  deleteRefreshTokens(user: UserEntity) {
    return RefreshTokenEntity.delete({ user });
  }
}
