import { IsAlphanumeric, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


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
