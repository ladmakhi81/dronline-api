import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth';
import { AuthService } from './services/auth';
import { AccessTokenGuard } from './guards/access-token';
import { JsonWebTokenStrategy } from './strategies/access-token-strategy';
import { JwtService } from '@nestjs/jwt';
import { CategoryEntity } from './entities/category';
import { DaysOffEntity } from './entities/days-off';
import { LocationEntity } from './entities/location';
import { OrderEntity } from './entities/order';
import { RefreshTokenEntity } from './entities/refresh-token';
import { ScheduleEntity } from './entities/schedule';
import { TicketEntity } from './entities/ticket';
import { UserDocumentationEntity } from './entities/user-documentation';
import { UserEntity } from './entities/user';
import { RoleCheckerGuard } from './guards/role-checker';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';
import { RefreshTokenGuard } from './guards/refresh-token';
import { CategoryController } from './controllers/category';
import { CategoryService } from './services/category';
import { LocationController } from './controllers/location';
import { LocationService } from './services/location';
import { UserService } from './services/user';
import { UserController } from './controllers/user';
import { UserAdminService } from './services/user-admin';
import { UserDoctorService } from './services/user-doctor';
import { UserPatientService } from './services/user-patient';
import { ScheduleService } from './services/schedule';
import { ScheduleController } from './controllers/schedule';
import { DaysOffService } from './services/days-off';
import { DaysOffController } from './controllers/days-off';
import { TransactionEntity } from './entities/transaction';
import { TransactionService } from './services/transaction';
import { OrderService } from './services/order';
import { OrderController } from './controllers/order';
import { TransactionController } from './controllers/transaction';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          database: configService.get<string>('DB_NAME'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          host: configService.get<string>('DB_HOST'),
          type: configService.get<string>('DB_TYPE') as any,
          port: configService.get<number>('DB_PORT'),
          autoLoadEntities: true,
          synchronize: true,
          entities: [
            CategoryEntity,
            DaysOffEntity,
            LocationEntity,
            OrderEntity,
            RefreshTokenEntity,
            ScheduleEntity,
            TicketEntity,
            UserDocumentationEntity,
            UserEntity,
            TransactionEntity,
          ],
        };
      },
    }),
  ],
  controllers: [
    AuthController,
    CategoryController,
    LocationController,
    UserController,
    ScheduleController,
    DaysOffController,
    OrderController,
    TransactionController,
  ],
  providers: [
    AuthService,
    AccessTokenGuard,
    JsonWebTokenStrategy,
    JwtService,
    RoleCheckerGuard,
    RefreshTokenStrategy,
    RefreshTokenGuard,
    CategoryService,
    LocationService,
    UserService,
    UserAdminService,
    UserDoctorService,
    UserPatientService,
    ScheduleService,
    DaysOffService,
    TransactionService,
    OrderService,
  ],
})
export class AppModule {}
