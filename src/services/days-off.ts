import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookDoctorDaysOffDTO } from 'src/dtos/book-days-off';
import { DaysOffEntity } from 'src/entities/days-off';
import { ScheduleEntity } from 'src/entities/schedule';
import { UserEntity } from 'src/entities/user';
import { UserType } from 'src/entities/user-type';
import { DataSource, IsNull, Not } from 'typeorm';

@Injectable()
export class DaysOffService {
  constructor(@Inject() private readonly datasource: DataSource) {}

  async bookDaysOff(dto: BookDoctorDaysOffDTO) {
    const schedule = await ScheduleEntity.findOne({
      where: { id: dto.schedule },
    });
    if (!schedule) {
      throw new NotFoundException('error: schedule not found');
    }
    return DaysOffEntity.save(
      DaysOffEntity.create({
        date: dto.date,
        schedule,
      }),
    );
  }

  async getDaysOffPageble(page: number, limit: number) {
    const content = await DaysOffEntity.find({
      order: { createdAt: -1 },
      take: limit,
      skip: limit * page,
      relations: { schedule: { doctor: true, location: true } },
    });
    const count = await DaysOffEntity.count();
    return { content, count };
  }

  getDaysOffGroupedByDoctor() {
    return this.datasource
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.schedules', 'schedules')
      .leftJoinAndSelect('schedules.daysOff', 'daysOff')
      .where('user.type = :userType', { userType: UserType.Doctor })
      .andWhere('daysOff.id IS NOT NULL')
      .getMany();
  }

  getDaysOffDoctor(doctorId: number) {
    return DaysOffEntity.find({
      where: { schedule: { doctor: { id: doctorId } } },
      relations: { schedule: true },
    });
  }

  async deleteDaysOff(daysOffId: number) {
    const daysOff = await DaysOffEntity.findOne({ where: { id: daysOffId } });
    if (!daysOff) {
      throw new NotFoundException('error: days off not found');
    }
    await daysOff.remove();
  }
}
