import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

import { UnitCategoryDto } from 'src/dto/UnitCategory.dto';
import { UnitCategoryModel } from 'src/models/UnitCategory.model';
import { UnitCategoryService } from 'src/services/UnitCategory.service';

@Controller('category')
export class UnitCategoryController {
  constructor(private unitCategoryService: UnitCategoryService) {}

  @Post()
  create(@Body() unitCategoryDto: UnitCategoryDto): Promise<UnitCategoryModel> {
    try {
      return this.unitCategoryService.create(unitCategoryDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Put(':UNIT_ID')
  update(
    @Body() dto: UnitCategoryDto,
    @Param('UNIT_ID') unitId: number,
  ): Promise<[number, UnitCategoryModel[]]> {
    try {
      return this.unitCategoryService.update(dto, unitId);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Delete(':UNIT_ID')
  delete(@Param('UNIT_ID') unitId: number): Promise<number> {
    try {
      return this.unitCategoryService.delete(unitId);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @Get('units-catalog')
  // getAllFromCatalog() {
  //   return this.unitService.getAllFromCatalog();
  // }

  @Get()
  getAll(): Promise<UnitCategoryModel[]> {
    return this.unitCategoryService.getAll();
  }
}
