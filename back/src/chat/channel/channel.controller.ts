import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './entities/channel.entity';
import { AddUserDto } from './dto/add-user.dto';
import { RmUserDto } from './dto/rm-user.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateChannelDto } from '../dto/create-channel.dto';

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
