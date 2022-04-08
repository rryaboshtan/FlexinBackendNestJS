import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import uploadFilesToBucket from 'src/helpers/uploadFilesToBucket';
import { UnitService } from '../services/Unit.service';
import { UnitDto } from '../dto/Unit.dto';
import { UnitImageService } from 'src/services/UnitImage.service';
import { ResultUnit } from 'src/types/UnitTypes';
import uploadUnitWithServices from 'src/helpers/uploadUnitWithServices';
import { Response } from 'express';
import { Service } from 'src/services/Service.service';
import { UnitModel } from 'src/models/Unit.model';

@Controller()
export class UnitController {
  constructor(
    private unitService: UnitService,
    private unitImageService: UnitImageService,
  ) {}

  @Post(['units', 'units/catalog'])
  @UseInterceptors(FilesInterceptor('image'))
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() unitDto: any,
  ): Promise<UnitModel> {
    try {
      console.log('unitdto = ', unitDto);
      console.log('files = ', files);

      const newUnitDto = await uploadUnitWithServices(unitDto);

      console.log('new unit dto = ', newUnitDto);
      const unitWithServices = await this.unitService.create(newUnitDto);
      // console.log('unitWithServices = ', unitWithServices);
      // newUnitDto.services.forEach((service: any) => {
      //   unitWithServices.$set('unitServicesModel', service.name);
      // });

      const unitWithServicesObj = Object.create(unitWithServices);
      unitDto.owner = unitWithServicesObj.dataValues.id;

      const bucketName: string = process.env.BUCKET_NAME;

      uploadFilesToBucket(
        files,
        bucketName,
        unitDto,
        this.unitImageService,
        true,
      );

      return unitWithServices;
    } catch (error) {
      console.log(error);
      
    }
  }

  // @Post(['units', 'units/catalog'])
  // @UseInterceptors(FilesInterceptor('image'))
  // async create(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Body() unitDto: any,
  // );

  @Put(['units/:UNIT_ID', 'units/catalog/:UNIT_ID'])
  @UseInterceptors(FilesInterceptor('image'))
  async update(
    @Body() unitDto: UnitDto,
    // @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('UNIT_ID') unitId: number,
  ): Promise<UnitModel> {
    try {
      console.log('Updated unit = ', unitDto);

      const unit = await this.unitService.updateUnitWithServices(
        unitDto,
        unitId,
      );
      // console.log('services = ', newUnitDto.services);
      return unit;
    } catch (error) {
      console.log(error.message);
    }
  }

  @Delete(['units/:UNIT_ID', 'units/catalog/:UNIT_ID'])
  delete(
    @Param('UNIT_ID') unitId: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      return this.unitService.delete(unitId, res);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get('search')
  getAllBySearch(@Query() query: any): any {
    return this.unitService.getAllBySearch(query);
  }

  @Get('units/map/')
  getAllInRectangle(@Query() query: any): Promise<ResultUnit[]> {
    return this.unitService.getAllInRectangle(query);
  }

  @Get('units/map-user-coords/')
  getAllInCircle(@Query() query: any, @Res() res: Response): Promise<ResultUnit[]> {
    return this.unitService.getAllInCircle(query, res);
  }

  @Get('units/catalog')
  getAllFromCatalog(): Promise<ResultUnit[]> {
    return this.unitService.getAllFromCatalog();
  }

  @Get('units')
  getAll(): Promise<ResultUnit[]> {
    return this.unitService.getAll();
  }

  @Get(['units/:UNIT_ID', 'units/catalog/:UNIT_ID'])
  getById(@Param('UNIT_ID') unitId: number): Promise<ResultUnit> {
    return this.unitService.getById(unitId);
  }
}
