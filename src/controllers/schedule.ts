import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user';
import { AddDoctorScheduleDTO } from 'src/dtos/add-doctor-schedule';
import { AddScheduleByDoctor } from 'src/dtos/add-schedule-by-doctor';
import { UserEntity } from 'src/entities/user';
import { UserType } from 'src/entities/user-type';
import { AccessTokenGuard } from 'src/guards/access-token';
import { RoleCheckerGuard } from 'src/guards/role-checker';
import { ScheduleService } from 'src/services/schedule';

@Controller('/schedules')
export class ScheduleController {
  constructor(@Inject() private readonly scheduleService: ScheduleService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RoleCheckerGuard)
  @SetMetadata('user-type', UserType.Admin)
  createSchedule(@Body() dto: AddDoctorScheduleDTO) {
    return this.scheduleService.createDoctorSchedule(dto);
  }

  @Post('/own')
  @UseGuards(AccessTokenGuard, RoleCheckerGuard)
  @SetMetadata('user-type', UserType.Doctor)
  createScheduleByDoctor(
    @CurrentUser() doctor: UserEntity,
    @Body() dto: AddScheduleByDoctor,
  ) {
    return this.scheduleService.createScheduleByDoctor(doctor, dto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RoleCheckerGuard)
  @SetMetadata('user-type', UserType.Admin)
  deleteSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.deleteSchedule(id);
  }

  @Get('/doctor/:id')
  getScheduleOfDoctor(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() query: Record<string, any>,
  ) {
    return this.scheduleService.getDoctorSchedule(
      id,
      Number.isNaN(+page) ? 0 : +page,
      Number.isNaN(+limit) ? 10 : +limit,
      query || {},
    );
  }

  @Get('/own')
  @UseGuards(AccessTokenGuard, RoleCheckerGuard)
  @SetMetadata('user-type', UserType.Doctor)
  getOwnSchedule(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() query: Record<string, any>,
    @CurrentUser() doctor: UserEntity,
  ) {
    return this.scheduleService.getDoctorSchedule(
      doctor.id,
      Number.isNaN(+page) ? 0 : +page,
      Number.isNaN(+limit) ? 10 : +limit,
      query || {},
    );
  }
}
