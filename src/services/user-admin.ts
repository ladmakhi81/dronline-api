import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateAdminDTO } from 'src/dtos/create-admin';
import { UserEntity } from 'src/entities/user';
import * as bcrypt from 'bcryptjs';
import { UserType } from 'src/entities/user-type';
import { plainToInstance } from 'class-transformer';
import { formatManualError } from 'src/utils/format-manual-error';
import { EditAdminDTO } from 'src/dtos/edit-admin';
import { Not } from 'typeorm';

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

  async editAdminById(id: number, dto: EditAdminDTO) {
    const dtoValidationErrors = await validate(
      plainToInstance(EditAdminDTO, dto),
    );
    if (!!dtoValidationErrors.length) {
      throw new BadRequestException(formatManualError(dtoValidationErrors));
    }
    const admin = await UserEntity.findOne({
      where: { id, type: UserType.Admin },
    });
    if (!admin) {
      throw new NotFoundException('error: admin is not found');
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 8);
    }
    if (dto.phone) {
      if (
        (await UserEntity.count({ where: { id: Not(id), phone: dto.phone } })) >
        0
      ) {
        throw new ConflictException('error: user duplicate by phone');
      }
    }
    await UserEntity.update({ id }, dto);
  }
}
