import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ChannelService } from './channel.service';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { AddUserDto } from './dto/add-user.dto';
import { RmUserDto } from './dto/rm-user.dto';

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@Get(':id')
	async get(@Param('id') id: number): Promise<Channel | null> {
		return await this.channelService.getById(id);
	}
	
	@Post()
	async create(@Body() createChannelDto: CreateChannelDto): Promise<Channel> {
		try {
			return await this.channelService.create(createChannelDto);
		} catch (error) {
			throw new BadRequestException(error.detail);
		}
	}

	@Post('addUser')
	async add(@Body() addUserDto: AddUserDto) {
		return await this.channelService.add(addUserDto);
	}

	@Post('rmUser')
	async rm(@Body() rmUserDto: RmUserDto) {
		return await this.channelService.rm(rmUserDto);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() channel: any) {
	  return this.channelService.update(+id, channel);
	}


}
