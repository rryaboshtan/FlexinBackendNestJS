import { NextFunction } from 'express';

export default function Cors(req: any, res: any, next: NextFunction) {
  let allowedOrigins = [
    'http://localhost:3000',
    'https://front-5letka-node.herokuapp.com',
  ];
  if (allowedOrigins.indexOf(req.header('Origin'))) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Accept',
    );
    res.header('Access-Control-Allow-Methods', 'GET, PUT ,PATCH, POST, DELETE');
    // res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
}

// export default cors;
