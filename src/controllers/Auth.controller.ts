import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Авторизация')
@Controller()
export class AuthController {}
