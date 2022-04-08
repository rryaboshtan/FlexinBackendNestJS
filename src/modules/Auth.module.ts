import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/Auth.controller';
import { AuthService } from '../services/Auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './Profile.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    // JwtModule.registerAsync({

    // })
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('CLIENT_SECRET'),
          signOptions: {
            expiresIn: '30d',
          },
        };
      },
      inject: [ConfigService],
    }),
    // JwtModule.register({
    //   // secret: process.env.CLIENT_SECRET,
    //   secret: 'secret',
    //   signOptions: {
    //     expiresIn: '30m',
    //   },
    // }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
