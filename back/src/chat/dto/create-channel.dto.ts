import { IsNotEmpty, IsNumber, IsOptional, isString, IsString } from "class-validator";


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
}