import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateUserDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(16)
	@Matches(/^(?!\s+$).+$/s,{ message: 'Username start or end with a space' })
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
