import { IsAlphanumeric, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';


export class CreateChannelDto {
    @IsString()
	@IsNotEmpty()
	// @IsAlphanumeric()
	chanName: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	password?: string;

	@IsNumber()
	chanType: number;

	@IsOptional()
	@IsArray()
	usersId?: number[];
}
