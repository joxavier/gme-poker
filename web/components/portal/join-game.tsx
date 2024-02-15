"use client";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { joinGame, leaveGame, readyUp, getTableDetails } from "@/app/actions";
import { FaPlus, FaAngellist, FaPlay, FaEye } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';

const initialState = {
  message: "",
};

function JoinButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="mt-4 flex items-center px-4 py-2 bg-green-500 text-white rounded-md" aria-disabled={pending}>
      <FaPlus className="mr-2" />
      Join Game
    </button>
  )
}

function ReadyButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="mt-4 flex items-center px-4 py-2 bg-green-500 text-white rounded-md" aria-disabled={pending}>
      <FaPlay className="mr-2" />
      READY UP!
    </button>
  )
}

function LeaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="mt-4 flex items-center px-4 py-2 bg-red-500 text-white rounded-md" aria-disabled={pending}>
      <FaAngellist className="mr-2" />
      Leave Game
    </button>
  )
}

function JoinGame() {
  const [joinState, joinAction] = useFormState(joinGame, initialState);
  const [leaveState, leaveAction] = useFormState(leaveGame, initialState);
  const [readyState, readyAction] = useFormState(readyUp, initialState);
  const { publicKey } = useWallet();
  const [isFull, setIsFull] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        if (publicKey) {
          let table = await getTableDetails();
          let players = table.players

          setIsFull(players.length >= table.maxPlayers);
          setIsJoined(players.some(player => player.address === publicKey.toString()));
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }
    fetchPlayers();
  }, [publicKey, joinState, leaveState, readyState]); // Run this effect when publicKey changes

  if (isFull) {
    return (
      <button className="mt-4 flex items-center px-4 py-2 bg-gray-500 text-white rounded-md">
        <FaEye className="mr-2 text-4xl" />
        Lobby full. Join Queue
      </button>

    );
  }
  if (!publicKey) {
    return (
      <div className="hero-content text-center">
        <WalletButton />
      </div>
    )
  }
  if (isJoined) {
    return (
      <div>
        {/*<form action={readyAction}>
          <input type="hidden" id="playerAddress" name="player" value={publicKey?.toString()} />
          <ReadyButton />
          <p aria-live="polite" className="sr-only" role="status">
            {readyState?.message}
          </p>
    </form> */}
        <form action={leaveAction}>
          <input type="hidden" id="playerAddress" name="player" value={publicKey?.toString()} />
          <LeaveButton />
          <p aria-live="polite" className="sr-only" role="status">
            {leaveState?.message}
          </p>
        </form>
      </div>
    );
  }

  return (
    <form action={joinAction}>
      <input type="hidden" id="playerAddress" name="player" value={publicKey?.toString()} />
      <JoinButton />
      <p aria-live="polite" className="sr-only" role="status">
        {joinState?.message}
      </p>
    </form>
  );
}

export default JoinGame;