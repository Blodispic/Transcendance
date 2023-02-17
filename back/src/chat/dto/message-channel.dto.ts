import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class MessageChannelDto {
	@IsNumber()
	chanid: number;

	@IsNotEmpty()
	sender: User;

	@IsString()
	@IsNotEmpty()
	message: string; 
	// à améliorer
}