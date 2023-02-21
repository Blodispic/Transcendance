import { useEffect, useState } from "react";
import { IUser } from "../../interface/User";
import { GiCrossedSwords } from "react-icons/gi";

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
        match: { winner: string, loser: string, winner_score: number, loser_score: number, winner_avatar: string, loser_avatar: string, winner_elo: number, loser_elo: number, }[];
    }

    const MatchesReq = () => {
      return (
        <div className="match-list">
          {matchReq.map((match) => (
            <div className="match-block" key={match.winner + match.loser}>
              <div className="winner">
                <div className="winner-img">
                  <img src={match.winner_avatar} alt={match.winner} />
                </div>
                <div className="match-info">
                  <div className="match-name">{match.winner}</div>
                  <div className="match-elo">{match.winner_elo} ELO</div>
                </div>
              </div>
              <div className="match-score-container">
                <div className="match-score">
                  {match.winner_score} <GiCrossedSwords /> {match.loser_score}
                </div>
              </div>
              <div className="loser">
                <div className="match-info">
                  <div className="match-name">{match.loser}</div>
                  <div className="match-elo">{match.loser_elo} ELO</div>
                </div>
                <div className="loser-img">
                  <img src={match.loser_avatar} alt={match.loser} />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    };
    

    return (
        <div>
            <div className='MatchHeader'>
                <MatchesReq />
                <div className='MatchRequestBlock'>
                </div>
                <div className='MatchListBlock'>
                </div>
            </div>
        </div>
    )
}