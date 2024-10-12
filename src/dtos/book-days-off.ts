import { IsNotEmpty } from 'class-validator';

export class BookDoctorDaysOffDTO {
  @IsNotEmpty()
  schedule: number;

  @IsNotEmpty()
  date: string;
}
