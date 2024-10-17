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
import { In, Not } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { formatManualError } from 'src/utils/format-manual-error';
import { UserType } from 'src/entities/user-type';
import { EditDoctorDTO } from 'src/dtos/edit-doctor';

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

  async editDoctorById(id: number, dto: EditDoctorDTO) {
    const dtoValidationErrors = await validate(
      plainToInstance(EditDoctorDTO, dto),
    );
    if (!!dtoValidationErrors.length) {
      throw new BadRequestException(formatManualError(dtoValidationErrors));
    }
    const doctor = await UserEntity.findOne({
      where: { id, type: UserType.Doctor },
    });
    if (!doctor) {
      throw new NotFoundException('error: user is not found');
    }
    if (dto.phone2 || dto.phone) {
      if (
        (await UserEntity.count({
          where: [
            { phone: dto.phone, id: Not(id) },
            {
              phone2: dto.phone2,
              id: Not(id),
            },
          ],
        })) > 0
      ) {
        throw new BadRequestException('error: user duplicate by phone');
      }
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 8);
    }
    if (dto.workingFields?.length) {
      const newWorkingFields = await CategoryEntity.find({
        where: { id: In(dto.workingFields as number[]) },
      });

      if (dto.workingFields.length !== newWorkingFields.length) {
        throw new NotFoundException('error: working fields is not found');
      }
      doctor.workingFields = newWorkingFields;
      await doctor.save();
      delete dto.workingFields;
    }
    await UserEntity.update({ id }, { ...dto } as any);
  }
}
