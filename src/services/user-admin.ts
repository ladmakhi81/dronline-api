import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateAdminDTO } from 'src/dtos/create-admin';
import { UserEntity } from 'src/entities/user';
import * as bcrypt from 'bcryptjs';
import { UserType } from 'src/entities/user-type';
import { plainToInstance } from 'class-transformer';
import { formatManualError } from 'src/utils/format-manual-error';

@Injectable()
export class UserAdminService {
  async createAdmin(dto: CreateAdminDTO) {
    const dtoValidationErrors = await validate(
      plainToInstance(CreateAdminDTO, dto),
    );
    if (!!dtoValidationErrors.length) {
      throw new BadRequestException(formatManualError(dtoValidationErrors));
    }
    const phoneDuplicated = await UserEntity.findOne({
      where: { phone: dto.phone },
    });
    if (phoneDuplicated) {
      throw new ConflictException('error: user phone duplicated');
    }
    dto.password = await bcrypt.hash(dto.password, 8);
    return UserEntity.save(
      UserEntity.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        password: dto.password,
        isActive: dto.isActive,
        type: UserType.Admin,
      }),
    );
  }
}
