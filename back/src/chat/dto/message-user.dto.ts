import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class MessageUserDto {
	@IsNotEmpty()
	usertowho: User;

	@IsString()
	@IsNotEmpty()
	message: string; 
	// à améliorer
}