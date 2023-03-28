import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendMessageChannelDto {
	@IsNumber()
	chanid: number;

	@IsString()
	@IsNotEmpty()
	message: string; 
}
