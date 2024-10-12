import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDoctorService } from './user-doctor';
import { UserAdminService } from './user-admin';
import { UserPatientService } from './user-patient';
import { UserType } from 'src/entities/user-type';
import { CreateAdminDTO } from 'src/dtos/create-admin';
import { CreateDoctorDTO } from 'src/dtos/create-doctor';
import { CreatePatientDTO } from 'src/dtos/create-patient';
import { File } from 'src/types/file';
import { Jimp as jimp } from 'jimp';
import * as path from 'path';
import { UserEntity } from 'src/entities/user';

@Injectable()
export class UserService {
  constructor(
    @Inject() private readonly userDoctorService: UserDoctorService,
    @Inject() private readonly userPatientService: UserPatientService,
    @Inject() private readonly userAdminService: UserAdminService,
  ) {}

  createUser(type: string, dto: Record<string, any>) {
    switch (type as UserType) {
      case UserType.Admin:
        return this.userAdminService.createAdmin(dto as CreateAdminDTO);
      case UserType.Doctor:
        return this.userDoctorService.createDoctor(dto as CreateDoctorDTO);
      case UserType.Patient:
        return this.userPatientService.createPatient(dto as CreatePatientDTO);
      default:
        throw new BadRequestException('error: invalid user type');
    }
  }

  editUser(type: string, id: number, dto: Record<string, any>) {
    switch (type as UserType) {
      case UserType.Admin:
        return this.userAdminService.editAdminById(id, dto);
      case UserType.Doctor:
        return this.userDoctorService.editDoctorById(id, dto);
      case UserType.Patient:
        return this.userPatientService.editPatientById(id, dto);
    }
  }

  async uploadImage(file: File) {
    try {
      const filePath = `/upload/${new Date().getTime()}-${Math.floor(
        Math.random() * 100000000,
      )}.png`;
      const image = await jimp.read(file.buffer);
      image.resize({ h: 320, w: 320 });
      image.write(path.join(__dirname, '..', '..', filePath) as any);
      return { filePath };
    } catch (error) {
      return '';
    }
  }

  getUsers(page: number, limit: number, query: Record<string, any>) {
    let where: Record<string, any> = {};
    if (query.type) {
      where.type = query.type;
    }
    return UserEntity.find({
      where,
      skip: limit * page,
      take: limit,
      relations: { workingFields: true },
      order: { createdAt: -1 },
    });
  }

  async getUserById(id: number) {
    const user = await UserEntity.findOne({
      where: { id },
      relations: {
        patientsOrders: true,
        orders: true,
        schedules: true,
        workingFields: true,
      },
    });
    if (!user) {
      throw new NotFoundException('error: user is not found');
    }
    return user;
  }

  async deleteById(id: number) {
    const user = await this.getUserById(id);
    await user.remove();
  }
}
