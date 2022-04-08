import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UnitDto } from '../dto/Unit.dto';
import { UnitCategoryModel } from 'src/models/UnitCategory.model';
import { UnitCategoryDto } from 'src/dto/UnitCategory.dto';

@Injectable()
export class UnitCategoryService {
  constructor(
    @InjectModel(UnitCategoryModel)
    private unitCategoryRepository: typeof UnitCategoryModel,
  ) {}

  async create(dto: UnitCategoryDto): Promise<UnitCategoryModel> {
    try {
      const unit = await this.unitCategoryRepository.create(dto);
      return unit;
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    dto: UnitCategoryDto,
    unitId: number,
  ): Promise<[number, UnitCategoryModel[]]> {
    try {
      const updatedCount = await this.unitCategoryRepository.update(dto, {
        where: { id: unitId },
      });
      return updatedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(unitId: number): Promise<number> {
    try {
      const destroyedCount = await this.unitCategoryRepository.destroy({
        where: { id: unitId },
      });
      return destroyedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll(): Promise<UnitCategoryModel[]> {
    try {
      const unitCategories = await this.unitCategoryRepository.findAll();
      // console.log(unitCategories);

      return unitCategories;
    } catch (error) {
      console.log(error);
    }
  }
}
