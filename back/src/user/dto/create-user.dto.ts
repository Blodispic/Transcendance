import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	readonly username: string;
	
	@IsEmail()
	@IsNotEmpty()
	readonly email: string;
	
}
