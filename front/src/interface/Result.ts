import { IUser } from "./User"

export interface Result {
    id: number

    winner: IUser 
    loser: IUser

    winner_score: number
    loser_score: number
    winner_elo: number
    loser_elo: number
}