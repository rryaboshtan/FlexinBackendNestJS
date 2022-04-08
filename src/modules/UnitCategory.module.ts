import { Module } from '@nestjs/common';

import { UnitCategoryService } from 'src/services/UnitCategory.service';
import { UnitCategoryController } from 'src/controllers/UnitCategory.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UnitCategoryModel } from 'src/models/UnitCategory.model';
import { UnitModel } from 'src/models/Unit.model';

@Module({
  controllers: [UnitCategoryController],
  providers: [UnitCategoryService],
  imports: [SequelizeModule.forFeature([UnitCategoryModel, UnitModel])],
})
export class UnitCategoryModule {}
