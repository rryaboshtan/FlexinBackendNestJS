import { Injectable } from '@nestjs/common';
import { UnitServicesModel } from '../models/UnitServices.model';
import { InjectModel } from '@nestjs/sequelize';
import { UnitServicesDto } from '../dto/UnitServices.dto';

@Injectable()
export class UnitServices {
  constructor(
    @InjectModel(UnitServicesModel)
    private ServicesRepository: typeof UnitServicesModel,
  ) {}
  async create(dto: UnitServicesDto): Promise<UnitServicesModel> {
    try {
      const unitService = await this.ServicesRepository.create(dto);
      return unitService;
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    dto: UnitServicesDto,
    serviceId: string,
  ): Promise<[number, UnitServicesModel[]]> {
    try {
      const updatedCount = await this.ServicesRepository.update(dto, {
        where: { id: serviceId },
      });
      return updatedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(serviceId: string): Promise<number> {
    try {
      const destroyedCount = await this.ServicesRepository.destroy({
        where: { id: serviceId },
      });
      return destroyedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll(): Promise<UnitServicesModel[]> {
    try {
      const unitServices = await this.ServicesRepository.findAll();
      return unitServices;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getById(serviceId: string): Promise<UnitServicesModel> {
    try {
      const unitService = await this.ServicesRepository.findOne({
        where: { id: serviceId },
      });

      return unitService;
    } catch (error) {
      console.log(error);
    }
  }
}
