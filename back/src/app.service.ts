import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class AppService {
}

export const imageFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new UnprocessableEntityException('Only image files are allowed!'), false);
  }
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    return callback(new UnprocessableEntityException('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

