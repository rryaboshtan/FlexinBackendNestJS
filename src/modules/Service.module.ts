import { Module } from '@nestjs/common';
import { Service } from '../services/Service.service';
import { ServiceController } from '../controllers/Service.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServiceModel } from '../models/Service.model';

@Module({
  controllers: [ServiceController],
  providers: [Service],
  imports: [SequelizeModule.forFeature([ServiceModel])],
  exports: [Service],
})
export class ServiceModule {}
