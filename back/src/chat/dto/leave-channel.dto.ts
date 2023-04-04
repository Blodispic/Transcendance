import { IsNumber } from 'class-validator';

export class LeaveChannelDto {
	@IsNumber()
	chanid: number;
}
