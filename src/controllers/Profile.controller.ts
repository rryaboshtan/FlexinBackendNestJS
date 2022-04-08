import {
  Controller,
  Get,
  Delete,
  Put,
  Param,
  Body,
  Post,
  Res,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

import { ProfileService } from '../services/Profile.service';
import { ProfileDto } from '../dto/Profile.dto';
import { UnitDto } from 'src/dto/Unit.dto';
import { RegistrationDto } from 'src/dto/Registration.dto';
import { UnitModel } from 'src/models/Unit.model';
import { ProfileModel } from 'src/models/Profile.model';
import { ProfileUnits } from 'src/types/UnitTypes';

@Controller('auth')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private jwtService: JwtService,
  ) {}

  @Post('users/:ID/units')
  createProfileUnit(@Body() unitDto: UnitDto): Promise<UnitModel> {
    try {
      return this.profileService.createUnit(unitDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('users')
  registration(
    @Body() registrationDto: RegistrationDto,
    @Res() res: Response,
  ): void {
    try {
      this.profileService.registration(registrationDto, res);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('jwt/create')
  login(@Body() registrationDto: RegistrationDto, @Res() res: Response) {
    try {
      this.profileService.login(registrationDto, res);
    } catch (error) {
      console.log(error);
    }
  }

  // @Post('users/activation/:TOKEN')
  // activation(
  //   @Param('TOKEN') token: string,
  //   @Body('token') uid: any,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const payload = this.jwtService.verify(token);
  //     this.profileService.activateUser(payload.profileId, res, token);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  @Get('users/activation/:TOKEN')
  activation(
    @Param('TOKEN') token: string,
    // @Body('token') uid: any,
    @Res() res: Response,
  ) {
    try {
      const payload = this.jwtService.verify(token);
      this.profileService.activateUser(payload.profileId, res, token);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('users/me')
  create(@Body() profileDto: ProfileDto): Promise<ProfileModel> {
    try {
      return this.profileService.create(profileDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Put('users/:ID/units/:UNIT_ID')
  updateUnit(
    @Body() UnitDto: UnitDto,
    @Param('UNIT_ID') unitId: number,
  ): Promise<[number, UnitModel[]]> {
    try {
      return this.profileService.updateUnit(UnitDto, unitId);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Put('users/:ID')
  update(
    @Body() profileDto: ProfileDto,
    @Param('ID') profileId: number,
  ): Promise<[number, ProfileModel[]]> {
    try {
      return this.profileService.update(profileDto, profileId);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Delete('users/:ID/units/:UNIT_ID')
  deleteUnit(@Param('UNIT_ID') unitId: number): Promise<number> {
    try {
      return this.profileService.deleteUnit(unitId);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Delete('users/:ID')
  delete(@Param('ID') profileId: number): Promise<number> {
    try {
      return this.profileService.delete(profileId);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get('/users/me')
  getLoginedUser(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ProfileModel | object> {
    // console.log(req.header('authorization'));
    const authHeader = req.header('authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;

    return this.profileService.getLoginedProfile(token, res);
  }

  @Get('users')
  getAll(): Promise<ProfileModel[]> {
    return this.profileService.getAll();
  }

  @Get('users/:ID/units')
  getUnitsById(@Param('ID') profileId: number): Promise<ProfileUnits> {
    return this.profileService.getUnitsById(profileId);
  }

  @Get('users/:ID')
  getById(@Param('ID') profileId: number): Promise<ProfileModel> {
    return this.profileService.getById(profileId);
  }
}
