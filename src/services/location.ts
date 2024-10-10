import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDTO } from 'src/dtos/create-location';
import { UpdateLocationDTO } from 'src/dtos/update-location';
import { LocationEntity } from 'src/entities/location';

@Injectable()
export class LocationService {
  createLocation(dto: CreateLocationDTO) {
    return LocationEntity.save(
      LocationEntity.create({
        address: dto.address,
        city: dto.city,
      }),
    );
  }

  async updateLocation(id: number, dto: UpdateLocationDTO) {
    const location = await this.getById(id);
    if (!location) {
      throw new NotFoundException('error: location is not found');
    }
    await LocationEntity.update({ id }, dto);
  }

  async deleteLocation(id: number) {
    const location = await this.getById(id);
    if (!location) {
      throw new NotFoundException('error: location is not found');
    }
    await location.remove();
  }

  async getLocations(page: number, limit: number) {
    const content = await LocationEntity.find({
      skip: limit * page,
      take: limit,
      order: { id: -1 },
    });
    const count = await LocationEntity.count();
    return { content, count };
  }

  getById(id: number) {
    return LocationEntity.findOne({ where: { id } });
  }
}
