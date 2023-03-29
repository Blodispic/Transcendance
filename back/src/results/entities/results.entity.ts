import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity()
export class Results {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  winner: User;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  loser: User;
  
  @RelationId('winner')
  winnerId: number;

  @RelationId('loser')
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
