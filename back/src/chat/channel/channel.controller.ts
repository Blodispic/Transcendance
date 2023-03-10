import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ChannelService } from './channel.service';
import { Channel } from './entities/channel.entity';
// import { CreateChannelDto } from './dto/create-channel.dto';
import { AddUserDto } from './dto/add-user.dto';
import { RmUserDto } from './dto/rm-user.dto';
import { BanUserDto } from '../dto/ban-user.dto';
import { MuteUserDto } from '../dto/mute-user.dto';
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
	async get(@Param('id') id: number): Promise<Channel | null> {
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

	@Post('banUser')
	async banUser(@Body() banUserDto: BanUserDto) {
		return await this.channelService.banUser(banUserDto);
	}

	@Post('muteUser')
	async muteUser(@Body() muteUserDto: MuteUserDto) {
		return await this.channelService.muteUser(muteUserDto);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() channel: any) {
	  return this.channelService.update(+id, channel);
	}

	async unmuteUser(muteUserDto: MuteUserDto)
	{
		return await this.channelService.unmuteUser(muteUserDto);
	}

}
