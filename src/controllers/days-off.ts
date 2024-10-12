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
import { BookDoctorDaysOffDTO } from 'src/dtos/book-days-off';
import { UserEntity } from 'src/entities/user';
import { UserType } from 'src/entities/user-type';
import { AccessTokenGuard } from 'src/guards/access-token';
import { RoleCheckerGuard } from 'src/guards/role-checker';
import { DaysOffService } from 'src/services/days-off';

@Controller('/days-off')
export class DaysOffController {
  constructor(@Inject() private readonly daysOffService: DaysOffService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  bookDaysOff(@Body() dto: BookDoctorDaysOffDTO) {
    return this.daysOffService.bookDaysOff(dto);
  }

  @Get('/page')
  getDaysOffPageable(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    return this.daysOffService.getDaysOffPageble(
      Number.isNaN(+page) ? 0 : +page,
      Number.isNaN(+limit) ? 10 : +limit,
    );
  }

  @Get('/grouped')
  getDaysOffGroupedByDoctor() {
    return this.daysOffService.getDaysOffGroupedByDoctor();
  }

  @Get('own')
  @UseGuards(AccessTokenGuard, RoleCheckerGuard)
  @SetMetadata('user-type', UserType.Doctor)
  getDaysOffByOwnDoctor(@CurrentUser() doctor: UserEntity) {
    return this.daysOffService.getDaysOffDoctor(doctor.id);
  }

  @Get('/:id')
  getDaysOffDoctor(@Param('id', ParseIntPipe) id: number) {
    return this.daysOffService.getDaysOffDoctor(id);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteDaysOff(@Param('id', ParseIntPipe) id: number) {
    return this.daysOffService.deleteDaysOff(id);
  }
}
