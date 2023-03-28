import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Status } from '../entities/user.entity';

export class CreateUserDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(16)
	username?: string;

	@IsString()
	@IsNotEmpty()
	login: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsEmail()
	@IsNotEmpty()
	intra_avatar: string;
}
