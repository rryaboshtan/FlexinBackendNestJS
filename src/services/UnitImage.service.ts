import { HttpStatus, Injectable } from '@nestjs/common';
import { UnitImage } from '../models/UnitImage.model';
import { InjectModel } from '@nestjs/sequelize';
import { UnitImageDto } from 'src/dto/UnitImage.dto';
import deleteFileFromBucket from 'src/helpers/deleteFileFromBucket';
import { Response } from 'express';

@Injectable()
export class UnitImageService {
  constructor(
    @InjectModel(UnitImage) private unitImageRepository: typeof UnitImage,
  ) {}
  async create(dto: any) {
    const unitImage = await this.unitImageRepository.create(dto);
    return unitImage;
  }

  async update(
    dto: UnitImageDto,
    imageId: number,
  ): Promise<[number, UnitImage[]]> {
    try {
      const updatedCount = await this.unitImageRepository.update(dto, {
        where: { id: imageId },
      });
      return updatedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(imageId: number, res: Response): Promise<number> {
    try {
      const bucketName: string = process.env.BUCKET_NAME;

      const unitImage: UnitImage = await this.unitImageRepository.findOne({
        where: { id: imageId },
      });
      const imageUrlParts: string[] = unitImage.image.split('/');
      const imageName = imageUrlParts[imageUrlParts.length - 1];
      const destroyedCount = await this.unitImageRepository.destroy({
        where: { id: imageId },
      });

      deleteFileFromBucket(bucketName, imageName, res);

      return destroyedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll(): Promise<UnitImage[]> {
    try {
      const unitImages = await this.unitImageRepository.findAll();
      return unitImages;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(serviceId: number): Promise<UnitImage> {
    try {
      const unitImage = await this.unitImageRepository.findOne({
        where: { id: serviceId },
      });

      return unitImage;
    } catch (error) {
      console.log(error);
    }
  }
}
