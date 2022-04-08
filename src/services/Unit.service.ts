import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UnitModel } from '../models/Unit.model';
import { UnitDto } from '../dto/Unit.dto';
import getResultUnit from 'src/helpers/getResultUnit';
import { UnitImage } from 'src/models/UnitImage.model';
import { ServiceModel } from 'src/models/Service.model';
import { UnitServicesModel } from 'src/models/UnitServices.model';
import { ServiceDto } from 'src/dto/Service.dto';
import { ProfileUnits } from '../types/UnitTypes';
import { CatalogUnits } from '../types/UnitTypes';
import { ResultUnit } from '../types/UnitTypes';
import { Response } from 'express';
import deleteFileFromBucket from 'src/helpers/deleteFileFromBucket';
import { ApiOperation } from '@nestjs/swagger';
import { LATITUDE_IN_KM } from 'src/helpers/constants';
import { QueryTypes } from 'sequelize';
import { UnitCategoryModel } from 'src/models/UnitCategory.model';
import uploadUnitWithServices from 'src/helpers/uploadUnitWithServices';
import { Service } from './Service.service';
import changeUnitWithServices from 'src/helpers/changeUnitWithServices';
import getFullUnitWithFilters from 'src/helpers/getFullUnitWithFilters';

@Injectable()
export class UnitService {
  private joinedModels = [
    {
      model: UnitImage,
      as: 'images',
    },
    {
      model: UnitServicesModel,
    },
    { model: ServiceModel },
    {
      model: UnitCategoryModel,
      // as: 'category',
    },
  ];

  private putModels = [
    {
      model: UnitImage,
      as: 'images',
    },
    {
      model: UnitServicesModel,
    },
    { model: ServiceModel },
  ];

  constructor(
    @InjectModel(UnitModel) private unitRepository: typeof UnitModel,
    @InjectModel(ServiceModel) private serviceRepository: typeof ServiceModel,
    @InjectModel(UnitServicesModel)
    private unitServicesRepository: typeof UnitServicesModel,
    @InjectModel(UnitImage) private unitImageRepository: typeof UnitImage,
    private servicesService: Service,
  ) {}

  async create(dto: any): Promise<UnitModel> {
    try {
      const { services, owner, ...rest } = dto;

      const unitInfo = { owner_id: owner, ...rest };
      console.log(
        'unitInfoFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF = ',
        unitInfo,
      );
      const unit = await this.unitRepository.create(unitInfo);

      if (services && services.length > 0) {
        services.forEach(async (service: ServiceDto) => {
          const newService = await this.serviceRepository.create(service);
          console.log('Новый сервис', newService);

          const unitService = {
            unit_id: unit.id,
            service_id: newService.id,
          };
          const newUnitService = await this.unitServicesRepository.create(
            unitService,
          );
          // console.log(newUnitService);
        });
      }

      return unit;
    } catch (error) {
      console.log(error);
    }
  }

