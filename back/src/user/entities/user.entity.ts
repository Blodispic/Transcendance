import { Channel } from "src/channel/entities/channel.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // @Column()
  // avatar: HTMLImageElement;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Channel)
	channels: Channel[]


  // ON vera le reste plus tard
}
