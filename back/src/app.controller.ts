import { Controller, Get, Post, UseInterceptors, UploadedFile, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService, editFileName, imageFileFilter } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image: any, @Res() res: any) {
  return res.sendFile(image, { root: './files' });
}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file: any) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }
}
