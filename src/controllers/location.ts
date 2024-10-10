import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateLocationDTO } from 'src/dtos/create-location';
import { UpdateLocationDTO } from 'src/dtos/update-location';
import { AccessTokenGuard } from 'src/guards/access-token';
import { LocationService } from 'src/services/location';

@Controller('/locations')
export class LocationController {
  constructor(@Inject() private readonly locationService: LocationService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  createLocation(@Body() dto: CreateLocationDTO) {
    return this.locationService.createLocation(dto);
  }

  @Patch(':id')
  updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDTO,
  ) {
    return this.locationService.updateLocation(id, dto);
  }

  @Delete(':id')
  deleteLocation(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.deleteLocation(id);
  }

  @Get()
  getLocations(@Query('page') page: string, @Query('limit') limit: string) {
    return this.locationService.getLocations(
      Number.isNaN(+page) ? 0 : +page,
      Number.isNaN(+limit) ? 0 : +limit,
    );
  }
}
