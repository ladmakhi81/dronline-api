import { Injectable, NotFoundException } from '@nestjs/common';
import moment from 'moment';
import { AddDoctorScheduleDTO } from 'src/dtos/add-doctor-schedule';
import { AddScheduleByDoctor } from 'src/dtos/add-schedule-by-doctor';
import { LocationEntity } from 'src/entities/location';
import { ScheduleEntity } from 'src/entities/schedule';
import { UserEntity } from 'src/entities/user';
import { UserType } from 'src/entities/user-type';

@Injectable()
export class ScheduleService {
  async createDoctorSchedule(dto: AddDoctorScheduleDTO) {
    const doctor = await UserEntity.findOne({
      where: { id: dto.doctor, type: UserType.Doctor },
    });
    if (!doctor) {
      throw new NotFoundException('error: doctor is not found');
    }
    if (dto.location) {
      dto.location = (await LocationEntity.findOne({
        where: { id: dto.location as number },
      })) as LocationEntity;
      if (!dto.location) {
        throw new NotFoundException('error: location is not found');
      }
    } else {
      delete dto.location;
      delete dto.room;
    }
    return ScheduleEntity.save(
      ScheduleEntity.create({
        day: dto.day,
        endHour: dto.endHour,
        startHour: dto.startHour,
        doctor,
        type: dto.type,
        room: dto.room,
        location: dto.location as LocationEntity,
      }),
    );
  }

  async createScheduleByDoctor(doctor: UserEntity, dto: AddScheduleByDoctor) {
    const location = await LocationEntity.findOne({
      where: { id: dto.location },
    });
    if (!location) {
      throw new NotFoundException('error: location is not found');
    }
    return ScheduleEntity.save(
      ScheduleEntity.create({
        day: dto.day,
        endHour: dto.endHour,
        startHour: dto.startHour,
        location,
        doctor,
        type: dto.type,
        room: dto.room,
      }),
    );
  }

  async deleteSchedule(id: number) {
    const schedule = await ScheduleEntity.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException('error: schedule is not found');
    }
    await schedule.remove();
  }

  private prepareGetDoctorScheduleParam(query: Record<string, any>) {
    let where: Record<string, any> = {};
    if (query['day']) where['day'] = query['day'];
    if (query['location']) where['location'] = { id: query['location'] };
    if (query['room']) where['room'] = query['room'];
    if (query['type']) where['type'] = query['type'];
    if (query['startHour']) where['startHour'] = query['startHour'];
    if (query['endHour']) where['endHour'] = query['endHour'];
    return where;
  }

  async getDoctorSchedule(
    doctorId: number,
    page: number,
    limit: number,
    query: Record<string, any>,
  ) {
    let where: Record<string, any> = {
      doctor: { id: doctorId },
      ...this.prepareGetDoctorScheduleParam(query),
    };
    const doctor = await UserEntity.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('error: doctor is not found');
    }
    const content = await ScheduleEntity.find({
      where,
      order: { createdAt: -1 },
      skip: limit * page,
      take: limit,
      relations: {
        location: true,
        doctor: true,
      },
    });
    const count = await ScheduleEntity.count({
      where,
    });
    return { content, count };
  }

  async getSchedules(page: number, limit: number, query: Record<string, any>) {
    let where: Record<string, any> = {};

    if (query.day) {
      where = { ...where, day: query.day };
    }

    if (query.doctor) {
      where = { ...where, doctor: { id: query.doctor } };
    }

    if (query.type) {
      where = { ...where, type: query.type };
    }

    if (query.startHour) {
      where = { ...where, startHour: query.startHour };
    }

    if (query.endHour) {
      where = { ...where, endHour: query.endHour };
    }

    const count = await ScheduleEntity.count();
    const content = await ScheduleEntity.find({
      where,
      relations: { doctor: true, location: true, daysOff: true },
      skip: limit * page,
      take: limit,
      order: { createdAt: -1 },
    });
    return { content, count };
  }
}
