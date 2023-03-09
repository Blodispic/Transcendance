import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class SendDmDto {
	@IsNotEmpty()
	IdReceiver: number;

	@IsString()
	@IsNotEmpty()
	message: string; 
}