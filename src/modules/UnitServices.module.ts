import { Module } from '@nestjs/common';
import { UnitServices } from '../services/UnitServices.service';
import { ServiceController } from '../controllers/UnitServices.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UnitServicesModel } from '../models/UnitServices.model';

@Module({
   controllers: [ServiceController],
   providers: [UnitServices],
   imports: [SequelizeModule.forFeature([UnitServicesModel])],
})
export class UnitServicesModule {}
