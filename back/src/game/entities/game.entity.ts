import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity()
export class GameInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User)
  player1: User;

  @ManyToOne(type => User)
  player2: User;
}
