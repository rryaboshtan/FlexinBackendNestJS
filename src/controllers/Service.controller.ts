import { Controller, Get,Put, Delete, Post, Body, Param } from '@nestjs/common';

import { Service } from '../services/Service.service';
import { ServiceDto } from '../dto/Service.dto';
import { ServiceModel } from 'src/models/Service.model';

@Controller('services')
export class ServiceController {
  constructor(private service: Service) {}

  @Post()
  create(@Body() serviceDto: ServiceDto): Promise<ServiceModel> {
    return this.service.create(serviceDto);
  }

  @Put(':ID')
  update(
    @Body() serviceDto: ServiceDto,
    @Param('ID') unitId: string,
  ): Promise<[number, ServiceModel[]]> {
    try {
      return this.service.update(serviceDto, unitId);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Delete(':ID')
  delete(@Param('ID') unitId: string): Promise<number> {
    try {
      return this.service.delete(unitId);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get()
  getAll(): Promise<ServiceModel[]> {
    return this.service.getAll();
  }
  @Get(':ID')
  getById(@Param('ID') profileId: string): Promise<ServiceModel> {
    return this.service.getById(profileId);
  }
}
