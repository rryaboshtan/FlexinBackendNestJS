import { Injectable } from '@nestjs/common';
import { ServiceModel } from '../models/Service.model';
import { InjectModel } from '@nestjs/sequelize';
import { ServiceDto } from '../dto/Service.dto';

@Injectable()
export class Service {
  constructor(
    @InjectModel(ServiceModel)
    private servicesRepository: typeof ServiceModel,
  ) {}
  async create(dto: ServiceDto): Promise<ServiceModel> {
    try {
      const service = await this.servicesRepository.create(dto);
      return service;
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    dto: ServiceDto,
    serviceId: string,
  ): Promise<[number, ServiceModel[]]> {
    try {
      const unit = await this.servicesRepository.update(dto, {
        where: { id: serviceId },
      });
      return unit;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(serviceId: string): Promise<number> {
    try {
      const destroyedCount = await this.servicesRepository.destroy({
        where: { id: serviceId },
      });
      return destroyedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll(): Promise<ServiceModel[]> {
    try {
      const services = await this.servicesRepository.findAll();
      return services;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getById(serviceId: string): Promise<ServiceModel> {
    try {
      const service = await this.servicesRepository.findOne({
        where: { id: serviceId },
      });

      return service;
    } catch (error) {
      console.log(error);
    }
  }
}
