import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Results {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.results)
  user: User;

  @Column()
  winner: string;

  @Column()
  loser: string;
  
  @Column({ default: 0 })
  winnerId: number;

  @Column({ default: 0 })
  loserId: number;

  @Column()
  winner_score: string;

  @Column()
  loser_score: string;

  @Column()
  winner_elo: number;

  @Column()
  loser_elo: number;

}
