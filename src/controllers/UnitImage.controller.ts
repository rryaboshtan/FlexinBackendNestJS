import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { UnitImageService } from '../services/UnitImage.service';
import { UnitImageDto } from 'src/dto/UnitImage.dto';
import uploadFilesToBucket from 'src/helpers/uploadFilesToBucket';
import { UnitImage } from 'src/models/UnitImage.model';

@Controller('unit-images')
export class UnitImageController {
  constructor(private unitImageService: UnitImageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('image'))
  uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any,
    @Res() res: Response,
  ): Response {
    console.log(files);
    console.log(body.unit);

    const bucketName: string = process.env.BUCKET_NAME;

    uploadFilesToBucket(files, bucketName, body, this.unitImageService, false);
    return res.json({
      message: 'images were successfully uploaded and saved to db',
    });
  }

  @Put(':ID')
  update(
    @Body() dto: UnitImageDto,
    @Param('ID') unitId: number,
  ): Promise<[number, UnitImage[]]> {
    try {
      return this.unitImageService.update(dto, unitId);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Delete(':ID')
  delete(@Param('ID') unitId: number, @Res() res: Response): Promise<number> {
    try {
      return this.unitImageService.delete(unitId, res);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get()
  getAll(): Promise<UnitImage[]> {
    return this.unitImageService.getAll();
  }

  @Get(':ID')
  getById(@Param('ID') profileId: number): Promise<UnitImage> {
    return this.unitImageService.getById(profileId);
  }
}
