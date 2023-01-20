import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

}