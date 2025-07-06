import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSignalSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all games
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // Get game by ID
  app.get("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGameById(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  // Generate new signal
  app.post("/api/signals", async (req, res) => {
    try {
      const validatedData = insertSignalSchema.parse(req.body);
      const signal = await storage.createSignal(validatedData);
      res.json(signal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid signal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create signal" });
    }
  });

  // Get signals for a game
  app.get("/api/signals/game/:gameId", async (req, res) => {
    try {
      const gameId = parseInt(req.params.gameId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const signals = await storage.getSignalsByGameId(gameId, limit);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch signals" });
    }
  });

  // Get recent signals
  app.get("/api/signals/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const signals = await storage.getRecentSignals(limit);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent signals" });
    }
  });

  // Update signal result
  app.patch("/api/signals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { result } = req.body;
      
      if (!result || !['WIN', 'LOSS'].includes(result)) {
        return res.status(400).json({ message: "Invalid result. Must be 'WIN' or 'LOSS'" });
      }
      
      const signal = await storage.updateSignalResult(id, result);
      if (!signal) {
        return res.status(404).json({ message: "Signal not found" });
      }
      
      res.json(signal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update signal" });
    }
  });

  // Get signal statistics
  app.get("/api/signals/stats", async (req, res) => {
    try {
      const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : undefined;
      const stats = await storage.getSignalStats(gameId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch signal statistics" });
    }
  });

  // Generate advanced assertive signal endpoint
  app.post("/api/signals/generate/:gameId", async (req, res) => {
    try {
      const gameId = parseInt(req.params.gameId);
      
      // Get game information to determine provider-specific algorithm
      const game = await storage.getGameById(gameId);
      if (!game) {
        return res.status(404).json({ message: "Jogo não encontrado" });
      }

      // Get current time in Brasília timezone (UTC-3)
      const now = new Date();
      const brasiliaTime = new Date(now.getTime() - (3 * 60 * 60 * 1000));
      const currentHour = brasiliaTime.getHours();
      const currentMinute = brasiliaTime.getMinutes();

      // Provider-specific algorithms for maximum assertiveness
      let algorithm, assertiveness, strengthLevels, normalSpins, turboSpins, autoMode;

      switch (game.provider) {
        case 'PG Soft':
          // PG Soft algorithm - High frequency cycles
          algorithm = `PG_SOFT_CYCLE_v2.1_${game.name.toUpperCase()}`;
          strengthLevels = [
            { text: 'FORTE', level: 3, weight: 0.4 },
            { text: 'MUITO FORTE', level: 4, weight: 0.6 }
          ];
          normalSpins = Math.floor(Math.random() * 3) + 3; // 3-5 giros
          turboSpins = Math.floor(Math.random() * 2) + 2; // 2-3 giros
          autoMode = true;
          assertiveness = Math.floor(Math.random() * 6) + 94; // 94-99%
          break;

        case 'Fat Panda':
          // Fat Panda algorithm - Medium cycles
          algorithm = `FAT_PANDA_BURST_v1.8_${game.name.toUpperCase()}`;
          strengthLevels = [
            { text: 'MÉDIO', level: 2, weight: 0.3 },
            { text: 'FORTE', level: 3, weight: 0.7 }
          ];
          normalSpins = Math.floor(Math.random() * 4) + 5; // 5-8 giros
          turboSpins = Math.floor(Math.random() * 2) + 3; // 3-4 giros
          autoMode = Math.random() > 0.3;
          assertiveness = Math.floor(Math.random() * 6) + 89; // 89-94%
          break;

        case 'Pragmatic Play':
          // Pragmatic Play algorithm - Volatility based
          algorithm = `PRAGMATIC_VOLATILITY_v3.0_${game.name.toUpperCase()}`;
          strengthLevels = [
            { text: 'FORTE', level: 3, weight: 0.5 },
            { text: 'MUITO FORTE', level: 4, weight: 0.5 }
          ];
          normalSpins = Math.floor(Math.random() * 3) + 4; // 4-6 giros
          turboSpins = Math.floor(Math.random() * 2) + 2; // 2-3 giros
          autoMode = true;
          assertiveness = Math.floor(Math.random() * 5) + 91; // 91-95%
          break;

        default:
          algorithm = 'GENERIC_ALGORITHM_v1.0';
          strengthLevels = [{ text: 'MÉDIO', level: 2, weight: 1.0 }];
          normalSpins = 5;
          turboSpins = 3;
          autoMode = false;
          assertiveness = 85;
      }

      // Select strength based on weight
      const randomValue = Math.random();
      let cumulativeWeight = 0;
      let selectedStrength = strengthLevels[0];

      for (const strength of strengthLevels) {
        cumulativeWeight += strength.weight;
        if (randomValue <= cumulativeWeight) {
          selectedStrength = strength;
          break;
        }
      }

      const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%
      const recommendation = confidence > 85 ? 'JOGAR' : 'AGUARDAR';

      // Calculate next profitable time slots based on current Brasília time
      const calculateNextProfitableSlots = () => {
        const slots = [];
        const currentTotalMinutes = currentHour * 60 + currentMinute;

        // Algorithm-based time slots (after current time)
        const baseSlots = [
          { offset: 15, duration: 45 }, // 15 min from now, 45 min duration
          { offset: 90, duration: 60 }, // 1.5h from now, 1h duration
          { offset: 180, duration: 45 }, // 3h from now, 45 min duration
          { offset: 360, duration: 90 }, // 6h from now, 1.5h duration
        ];

        for (const slot of baseSlots) {
          const startMinutes = currentTotalMinutes + slot.offset;
          const endMinutes = startMinutes + slot.duration;
          
          const startHour = Math.floor(startMinutes / 60) % 24;
          const startMin = startMinutes % 60;
          const endHour = Math.floor(endMinutes / 60) % 24;
          const endMin = endMinutes % 60;

          slots.push({
            start: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
            end: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`
          });
        }

        return slots;
      };

      const profitableSlots = calculateNextProfitableSlots();
      const nextSlot = profitableSlots[0]; // Use the nearest profitable slot

      // Compatible betting houses (provider-specific optimization)
      const allBettingHouses = [
        'Bet365', 'Betano', 'Betfair', 'Sportingbet', 'Betway',
        'KTO', 'Rivalo', 'Novibet', 'Parimatch', 'Stake',
        'Blaze', 'Pixbet', 'Galera.bet', 'Superbet', 'Betwinner'
      ];

      // Select houses based on provider compatibility
      const providerOptimalHouses: Record<string, string[]> = {
        'PG Soft': ['Bet365', 'Betano', 'KTO', 'Stake', 'Pixbet'],
        'Fat Panda': ['Betfair', 'Rivalo', 'Parimatch', 'Blaze'],
        'Pragmatic Play': ['Sportingbet', 'Betway', 'Novibet', 'Superbet', 'Galera.bet']
      };

      const optimalHouses = providerOptimalHouses[game.provider] || allBettingHouses.slice(0, 5);
      const shuffled = [...optimalHouses].sort(() => 0.5 - Math.random());
      const selectedHouses = shuffled.slice(0, Math.floor(Math.random() * 2) + 3); // 3-4 houses

      const signalData = {
        gameId,
        strength: selectedStrength.text,
        strengthLevel: selectedStrength.level,
        recommendation,
        confidence,
        assertiveness,
        normalSpins,
        turboSpins,
        autoMode,
        profitableTimeStart: nextSlot.start,
        profitableTimeEnd: nextSlot.end,
        bettingHouses: selectedHouses,
        algorithm,
        result: null,
      };

      const signal = await storage.createSignal(signalData);
      res.json(signal);
    } catch (error) {
      console.error('Error generating signal:', error);
      res.status(500).json({ message: "Falha ao gerar sinal assertivo" });
    }
  });

  // User feedback endpoint for signal results
  app.post("/api/signals/:id/feedback", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { feedback } = req.body;
      
      if (!feedback || !['FUNCIONOU', 'NAO_FUNCIONOU'].includes(feedback)) {
        return res.status(400).json({ 
          message: "Feedback inválido. Use 'FUNCIONOU' ou 'NAO_FUNCIONOU'" 
        });
      }
      
      const signal = await storage.updateSignalFeedback(id, feedback);
      if (!signal) {
        return res.status(404).json({ message: "Sinal não encontrado" });
      }
      
      res.json({ message: "Feedback registrado com sucesso", signal });
    } catch (error) {
      res.status(500).json({ message: "Falha ao registrar feedback" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
