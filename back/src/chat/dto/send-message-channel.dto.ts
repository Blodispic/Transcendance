import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class SendMessageChannelDto {
	@IsNumber()
	chanid: number;

	@IsString()
	@IsNotEmpty()
	message: string; 

	@IsNotEmpty()
	sendtime: string;
}