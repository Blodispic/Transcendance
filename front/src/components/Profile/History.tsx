import * as React from 'react';
import { useEffect, useState } from "react";
import { IUser } from "../../interface/User";
import { GiCrossedSwords } from "react-icons/gi";
import { Result } from "../../interface/Result"
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/Hook";

export function History(props: { user: IUser }) {
    const { user } = props;
    const [matchReq, setMatches] = useState<Result[] | undefined>(undefined);
    const navigate = useNavigate();
    const myToken = useAppSelector(state => state.user.myToken);

    useEffect(() => {
        const checkMatchRequest = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user/matches`, {
                method: 'POST',
                body: JSON.stringify({userId: user.id}),
                headers: {
                  'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
              },
            });
            const data = await response.json();
            setMatches(data);
        };

    checkMatchRequest();
  }, [user]);

  const MatchesReq = () => {
    return (
      <div className="match-list">
        {matchReq && matchReq.length > 0 ? (
          matchReq.map((match) => (
            <div className="match-block" key={match.id + match.winner.username + match.loser.username}>
              <div className="winner">
                <div className="winner-img pointer" onClick={() => navigate(`../Profile/${match.winner.id}`)} >
                  <img src={`${process.env.REACT_APP_BACK}user/${match.winner.id}/avatar`} alt={match.winner.username} />
                </div>
                <div className="match-info">
                  <div className="match-name">{match.winner.username}</div>
                  <div className="match-elo">{match.winner_elo} <span style={{ color: '#357E3B' }}>(+50)</span></div>
                </div>
              </div>
              <div className="match-score-container">
                <div className="match-score">
                  {match.winner_score} <GiCrossedSwords /> {match.loser_score}
                </div>
              </div>
              <div className="loser">
                <div className="match-info">
                  <div className="match-name">{match.loser.username}</div>
                  <div className="match-elo">{match.loser_elo} <span style={{ color: '#A83349' }}>(-50)</span></div>

                </div>
                <div className="loser-img pointer" onClick={() => navigate(`../Profile/${match.loser.id}`)}>
                  <img src={`${process.env.REACT_APP_BACK}user/${match.loser.id}/avatar`} alt={match.loser.username} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    );
  };



  return (
    <div>
      <div className='MatchHeader scrollWesh'>
        <MatchesReq />
        <div className='MatchRequestBlock'>
        </div>
        <div className='MatchListBlock'>
        </div>
      </div>
    </div>
  )
}
