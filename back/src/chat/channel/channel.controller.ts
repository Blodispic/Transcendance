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
	
	@Get('public')
	async getPublic() {		
		return await this.channelService.getPublic();
	}

	@Get(':id')
	async get(@Param('id', ParseIntPipe) id: number): Promise<Channel | null> {
		return await this.channelService.getById(id);
	}
	
	
	@Get()
	async getAll() {
		return await this.channelService.getAll();
	}

	@Get('user/:id')
    async getUserChannel(@Param('id') id: number) {
        return await this.channelService.getUserChannel(id);
    }

	@Post()
	async create(@Body() createChannelDto: CreateChannelDto, user: User): Promise<Channel> {
		try {
			return await this.channelService.create(createChannelDto, user);
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
