"use server";
import { revalidatePath } from "next/cache";
import { PokerTable } from '@/types';

const table: PokerTable = {
    tableName: 'GME',
    maxPlayers: 2,
    players: [],
};

export async function getTableDetails(): Promise<PokerTable> { return (table) }

export async function joinGame( prevState: { message: string }, formData: FormData,) {
    try {
        const player = formData.get("player");
        if (!player) throw new Error('No public key available. Please connect your wallet.');
        if (table.players.length >= table.maxPlayers) throw new Error('Lobby Full. Please try again later.');
        
        
        const playerAddress = player.toString();
        if (table.players.some(p => p.address === playerAddress)) {
            throw new Error('Wallet Address already Joined Lobby.');
        }

        const displayName = playerAddress.length > 20
            ? `${playerAddress.slice(0, 14)}...${playerAddress.slice(-3)}`
            : playerAddress;

        table.players.push({ address: playerAddress, displayName, isReady: false });
        revalidatePath("/");
        return { message: `Added Player To Lobby` };

    } catch (error) {
        return { message: (error as Error).message || "Failed to Add Player" };
    }
}

export async function readyUp( prevState: { message: string }, formData: FormData,) {
    try {
        const player = formData.get("player");
        if (!player) throw new Error('No public key available. Please connect your wallet.');

        const playerAddress = player.toString();
        const playerIndex = table.players.findIndex(p => p.address === playerAddress);
        if (playerIndex === -1) throw new Error('Player is not in the Lobby.');

        table.players[playerIndex].isReady = true;
        revalidatePath("/");
        return { message: `Player is now ready` };

    } catch (error) {
        return { message: (error as Error).message || "Failed to ready up player" };
    }
}

export async function leaveGame( prevState: { message: string }, formData: FormData,) {
    try {
        const player = formData.get("player");
        if (!player) throw new Error('No public key available. Please connect your wallet.');

        const playerAddress = player.toString();
        if (!table.players.some(p => p.address === playerAddress)) {
            throw new Error('Wallet Address is not in the Lobby.');
        }

        table.players = table.players.filter(p => p.address !== playerAddress);
        revalidatePath("/");
        return { message: `Removed Player From Lobby` };

    } catch (error) {
        return { message: (error as Error).message || "Failed to Remove Player" };
    }
}