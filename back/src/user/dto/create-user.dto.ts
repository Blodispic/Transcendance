import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	readonly username: string;
	
	@IsEmail()
	@IsNotEmpty()
	readonly password: string;
	
	@IsString()
	@IsNotEmpty()
	readonly email: string;
}
