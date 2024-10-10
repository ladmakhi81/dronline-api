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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDTO } from 'src/dtos/create-category';
import { UpdateCategoryDTO } from 'src/dtos/update-category';
import { AccessTokenGuard } from 'src/guards/access-token';
import { CategoryService } from 'src/services/category';
import { File } from 'src/types/file';

@Controller('/categories')
export class CategoryController {
  constructor(@Inject() private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  createCategory(@Body() dto: CreateCategoryDTO) {
    return this.categoryService.createCategory(dto);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  updateCategoryById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDTO,
  ) {
    return this.categoryService.updateCategory(id, dto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }

  @Get()
  getCategories(@Query('limit') limit: string, @Query('page') page: string) {
    return this.categoryService.getCategories(
      Number.isNaN(+page) ? 0 : Number(page),
      Number.isNaN(+limit) ? 0 : Number(limit),
    );
  }

  @Post('upload-icon')
  @UseInterceptors(FileInterceptor('icon'))
  @UseGuards(AccessTokenGuard)
  uploadIcon(@UploadedFile() iconFile: File) {
    return this.categoryService.uploadIcon(iconFile);
  }
}
