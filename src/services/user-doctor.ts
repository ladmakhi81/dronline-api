import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateDoctorDTO } from 'src/dtos/create-doctor';
import { CategoryEntity } from 'src/entities/category';
import { UserEntity } from 'src/entities/user';
import { In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { formatManualError } from 'src/utils/format-manual-error';
import { UserType } from 'src/entities/user-type';

@Injectable()
export class UserDoctorService {
  async createDoctor(dto: CreateDoctorDTO) {
    const dtoValidationErrors = await validate(
      plainToInstance(CreateDoctorDTO, dto),
    );
    if (!!dtoValidationErrors.length) {
      throw new BadRequestException(formatManualError(dtoValidationErrors));
    }
    const phoneDuplicated = await UserEntity.findOne({
      where: [{ phone: dto.phone }, { phone2: dto.phone2 }],
    });
    if (phoneDuplicated) {
      throw new ConflictException('error: user phone duplicated');
    }
    const workingFields = await CategoryEntity.find({
      where: {
        id: In(dto.workingFields),
      },
    });
    if (workingFields.length !== dto.workingFields.length) {
      throw new NotFoundException('error: working fields is not found');
    }
    dto.password = await bcrypt.hash(dto.password, 8);
    return UserEntity.save(
      UserEntity.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: dto.password,
        workingFields: workingFields,
        phone: dto.phone,
        phone2: dto.phone2,
        degreeOfEducation: dto.degreeOfEducation,
        address: dto.address,
        bio: dto.bio,
        gender: dto.gender,
        image: dto.image,
        isActive: true,
        type: UserType.Doctor,
      }),
    );
  }
}
