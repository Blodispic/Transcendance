import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
	
	@IsNumber()
	chanid: number;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	password?: string;
}
