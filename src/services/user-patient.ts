import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { CreatePatientDTO } from 'src/dtos/create-patient';
import { UserEntity } from 'src/entities/user';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { formatManualError } from 'src/utils/format-manual-error';
import { EditPatientDTO } from 'src/dtos/edit-patient';
import { UserType } from 'src/entities/user-type';
import { Not } from 'typeorm';

@Injectable()
export class UserPatientService {
  async createPatient(dto: CreatePatientDTO) {
    const dtoValidationErrors = await validate(
      plainToInstance(CreatePatientDTO, dto),
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
        password: dto.password,
        phone: dto.phone,
        isActive: true,
        type: UserType.Patient,
      }),
    );
  }

  async editPatientById(id: number, dto: EditPatientDTO) {
    const dtoValidationErrors = await validate(
      plainToInstance(EditPatientDTO, dto),
    );
    if (!!dtoValidationErrors.length) {
      throw new BadRequestException(formatManualError(dtoValidationErrors));
    }
    const patient = await UserEntity.findOne({
      where: { id, type: UserType.Patient },
    });
    if (!patient) {
      throw new NotFoundException('error: patient is not found');
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
