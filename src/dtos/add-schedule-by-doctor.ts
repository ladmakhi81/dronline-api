import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ScheduleType } from 'src/entities/schedule-type';

export class AddScheduleByDoctor {
  @IsNotEmpty()
  @IsString()
  startHour: string;

  @IsNotEmpty()
  @IsString()
  endHour: string;

  @IsNotEmpty()
  @IsNumber()
  day: number;

  @IsNotEmpty()
  @IsNumber()
  location: number;

  @IsNotEmpty()
  @IsNumber()
  room: number;

  @IsNotEmpty()
  @IsEnum(ScheduleType)
  type: ScheduleType;
}
