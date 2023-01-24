import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	login: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsEmail()
	@IsNotEmpty()
	intra_avatar: string;

	@IsString()
	@IsNotEmpty()
	access_token: string;
  
}
