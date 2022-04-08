import { Module } from '@nestjs/common';
import { UnitImageService } from '../services/UnitImage.service';
import { UnitImageController } from '../controllers/UnitImage.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UnitImage } from '../models/UnitImage.model';

@Module({
   exports: [UnitImageService],
   controllers: [UnitImageController],
   providers: [UnitImageService],
   imports: [SequelizeModule.forFeature([UnitImage])],
})
export class UnitImageModule {}
