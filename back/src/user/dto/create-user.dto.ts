import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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
