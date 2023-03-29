import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './entities/channel.entity';

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}
	
	@Get(':id')
	async get(@Param('id', ParseIntPipe) id: number): Promise<Channel | null> {
		return await this.channelService.getById(id);
	}
	
	@Get()
	async getAll() {
		return await this.channelService.getAll();
	}

}
