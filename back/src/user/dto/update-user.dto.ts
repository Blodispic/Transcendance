import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsIn, IsNumber } from 'class-validator';
import { Status } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { 

    // @IsOptional()
	// @IsEnum(Status)
    // status?: Status;
}
