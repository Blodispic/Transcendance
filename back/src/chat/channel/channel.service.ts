import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AddUserDto } from './dto/add-user.dto';
import { Channel } from './entities/channel.entity';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { RmUserDto } from './dto/rm-user.dto';
import { MuteUserDto } from '../dto/mute-user.dto';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { GiveAdminDto } from '../dto/give-admin.dto';
import { BanUserDto } from '../dto/ban-user.dto';
import { RmAdminDto } from '../dto/rm-admin.dto';
import { find } from 'rxjs';
var bcrypt = require('bcryptjs');


@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
		// @InjectRepository(User)
		// private userRepository: Repository<User>,

	) {}

	async create(createChannelDto: CreateChannelDto, user: User) {		
		if (createChannelDto.password) {
			const salt = await bcrypt.genSalt();
			const hashPassword = await bcrypt.hash(createChannelDto.password, salt);
			createChannelDto.password = hashPassword;
		}
		const channel: Channel = this.channelRepository.create({
			name: createChannelDto.chanName,
			password: createChannelDto.password,
			owner: user,
			admin: [user],
			users: [user],
			chanType: createChannelDto.chanType,
		});
		return this.channelRepository.save(channel);
	}

	async add(addUserDto: AddUserDto) {
		const channel: Channel | null = await this.channelRepository.findOne({
			relations: { users: true, banned: true, muted: true },
			where: {
				id: addUserDto.chanId
			}
			});
		const user = addUserDto.user;		
		if (channel == null || user == null)
		throw new NotFoundException("No such Channel or User");
		channel.users.push(user);
		return this.channelRepository.save(channel);
	}	

	async rm(rmUserDto: RmUserDto) {
		let channel: Channel | null = await this.channelRepository.findOne({
			relations: { users: true, banned: true, muted: true, admin: true, owner: true},
			where: {
				id: rmUserDto.chanid
			}
			});
		const user = await this.userService.getById(rmUserDto.user.id);
		if (channel === null || user === null)
			throw new NotFoundException("No such Channel or User");
		if (channel.owner?.id == user.id){
			await this.userService.RmOwned(user.id, channel.id);
			channel.owner = undefined;
		}		
		if (await this.isUserAdmin({chanid: channel.id, userid: user.id}))		
			channel = await this.rmAdmin({chanid: channel.id, userid: user.id});
		channel.users = channel.users.filter(elem => elem.id != user.id);
		return await this.channelRepository.save(channel);
	}

	async update(id: number, channelUpdate: any) {		
		const channel = await this.channelRepository.findOne({
			relations: { users: true },
			where: {
				id,
			}
		});
		if (channel) {
			if (channelUpdate.channame)
				channel.name = channelUpdate.channame;
			if (channelUpdate.users)
				channel.users = channelUpdate.users;
			if (channelUpdate.password)
			{
				const salt = await bcrypt.genSalt();
				const hashPassword = await bcrypt.hash(channelUpdate.password, salt);
				channel.password = hashPassword;
			}
			if (channelUpdate.rmPassword) {
				channel.password = ""; // for now
				channel.chanType = 0;
			}
			if (channelUpdate.chanType)
				channel.chanType = channelUpdate.chanType;
		  	return await this.channelRepository.save(channel);
		}
		return 'There is no channel to update';
	  }

	getById(id: number) {
		return this.channelRepository.findOne({
			relations: {
				admin: true,
				users: true,
				muted: true,
				banned: true,
				owner: true,
			},
			where: {
				id: id
			}
		});
	  }

	  getByName(name: string) {
		return this.channelRepository.findOne({
			relations: {
				users: true,
				muted: true,
				banned: true,
			},
			where: {
				name: name
			}
		});
	  }

	  async muteUser(muteUserDto: MuteUserDto) {
		const channel: Channel | null = await this.channelRepository.findOne({
			relations: { users: true, muted: true, },
			where: { id: muteUserDto.chanid }
		});
		const user = await this.userService.getById(muteUserDto.userid);
		if (channel === null || user === null)
			throw new BadRequestException("No such Channel or User");
		channel.muted.push(user);
		
		return this.channelRepository.save(channel);
	}
	
	  async banUser(banUserDto: BanUserDto) {
		const channel: Channel | null = await this.channelRepository.findOne({
			relations: { users: true, banned: true },
			where: { id: banUserDto.chanid }
		});
		const user = await this.userService.getById(banUserDto.userid);
		if (channel === null || user === null)
			throw new BadRequestException("No such Channel or User");
		channel.banned.push(user);
		return this.channelRepository.save(channel);
	  }

	  getAll() {
		return this.channelRepository.find();
	  }

	  getPublic() {		
		return this.channelRepository.find({
			where: [
				{chanType: 0},
				{chanType: 2},
				]
			});

	  }

	  getUserChannel (id: number) {
		return this.channelRepository.find({
			where:
				{ users: { id : id} }
		})
	  }

	  async unmuteUser(muteUserDto: MuteUserDto) {
		const channel: Channel | null = await this.channelRepository.findOne({
			relations: { users: true, muted: true },
			where: { id: muteUserDto.chanid }
		});
		const user = channel?.muted.find(elem => elem.id == muteUserDto.userid)
		if (channel === null || user === null || user === undefined)
			throw new BadRequestException();		
		const index = channel.muted.indexOf(user, 0);		
		if (index != -1)
			channel.muted.splice(index, 1);
		return await this.channelRepository.save(channel);
	}

	async unbanUser(muteUserDto: MuteUserDto) {
		const channel: Channel | null = await this.channelRepository.findOne({
			relations: { users: true, banned: true },
			where: { id: muteUserDto.chanid }
		});
		const user = channel?.banned.find(elem => elem.id == muteUserDto.userid)
		if (channel === null || user === null || user === undefined)
			throw new BadRequestException("No such Channel or User");		
		const index = channel.banned.indexOf(user, 0);		
		if (index != -1)
			channel.banned.splice(index, 1);
		return this.channelRepository.save(channel);
	}

	async isUserMuted(muteUserDto: MuteUserDto) {
		const channel: Channel | null = await this.channelRepository.findOne({
			relations: { users: true, muted: true },
			where: { id: muteUserDto.chanid }
		});
		const user = await this.userService.getById(muteUserDto.userid);
		if (channel === null || user === null)
			throw new BadRequestException("No such Channel or User");
		if (!channel.muted)
			return false;		
		for (const iterator of channel.muted) {
			if (iterator.id == user.id)
				return true;			
		}	
		return false;			
	}

	async isUserBanned(muteUserDto: MuteUserDto) {
		const channel: Channel | null = await this.channelRepository.findOne({
			relations: { users: true, banned: true },
			where: { id: muteUserDto.chanid }
		});
		const user = await this.userService.getById(muteUserDto.userid);
		if (channel === null || user === null)
			throw new BadRequestException("No such Channel or User");
		if (!channel.banned)
			return false;
		for (const iterator of channel.banned) {
			if (iterator.id == user.id)
				return true;			
		}
		return false;			
	}

	async addAdmin(giveAdminDto: GiveAdminDto)
	{
		const channel: Channel | null = await this.channelRepository.findOne({
			relations: { users: true, admin: true },
			where: {
				id: giveAdminDto.chanid
			}
			});
		const user = await this.userService.getById(giveAdminDto.userid);
		if (channel == null || user == null)
			throw new NotFoundException("No such Channel or User");
		channel.admin.push(user);
		return this.channelRepository.save(channel);
	}

	async rmAdmin(rmAdminDto: RmAdminDto)
	{
		const channel = await this.channelRepository.findOne({
			relations: { admin: true, users: true },
			where: { id: rmAdminDto.chanid}
		});
		if (!channel)
		throw new BadRequestException("No such Channel");
		const user = channel.admin.find(user => user.id === rmAdminDto.userid);
		if (!user)
			throw new BadRequestException("No such User in Admin List");
		channel.admin = channel.admin.filter(elem => elem.id != user.id);		
		return this.channelRepository.save(channel);		
	}

	async isUserAdmin(giveAdminDto: GiveAdminDto) {
        const channel: Channel | null = await this.channelRepository.findOne({
                relations: { users: true, admin: true },
                where: { id: giveAdminDto.chanid }
        });
        const user = await this.userService.getById(giveAdminDto.userid);
        if (channel === null || user === null)
                throw new BadRequestException("No such Channel or User");
        if (!channel.admin)
                return false;
		for (const iterator of channel.admin) {
			if (iterator.id == user.id)
				return true;			
		}
        return false;
	}

	async isUserinChan(channel: Channel, user: User) {
		if (channel.users.find(elem => elem.id == user.id))
			return true;
		return false;
	}
}
