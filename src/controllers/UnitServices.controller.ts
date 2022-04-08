import { Controller, Get,Put, Delete, Post, Body, Param } from '@nestjs/common';
import { UnitServices } from '../services/UnitServices.service';
import { UnitServicesDto } from '../dto/UnitServices.dto';
import { UnitServicesModel } from 'src/models/UnitServices.model';

@Controller('unit-services')
export class ServiceController {
  constructor(private unitServices: UnitServices) {}

  @Post()
  create(@Body() unitServicesDto: UnitServicesDto): Promise<UnitServicesModel> {
    return this.unitServices.create(unitServicesDto);
  }

  @Put(':ID')
  update(
    @Body() unitServicesDto: UnitServicesDto,
    @Param('ID') unitId: string,
  ): Promise<[number, UnitServicesModel[]]> {
    try {
      return this.unitServices.update(unitServicesDto, unitId);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Delete(':ID')
  delete(@Param('ID') unitId: string): Promise<number> {
    try {
      return this.unitServices.delete(unitId);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get()
  getAll(): Promise<UnitServicesModel[]> {
    return this.unitServices.getAll();
  }
  @Get(':ID')
  getById(@Param('ID') profileId: string): Promise<UnitServicesModel> {
    return this.unitServices.getById(profileId);
  }
}
