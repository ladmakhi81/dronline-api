import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { CreatePatientDTO } from 'src/dtos/create-patient';
import { UserEntity } from 'src/entities/user';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { formatManualError } from 'src/utils/format-manual-error';

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
      }),
    );
  }
}
