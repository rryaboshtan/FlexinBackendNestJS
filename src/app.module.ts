import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServiceModule } from './modules/Service.module';
import { ConfigModule } from '@nestjs/config';
import { ServiceModel } from './models/Service.model';
import { UnitImage } from './models/UnitImage.model';
import { UnitImageModule } from './modules/UnitImage.module';
import { UnitModel } from './models/Unit.model';
import { UnitModule } from './modules/Unit.module';
import { ProfileModel } from './models/Profile.model';
import { ProfileModule } from './modules/Profile.module';
import { UnitServicesModule } from './modules/UnitServices.module';
import { UnitServicesModel } from './models/UnitServices.model';
import { UnitCategoryModule } from './modules/UnitCategory.module';
import { UnitCategoryModel } from './models/UnitCategory.model';
// import { NestModule } from '@nestjs/common';
// import { CorsMiddleware } from './middleware/cors.middleware';
import { JwtModule } from '@nestjs/jwt';
// import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        ServiceModel,
        UnitImage,
        UnitModel,
        ProfileModel,
        UnitServicesModel,
        UnitCategoryModel,
      ],
      autoLoadModels: true,
      synchronize: true,
      pool: {
        max: 3,
        min: 1,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        keepAlive: true,
      },
      ssl: true,
      define: {
        timestamps: false,
      },
    }),
    ServiceModule,
    UnitImageModule,
    UnitModule,
    ProfileModule,
    UnitServicesModule,
    UnitCategoryModule,
    // JwtModule.register({
    //   secret: process.env.CLIENT_SECRET,
    //   signOptions: {
    //     expiresIn: '24h',
    //   },
    // }),
  ],
})
export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(CorsMiddleware).forRoutes({path: '*', method: RequestMethod.ALL } );
//   }
// }
