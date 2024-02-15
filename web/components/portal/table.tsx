import React from 'react';
import { PokerTable, Player } from '@/types';

const Table: React.FC<PokerTable> = ({ tableName, maxPlayers, players }) => {
  const renderSeats = () => {
    const seats = [];
    for (let i = 0; i < maxPlayers; i++) {
      
      let seatLabel = "Seat Available";
      let seatClass = 'border-gray-300';
      
      if (i < players.length) {
        const currentPlayer = players[i];
        seatLabel = currentPlayer.displayName;
        seatClass = currentPlayer.isReady ? 'border-green-300' : 'border-gray-300';
      }

      seats.push(
        <div key={`Seat-${i}`} className={`portal-cell p-4 border ${seatClass}`}>
          {seatLabel}
        </div>
      );
    }
    return seats;
  };

  return (
    <div className="portal-row portal-row grid grid-cols-1 sm:grid-cols-2 gap-4">
      {renderSeats()}
    </div>
  );
};

export default Table;