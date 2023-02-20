import { useEffect, useState } from "react";
import { IUser } from "../../interface/User";

export function History(props: { user: IUser }) {
    const { user } = props;
    const [matchReq, setMatches] = useState<{ winner: string, loser: string, winner_score: number, loser_score: number, winner_avatar: string, loser_avatar: string, winner_elo: number, loser_elo: number, }[]>([]);

    useEffect(() => {
        const checkMatchRequest = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user/matches`, {
                method: 'POST',
                body: JSON.stringify(user),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setMatches(data);
        };

        checkMatchRequest();
    }, []);

    interface MatchesListProps {
        friends: { winner: string, loser: string, winner_score: number, loser_score: number, winner_avatar: string, loser_avatar: string, winner_elo: number, loser_elo: number, }[];
    }

    const MatchList = (props: MatchesListProps) => {
        return (
            <ul className="friends-list">
                {props.friends.map(match => (
                    <li className="friend-block" key={match.winner}>
                        <div className="friend-img">
                            <img src={match.winner_avatar} alt={match.winner} />
                        </div>
                        <div className="friend-info">
                            <div className="friend-name">{match.winner}</div>
                        </div>

                    </li>
                ))}
            </ul>
        )
    }

    const MatchesReq = () => {
        console.log(matchReq)
        return <MatchList friends={matchReq} />;
    }

    return (
        <div>
            <div className='FriendHeader'>
                <MatchesReq />
                <div className='FriendRequestBlock'>
                </div>
                <div className='FriendListBlock'>
                </div>
            </div>
        </div>
    )
}