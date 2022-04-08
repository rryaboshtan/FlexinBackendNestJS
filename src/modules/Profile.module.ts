import { Module } from '@nestjs/common';
import { ProfileService } from '../services/Profile.service';
import { ProfileController } from '../controllers/Profile.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from '../models/Profile.model';
import { UnitModel } from 'src/models/Unit.model';
import { AuthModule } from './Auth.module';
// import { AuthController } from 'src/controllers/Auth.controller';

@Module({
  // controllers: [ProfileController, AuthController],
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [SequelizeModule.forFeature([ProfileModel, UnitModel]), AuthModule],
  // exports: [AuthModule],
})
export class ProfileModule {}