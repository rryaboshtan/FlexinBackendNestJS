import { HttpStatus, Injectable } from '@nestjs/common';
import { ProfileModel } from '../models/Profile.model';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileDto } from '../dto/Profile.dto';
import { UnitModel } from 'src/models/Unit.model';
import { UnitDto } from 'src/dto/Unit.dto';
import { UnitImage } from 'src/models/UnitImage.model';
import { UnitServicesModel } from 'src/models/UnitServices.model';
import { ServiceModel } from 'src/models/Service.model';
import getResultUnit from 'src/helpers/getResultUnit';
import { ProfileUnits } from '../types/UnitTypes';
import { RegistrationDto } from 'src/dto/Registration.dto';
import { Response } from 'express';
// import bcrypt from 'bcryptjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
const nodemailer = require('nodemailer');
// import nodemailer = require('nodemailer');
import { google } from 'googleapis';
import * as uuid from 'uuid';
import { UnitCategoryModel } from 'src/models/UnitCategory.model';

@Injectable()
export class ProfileService {
  #loginedUserId = null;

  #joinedModels = [
    {
      model: UnitImage,
      as: 'images',
    },
    {
      model: UnitServicesModel,
    },
    {
      model: ServiceModel,
      // as: 'services',
    },
    {
      model: UnitCategoryModel,
    },
  ];
  constructor(
    @InjectModel(ProfileModel)
    private profileRepository: typeof ProfileModel,
    @InjectModel(UnitModel)
    private unitRepository: typeof UnitModel,
    private jwtService: JwtService,
  ) {}
  async create(dto: ProfileDto): Promise<ProfileModel> {
    try {
      const profile = await this.profileRepository.create(dto);
      return profile;
    } catch (error) {
      console.log(error);
    }
  }

  async activateUser(id: any, res: Response, token: string) {
    try {
      const updated = await this.profileRepository.update(
        { is_active: true },
        {
          where: { id },
        },
      );
      console.log('profile updated', updated);
      return res.redirect(
        `${process.env.CLIENT_URL}/#/activate/${uuid.v4()}/${token}`,
      );

      return updated;
    } catch (error) {
      console.log(error);
    }
  }

  async login(dto: RegistrationDto, res: Response): Promise<object> {
    try {
      const { email, password } = dto;
      const user = await this.profileRepository.findOne({ where: { email } });
      if (!user) {
        console.log(`User with email ${email} not found`);
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `User with email ${email} not found`,
        });
      }
      // const isPasswordEquals = password === user.password;
      const isPasswordEquals = await bcrypt.compare(password, user.password);
      if (!isPasswordEquals) {
        console.log(`Incorrect password`);
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `Incorrect password`,
        });
      }

      const accessToken = this.jwtService.sign({ id: user.id });
      const refreshToken = this.jwtService.sign(
        { id: user.id },
        // { expiresIn: '30s' },
      );
      console.log('accessToken', accessToken);
      console.log('user.id = ', user.id);
      this.#loginedUserId = user.id;

      // await tokenService.saveToken(userDto.id, tokens.refreshToken);

      return res.json({
        access: accessToken,
        refresh: refreshToken,
        user_id: user.id,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async registration(dto: RegistrationDto, res: Response): Promise<object> {
    try {
      const { email, password } = dto;
      const candidate = await this.profileRepository.findOne({
        where: { email },
      });

      if (candidate) {
        console.log(`User with email ${email} already exist`);

        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `User with email ${email} already exist`,
        });
      }

      const hashPassword = await bcrypt.hash(password, 8);

      const profile = await this.profileRepository.create({
        email: dto.email,
        password: hashPassword,
        is_active: false,
      });

      const token = await this.#generateToken(profile.id.toString());

      this.#sendActivationMail(
        `${process.env.SERVER_NAME}/auth/users/activation/${token}`,
        // `${process.env.CLIENT_URL}/#/activate/${uuid.v4()}/${token}`,
        email,
        // `${process.env.API_URL}/api/activate/${activationLink}`,
      );
      return res.status(HttpStatus.OK).json({
        message: `Activation link send to email`,
      });

      // return {
      //   // ...tokens,
      //   // user: userDto,
      // };
    } catch (error) {
      console.log(error);
    }
  }
  async #generateToken(profileId: string) {
    return this.jwtService.sign({ profileId }, {});
  }

  #sendActivationMail(link: string, recipient: string): void {
    const OAuth2 = google.auth.OAuth2;

    const OAuth2_client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
    );
    OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    function sendMail() {
      const accessToken = OAuth2_client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: 'gmail',
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        // secure: false,

        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken,
        },
      });

      const mailOptions = {
        from: `<${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: 'A Message From the',
        html: getHtmlMessage(link),
      };

      transport.sendMail(mailOptions, (error, result) => {
        if (error) {
          console.log('Error: ', error);
        } else {
          console.log('Success: ', result);
        }
        transport.close();
      });
    }

    function getHtmlMessage(link) {
      return `
    <h3>${link}</h3>
    `;
    }

    sendMail();
  }

  async createUnit(dto: UnitDto): Promise<UnitModel> {
    try {
      const profile = await this.unitRepository.create(dto);
      return profile;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUnit(
    dto: UnitDto,
    unitId: number,
  ): Promise<[number, UnitModel[]]> {
    try {
      const updatedCount = await this.unitRepository.update(dto, {
        where: { id: unitId },
      });
      return updatedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    dto: ProfileDto,
    profileId: number,
  ): Promise<[number, ProfileModel[]]> {
    try {
      const updatedCount = await this.profileRepository.update(dto, {
        where: { id: profileId },
      });
      return updatedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUnit(unitId: number): Promise<number> {
    try {
      const destroyedCount = await this.unitRepository.destroy({
        where: { id: unitId },
      });
      return destroyedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(profileId: number): Promise<number> {
    try {
      const destroyedCount = await this.profileRepository.destroy({
        where: { id: profileId },
      });
      return destroyedCount;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll(): Promise<ProfileModel[]> {
    try {
      const profiles = await this.profileRepository.findAll();
      return profiles;
    } catch (error) {
      console.log(error);
    }
  }

  async getUnitsById(id: number): Promise<ProfileUnits> {
    try {
      const unitsById = await this.unitRepository.findAll({
        where: { owner_id: id },
        include: this.#joinedModels,
      });

      const resultUnits = unitsById.map((unit) => {
        const { ServiceModel } = unit;

        return getResultUnit(ServiceModel, unit);
      });

      return { units: resultUnits };
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id: number): Promise<ProfileModel> {
    return this.#getProfileById(id);
    // try {
    //   const profile = await this.profileRepository.findOne({
    //     where: { id },
    //   });
    //   return profile;
    // } catch (error) {
    //   console.log(error);
    // }
  }

  async getLoginedProfile(
    token: string,
    res: Response,
  ): Promise<ProfileModel | object> {
    if (token) {
      let payload: any;
      try {
        payload = this.jwtService.verify(token);
      } catch (error) {
        console.log('Token is not verified');
        return res.json({ message: 'Token is not verified' });
      }
      console.log(payload);
      const profile = await this.#getProfileById(payload.id);
      console.log(profile);
      const profileObj = Object.create(profile);
      // console.log({ auth: true, authUser: { ...profileObj.dataValues } });
      console.log({ auth: true, ...profileObj.dataValues });
      return res.json({ auth: true, ...profileObj.dataValues });
    } else {
      return res.json({ auth: false });
    }

    // try {
    //   console.log('#loginedUser = ', this.#loginedUserId);
    //   const profile = await this.profileRepository.findOne({
    //     where: { id: this.#loginedUserId },
    //   });
    //   return profile;
    // } catch (error) {
    //   console.log(error);
    // }
  }

  async #getProfileById(id: number): Promise<ProfileModel> {
    try {
      const profile = await this.profileRepository.findOne({
        where: { id },
      });
      return profile;
    } catch (error) {
      console.log(error);
    }
  }
}
