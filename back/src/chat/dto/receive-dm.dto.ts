import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class ReceiveDmDto {
	@IsNotEmpty()
	sender: User;

	@IsString()
	@IsNotEmpty()
	message: string;
}