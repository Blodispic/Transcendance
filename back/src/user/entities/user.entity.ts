import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";

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

  @Column()
  elo: number;
  // @Column()
  // avatar: HTMLImageElement;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(type => User, user => user.friends)
  @JoinTable()
    friends: User[];
}
