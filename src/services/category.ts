import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDTO } from 'src/dtos/create-category';
import { UpdateCategoryDTO } from 'src/dtos/update-category';
import { CategoryEntity } from 'src/entities/category';
import { File } from 'src/types/file';
import * as path from 'path';
import { writeFileSync } from 'fs';

@Injectable()
export class CategoryService {
  async createCategory(dto: CreateCategoryDTO) {
    const duplicatedByName = await this.getByName(dto.name);
    if (duplicatedByName) {
      throw new ConflictException('error: name is duplicated');
    }
    return CategoryEntity.save(
      CategoryEntity.create({
        name: dto.name,
        icon: dto.icon,
      }),
    );
  }

  async updateCategory(id: number, dto: UpdateCategoryDTO) {
    const category = await this.getById(id);
    if (!category) {
      throw new NotFoundException('error: category is not found');
    }
    await CategoryEntity.update({ id }, dto);
  }

  async deleteCategory(id: number) {
    const category = await this.getById(id);
    if (!category) {
      throw new NotFoundException('error: category is not found');
    }
    category.remove();
    return;
  }

  async getCategories(page: number, limit: number) {
    const content = await CategoryEntity.find({
      skip: limit * page,
      take: page,
      order: { id: -1 },
      relations: { doctors: { workingFields: true } },
    });
    const count = await CategoryEntity.count({});
    return { content, count };
  }

  getById(id: number) {
    return CategoryEntity.findOne({ where: { id } });
  }

  getByName(name: string) {
    return CategoryEntity.findOne({ where: { name } });
  }

  uploadIcon(file: File) {
    const fileName = `${new Date().getTime()}-${
      Math.floor(Math.random() * 100000) + 2000000
    }${path.extname(file.originalname)}`;

    writeFileSync(
      path.join(__dirname, '..', '..', 'upload', fileName),
      file.buffer,
    );

    return { fileName };
  }
}
