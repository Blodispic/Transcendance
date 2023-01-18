import { Body, Controller, Post } from '@nestjs/common';
import { Channel } from 'diagnostics_channel';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@Post()
	async create(@Body() createChannelDto: CreateChannelDto): Promise<Channel> {
		return await this.channelService.create(createChannelDto);
	}



}
