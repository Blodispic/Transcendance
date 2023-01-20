import { Controller, Get, Post, UseInterceptors, UploadedFile, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService, editFileName, imageFileFilter } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':imgpath')
  seeAvatar(@Param('imgpath') image: any, @Res() res: any) {
    return res.sendFile(image, { root: './files' });
  }

}
