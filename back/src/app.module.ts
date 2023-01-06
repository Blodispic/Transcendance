import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
=======
import { User } from './user/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
>>>>>>> 90bad53df266c7fc5d1bec75c40b7e3b820448b4
import { UserModule } from './user/user.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      entities: [User],
      synchronize: true,
    }),
<<<<<<< HEAD
    UserModule,
=======
    UserModule
>>>>>>> 90bad53df266c7fc5d1bec75c40b7e3b820448b4
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
