import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { User as UserEntity } from './user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  status: string;

  // @Column()
  // avatar: HTMLImageElement;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany((user: { friends: UserEntity; }) => user.friends)
    friends: UserEntity[];
}
