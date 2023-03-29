
import { IsOptional } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

enum ChanType {
	Public,
	Private,
	Protected,
  }

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique:true })
	name: string;

	@Column('int', {default: 0})
	chanType: ChanType;

	@Column({ nullable: true, select: false})
	password: string;

	@IsOptional()
	@ManyToOne(() => User, user => user.owned, {cascade: true, onDelete: 'CASCADE' } )
	owner?: User
	
	@ManyToMany(() => User, { cascade: true, onDelete: 'CASCADE'  })
	@JoinTable()
	admin: User[];

	@ManyToMany(() => User, user => user.channels, { cascade: true, onDelete: 'CASCADE'  })
	@JoinTable()
	users: User[];

	@ManyToMany(() => User, { cascade: true, onDelete: 'CASCADE'  })
	@JoinTable()
	banned: User[];

	@ManyToMany(() => User, { cascade: true, onDelete: 'CASCADE'  })
	@JoinTable()
	muted: User[];

}
