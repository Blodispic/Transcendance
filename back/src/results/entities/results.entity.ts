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
  loser: string;

  @Column()
  winner_score: string;

  @Column()
  loser_score: string;

  @Column()
  winner_elo: number;

  @Column()
  loser_elo: number;

  // @Column()
  // winner_avatar: string;

  // @Column()
  // loser_avatar: string;

}