  async update(dto: any, unitId: number): Promise<UnitModel> {
    try {
      const [updatedCount, [unit]] = await this.unitRepository.update(dto, {
        where: { id: unitId },
        returning: true,
      });
      console.log('unit inside = ', unit);
      return unit;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUnitWithServices(
    unitDto: UnitDto,
    unitId: number,
  ): Promise<UnitModel> {
    try {
      const newUnitDto = await changeUnitWithServices(unitDto);

      // const unit = await this.unitService.update(newUnitDto, unitId);
      // console.log('unit = ', unit);
      const fullUnit = await this.unitRepository.findOne({
        include: this.putModels,
        where: { id: unitId },
      });
      console.log('fullUnit = ', fullUnit);

      const unitObj = JSON.parse(JSON.stringify(fullUnit));

      const servicesIds = unitObj?.ServiceModel?.map(
        (service: ServiceModel) => service.id,
      );
      const unitServicesIds = unitObj?.unitServicesModel?.map(
        (unitService: UnitServicesModel) => unitService.id,
      );
      console.log('servicesIds = ', servicesIds);

      unitServicesIds?.forEach(async (unitServicesId: number) => {
        await this.unitServicesRepository.destroy({
          where: { id: unitServicesId },
        });
      });

      servicesIds?.forEach(async (serviceId: number) => {
        await this.serviceRepository.destroy({
          where: { id: serviceId },
        });
      });

      const unit = await this.update(newUnitDto, unitId);

      newUnitDto.services.forEach(async (service: any) => {
        const newService = await this.servicesService.create(service);
        //  unit.$remove('ServiceModel', newService);
        console.log('service.name = ', service);
        unit.$set('ServiceModel', newService.id);
      });

      return unit;
    } catch (error) {
      console.log(error.message);
    }
  }

  async delete(unitId: number, res: any): Promise<Response> {
    try {
      const unit = await this.unitRepository.findOne({
        include: this.joinedModels,
        where: { id: unitId },
      });

      // console.log('stringify = ', JSON.parse(JSON.stringify(unit)));
      const unitObj = JSON.parse(JSON.stringify(unit));
      // console.log('unitObj = ', unitObj?.unitServicesModel);
      const imagesIds = unitObj?.images?.map((image: UnitImage) => image.id);
      const unitServicesIds = unitObj?.unitServicesModel?.map(
        (unitService: UnitServicesModel) => unitService.id,
      );
      const servicesIds = unitObj?.ServiceModel?.map(
        (service: ServiceModel) => service.id,
      );
      console.log('servicesIds = ', servicesIds);
      console.log('unitServicesIds = ', unitServicesIds);
      console.log('imagesIds = ', imagesIds);

      servicesIds?.forEach(async (serviceId: number) => {
        await this.serviceRepository.destroy({ where: { id: serviceId } });
      });
      console.log('services deleted Success ');
      unitServicesIds?.forEach(async (unitServicesId: number) => {
        await this.unitServicesRepository.destroy({
          where: { id: unitServicesId },
        });
      });
      console.log('unitServicesIds deleted Success ');

      unitObj?.images?.forEach((image: UnitImage) => {
        const imagePath = image.image.split('/');
        const imageName = imagePath[imagePath.length - 1];
        const bucketName = process.env.BUCKET_NAME;
        deleteFileFromBucket(bucketName, imageName, res);
      });

      imagesIds?.forEach(async (imagesId: number) => {
        await this.unitImageRepository.destroy({
          where: { id: imagesId },
        });
      });
      console.log('imagesIds deleted Success ');

      await this.unitRepository.destroy({
        where: { id: unitId },
      });
      console.log(
        `Unit with id ${unitId} deleted successfully with services and images `,
      );

      return res.json({
        message: `Unit with id ${unitId} deleted successfully with services and images `,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        message: `Unit with id ${unitId} NOT DELETED with services and images `,
      });
    }
  }

  async getAllBySearch(query: any) {
    try {
      const { search } = query;
      console.log('search = ', search);

      let units = await this.unitRepository.findAll();
      let services = await this.serviceRepository.findAll();
      units = JSON.parse(JSON.stringify(units));
      services = JSON.parse(JSON.stringify(services));

      const regExp = new RegExp(`${search}`);
      const resultRegExp = new RegExp(
        regExp.toString().substring(2, regExp.toString().length - 2),
      );

      units = Array.from(units).filter((unit) => {
        return resultRegExp.test(unit.name);
      });

      services = Array.from(services).filter((service) => {
        return resultRegExp.test(service.name);
      });

      return { units, services };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllInRectangle(query: any): Promise<any> {
    try {
      const { lat1, lat2, lng1, lng2, category } = query;
      console.log('Query Parameters = ', lat1, lat2, lng1, lng2, category);

      const units = await this.unitRepository.sequelize.query(
        'SELECT * FROM main_app_unit WHERE lng >= :lng2 AND lng <= :lng1 AND lat >= :lat2 AND lat <= :lat1' +
          (category ? 'AND category=:category' : ''),
        {
          replacements: {
            lat1: Number(lat1),
            lat2: Number(lat2),
            lng1: Number(lng1),
            lng2: Number(lng2),
            category: Number(category),
          },
          type: QueryTypes.SELECT,
        },
      );
      const pagesCount = Math.ceil(units.length / 6);
      const unitsCount = units.length;

      // console.log(units);
      return { results: units, pagesCount, count: unitsCount };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllInCircle(query: any, res: Response): Promise<any> {
    try {
      const {
        user_lat,
        user_lng,
        radius,
        category,
        services,
        firstPrice,
        secondPrice,
        page,
      } = query;

      let temp = radius / LATITUDE_IN_KM;
      // console.log('RADIUS = ', radius / LATITUDE_IN_KM);
      // console.log('RADIUS = ', temp * LATITUDE_IN_KM);
      // console.log('category = ', category);
      // console.log('page = ', page);
      let units = null;

      units = await this.unitRepository.findAll({ include: this.joinedModels });
      units = JSON.parse(JSON.stringify(units));
      units = units?.map((unit: any) => {
        const { ServiceModel } = unit;
        return getFullUnitWithFilters(ServiceModel, unit);
      });

      console.log('Units category.id =============== ', units[0].category);
      if (radius) {
        if (!category) {
          units = units.filter((unit: any) => {
            return (
              Math.pow(unit.lng - Number(user_lng), 2) +
                Math.pow(unit.lat - Number(user_lat), 2) <=
              Math.pow(temp, 2)
            );
          });
        } else {
          units = units?.filter((unit: any) => {
            return (
              Math.pow(unit.lng - Number(user_lng), 2) +
                Math.pow(unit.lat - Number(user_lat), 2) <=
                Math.pow(Number(temp), 2) &&
              Number(unit?.category?.id) === Number(category)
            );
          });
        }
      }

      console.log('services = ', services);
      if (services) {
        units = units?.filter((unit: any) => {
          return unit?.services?.some(
            (service: ServiceModel) => Number(service.id) === Number(services),
          );
        });
      }

      if (firstPrice && secondPrice) {
        units = units?.filter((unit: any) => {
          return (
            unit?.price >= Number(firstPrice) &&
            unit?.price <= Number(secondPrice)
          );
        });
      }
      const pagesCount = Math.ceil(units.length / 6);

      const unitsCount = units.length;
      if (page) {
        units = units.slice((page - 1) * 6, page * 6);
      }

      return res.json({ results: units, pagesCount, count: unitsCount });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllFromCatalog(): Promise<CatalogUnits | any> {
    try {
      const units = await this.unitRepository.findAll({
        include: this.joinedModels,
        where: { owner_id: null },
        //  attributes: [['owner_id', 'owner']]
      });
      const resultUnits = units.map((unit) => {
        const { ServiceModel } = unit;

        return getResultUnit(ServiceModel, unit);
      });

      // return { catalog: resultUnits };
      return resultUnits;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll(): Promise<ResultUnit[]> {
    try {
      const units = await this.unitRepository.findAll({
        include: this.joinedModels,
        // where: { owner_id: !null },
      });
      // console.log(units);
      const resultUnits = units.map((unit) => {
        const { ServiceModel } = unit;
        return getResultUnit(ServiceModel, unit);
      });

      return resultUnits;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(unitId: number): Promise<ResultUnit> {
    try {
      let unit = await this.unitRepository.findOne({
        include: this.joinedModels,
        where: {
          id: unitId,
        },
      });
      const { ServiceModel } = unit;

      return getResultUnit(ServiceModel, unit);
    } catch (error) {
      console.log(error);
    }
  }
}
