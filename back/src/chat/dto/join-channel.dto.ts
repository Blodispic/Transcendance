import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
	
	@IsNumber()
	chanid: number;

	@IsString()
	@IsNotEmpty()
    channame: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	password?: string;
}
