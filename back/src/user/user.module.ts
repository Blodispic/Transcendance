import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User])]
})
export class UserModule { }
=======

@Module({})
export class UserModule {}
>>>>>>> 90bad53df266c7fc5d1bec75c40b7e3b820448b4
