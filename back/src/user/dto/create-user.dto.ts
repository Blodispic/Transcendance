import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
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
