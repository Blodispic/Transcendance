import { IsNotEmpty, IsNumber } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class AddUserDto {
	@IsNotEmpty()
	user: User;
	
	@IsNumber()
	chanId: number;
}