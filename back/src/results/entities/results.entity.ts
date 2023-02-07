import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Results {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.results)
  user: User;

  @Column()
  winner: string;

  @Column()
  looser: string;

  @Column()
  winner_score: string;

  @Column()
  looser_score: string;

  // @Column()
  // winner_avatar: string;

  // @Column()
  // looser_avatar: string;

}