import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class SendMessageChannelDto {
	@IsNumber()
	chanid: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(1000)
	message: string; 
}
