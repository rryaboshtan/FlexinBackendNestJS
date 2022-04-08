import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(): any {
    return (req: any, res: any, next: NextFunction) => {
    //   let allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];
    //   if (allowedOrigins.indexOf(req.header('Origin'))) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
          'Access-Control-Allow-Headers',
          'content-type, Authorization',
        );
        res.header(
          'Access-Control-Allow-Methods',
          'GET, PUT ,PATCH, POST, DELETE',
        );
    //   }

      next();
    };
  }
}
