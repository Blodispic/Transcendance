import { IsNotEmpty, IsNumber, IsOptional, isString, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";


export class CreateChannelDto {
    @IsString()
	@IsNotEmpty()
	chanName: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	password?: string;

	@IsNumber()
	chanType: number;

	@IsOptional()
	users?: User[];
}