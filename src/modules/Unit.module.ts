import { Module } from '@nestjs/common';
import { UnitService } from '../services/Unit.service';
import { UnitController } from '../controllers/Unit.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UnitModel } from '../models/Unit.model';
import { ProfileModel } from 'src/models/Profile.model';
import { ServiceModel } from 'src/models/Service.model';
import { UnitServicesModel } from 'src/models/UnitServices.model';
import { UnitImageModule } from './UnitImage.module';
import { UnitImage } from 'src/models/UnitImage.model';
import { UnitCategoryModel } from 'src/models/UnitCategory.model';
import { ServiceModule } from './Service.module';

@Module({
  controllers: [UnitController],
  providers: [UnitService],
  imports: [
    UnitImageModule,
    ServiceModule,
    SequelizeModule.forFeature([
      UnitModel,
      ProfileModel,
      ServiceModel,
      UnitServicesModel,
      UnitImage,
      UnitCategoryModel,
    ]),
  ],
})
export class UnitModule {}