export interface PokerTable {
  tableName: string;
  maxPlayers: number;
  hand?: number;
  players: Player[];
}

export type Player = {
  address: string;
  displayName: string;
  isReady: boolean;
};