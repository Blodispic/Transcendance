import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

	  @IsOptional()
	  @IsString()
	  @IsNotEmpty()
	  @MaxLength(16)
	  @Matches(/^\S.*\S$/,{ message: 'Username start or end with a space' })
    username?: string;
  
    @IsOptional()
    @IsBoolean()
    twoFaEnable?: boolean;
  }
