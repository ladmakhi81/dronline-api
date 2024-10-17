import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LocationEntity } from 'src/entities/location';
import { ScheduleType } from 'src/entities/schedule-type';

export class AddDoctorScheduleDTO {
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
  doctor: number;

  @IsOptional()
  @IsNumber()
  location: number | LocationEntity;

  @IsOptional()
  @IsNumber()
  room: number;

  @IsNotEmpty()
  @IsEnum(ScheduleType)
  type: ScheduleType;
}
