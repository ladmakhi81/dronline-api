import { IsNotEmpty } from 'class-validator';
import { ScheduleType } from 'src/entities/schedule-type';

export class SubmitOrderDTO {
  @IsNotEmpty()
  patient: number;

  @IsNotEmpty()
  type: ScheduleType;

  @IsNotEmpty()
  schedule: number;

  @IsNotEmpty()
  date: string;
}
