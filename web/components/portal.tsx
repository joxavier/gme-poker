'use client'
import { useState, useEffect } from 'react';
import { FaEye, FaWallet } from 'react-icons/fa';
import { PublicKey } from '@solana/web3.js'; // Import PublicKey
import { useMemo } from 'react'; // Import useMemo
import { useParams } from 'next/navigation'; // Import useParams

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from './solana/solana-provider';


const maxPlayers = 2;

const Portal = () => {

  const [players, setPlayers] = useState<string[]>([]);
  const { publicKey } = useWallet();
  const [isJoined, setIsJoined] = useState(false);
  const isPortalFull = players.length === maxPlayers;

  useEffect(() => {
    if (publicKey && players.includes(publicKey.toString())) {
      setIsJoined(true);
    } else {
      setIsJoined(false);
    }
  }, [publicKey, players]);

  const handleJoinGame = () => {
    if (!publicKey) {
      throw new Error('No public key available. Please connect your wallet.');
    }
    const walletAddress = publicKey.toString();
    setPlayers([...players, walletAddress]);
  };


  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="portal ">
        <div className="portal-row portal-row grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array(maxPlayers)
            .fill()
            .map((_, index) => (
              <div key={index} className="portal-cell p-4 border border-gray-300">
                {players[index] ? (
                  players[index].length > 20 ? `${players[index].slice(0, 14)}...${players[index].slice(-3)}` : players[index]
                ) : (
                  'Slot Available'
                )}
              </div>
            ))}
        </div>
      </div>
      {isPortalFull ? (
        <FaEye className="mt-4 text-4xl text-gray-500" />
      ) : isJoined ? (
        <button disabled className="mt-4 flex items-center px-4 py-2 bg-gray-500 text-white rounded-md">
          <FaWallet className="mr-2" />
          Already Joined
        </button>
      ) : publicKey ? (
        <button onClick={handleJoinGame} className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-md">
          <FaWallet className="mr-2" />
          Join Game
        </button>
      ) : (
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      )}
    </div>
  );
};

export default Portal;
