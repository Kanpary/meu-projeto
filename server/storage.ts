import { games, signals, type Game, type Signal, type InsertGame, type InsertSignal } from "@shared/schema";

export interface IStorage {
  // Games
  getAllGames(): Promise<Game[]>;
  getGameById(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Signals
  createSignal(signal: InsertSignal): Promise<Signal>;
  getSignalsByGameId(gameId: number, limit?: number): Promise<Signal[]>;
  getRecentSignals(limit?: number): Promise<Signal[]>;
  updateSignalResult(id: number, result: 'WIN' | 'LOSS'): Promise<Signal | undefined>;
  updateSignalFeedback(id: number, feedback: 'FUNCIONOU' | 'NAO_FUNCIONOU'): Promise<Signal | undefined>;
  getSignalStats(gameId?: number): Promise<{
    totalSignals: number;
    winRate: number;
    wins: number;
    losses: number;
  }>;
}

export class MemStorage implements IStorage {
  private games: Map<number, Game> = new Map();
  private signals: Map<number, Signal> = new Map();
  private currentGameId: number = 1;
  private currentSignalId: number = 1;

  constructor() {
    // Initialize with Fortune games
    this.initializeGames();
  }

  private initializeGames() {
    const gameData: InsertGame[] = [
      // PG Soft Games
      {
        name: "fortune-rabbit",
        displayName: "Fortune Rabbit",
        emoji: "🐰",
        description: "Coelho da Fortuna",
        provider: "PG Soft",
        badgeText: "96% Assertivo",
        badgeColor: "fortune-green",
        assertivenessLevel: 96,
        isActive: true,
      },
      {
        name: "fortune-tiger",
        displayName: "Fortune Tiger",
        emoji: "🐯",
        description: "Tigre da Fortuna",
        provider: "PG Soft",
        badgeText: "94% Assertivo",
        badgeColor: "amber",
        assertivenessLevel: 94,
        isActive: true,
      },
      {
        name: "fortune-mouse",
        displayName: "Fortune Mouse",
        emoji: "🐭",
        description: "Rato da Fortuna",
        provider: "PG Soft",
        badgeText: "92% Assertivo",
        badgeColor: "blue",
        assertivenessLevel: 92,
        isActive: true,
      },
      {
        name: "fortune-ox",
        displayName: "Fortune OX",
        emoji: "🐂",
        description: "Touro da Fortuna",
        provider: "PG Soft",
        badgeText: "95% Assertivo",
        badgeColor: "red",
        assertivenessLevel: 95,
        isActive: true,
      },
      {
        name: "fortune-dragon",
        displayName: "Fortune Dragon",
        emoji: "🐉",
        description: "Dragão da Fortuna",
        provider: "PG Soft",
        badgeText: "98% Assertivo",
        badgeColor: "purple",
        assertivenessLevel: 98,
        isActive: true,
      },
      // Fat Panda Games
      {
        name: "lucky-monkey",
        displayName: "Macaco Sortudo",
        emoji: "🐵",
        description: "Lucky Monkey Fat Panda",
        provider: "Fat Panda",
        badgeText: "90% Assertivo",
        badgeColor: "green",
        assertivenessLevel: 90,
        isActive: true,
      },
      // Pragmatic Play Games
      {
        name: "lucky-mouse",
        displayName: "Ratinho Sortudo",
        emoji: "🐁",
        description: "Lucky Mouse Pragmatic",
        provider: "Pragmatic Play",
        badgeText: "93% Assertivo",
        badgeColor: "pink",
        assertivenessLevel: 93,
        isActive: true,
      },
      {
        name: "lucky-tiger",
        displayName: "Tigre Sortudo",
        emoji: "🐅",
        description: "Lucky Tiger Pragmatic",
        provider: "Pragmatic Play",
        badgeText: "91% Assertivo",
        badgeColor: "orange",
        assertivenessLevel: 91,
        isActive: true,
      },
    ];

    gameData.forEach(game => {
      const newGame: Game = { 
        id: this.currentGameId++,
        name: game.name,
        displayName: game.displayName,
        emoji: game.emoji,
        description: game.description,
        provider: game.provider,
        badgeText: game.badgeText,
        badgeColor: game.badgeColor,
        assertivenessLevel: game.assertivenessLevel,
        isActive: game.isActive ?? true,
      };
      this.games.set(newGame.id, newGame);
    });
  }

  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.isActive);
  }

  async getGameById(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const game: Game = { 
      id: this.currentGameId++,
      name: insertGame.name,
      displayName: insertGame.displayName,
      emoji: insertGame.emoji,
      description: insertGame.description,
      provider: insertGame.provider,
      badgeText: insertGame.badgeText,
      badgeColor: insertGame.badgeColor,
      assertivenessLevel: insertGame.assertivenessLevel,
      isActive: insertGame.isActive ?? true,
    };
    this.games.set(game.id, game);
    return game;
  }

  async createSignal(insertSignal: InsertSignal): Promise<Signal> {
    const signal: Signal = { 
      id: this.currentSignalId++,
      gameId: insertSignal.gameId,
      strength: insertSignal.strength,
      strengthLevel: insertSignal.strengthLevel,
      recommendation: insertSignal.recommendation,
      confidence: insertSignal.confidence,
      assertiveness: insertSignal.assertiveness,
      normalSpins: insertSignal.normalSpins,
      turboSpins: insertSignal.turboSpins,
      autoMode: insertSignal.autoMode ?? false,
      profitableTimeStart: insertSignal.profitableTimeStart,
      profitableTimeEnd: insertSignal.profitableTimeEnd,
      bettingHouses: insertSignal.bettingHouses,
      algorithm: insertSignal.algorithm,
      result: insertSignal.result || null,
      userFeedback: insertSignal.userFeedback || null,
      createdAt: new Date(),
    };
    this.signals.set(signal.id, signal);
    return signal;
  }

  async getSignalsByGameId(gameId: number, limit = 10): Promise<Signal[]> {
    return Array.from(this.signals.values())
      .filter(signal => signal.gameId === gameId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getRecentSignals(limit = 10): Promise<Signal[]> {
    return Array.from(this.signals.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async updateSignalResult(id: number, result: 'WIN' | 'LOSS'): Promise<Signal | undefined> {
    const signal = this.signals.get(id);
    if (signal) {
      signal.result = result;
      this.signals.set(id, signal);
      return signal;
    }
    return undefined;
  }

  async updateSignalFeedback(id: number, feedback: 'FUNCIONOU' | 'NAO_FUNCIONOU'): Promise<Signal | undefined> {
    const signal = this.signals.get(id);
    if (signal) {
      signal.userFeedback = feedback;
      this.signals.set(id, signal);
      return signal;
    }
    return undefined;
  }

  async getSignalStats(gameId?: number): Promise<{
    totalSignals: number;
    winRate: number;
    wins: number;
    losses: number;
  }> {
    const allSignals = Array.from(this.signals.values());
    const filteredSignals = gameId 
      ? allSignals.filter(signal => signal.gameId === gameId)
      : allSignals;
    
    const completedSignals = filteredSignals.filter(signal => signal.result);
    const wins = completedSignals.filter(signal => signal.result === 'WIN').length;
    const losses = completedSignals.filter(signal => signal.result === 'LOSS').length;
    
    return {
      totalSignals: filteredSignals.length,
      winRate: completedSignals.length > 0 ? Math.round((wins / completedSignals.length) * 100) : 0,
      wins,
      losses,
    };
  }
}

export const storage = new MemStorage();
