import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  emoji: text("emoji").notNull(),
  description: text("description").notNull(),
  provider: text("provider").notNull(), // 'PG Soft', 'Fat Panda', 'Pragmatic Play'
  badgeText: text("badge_text").notNull(),
  badgeColor: text("badge_color").notNull(),
  assertivenessLevel: integer("assertiveness_level").notNull(), // 1-100
  isActive: boolean("is_active").notNull().default(true),
});

export const signals = pgTable("signals", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  strength: text("strength").notNull(), // 'FRACO', 'MÉDIO', 'FORTE', 'MUITO FORTE'
  strengthLevel: integer("strength_level").notNull(), // 1-5
  recommendation: text("recommendation").notNull(), // 'JOGAR', 'AGUARDAR'
  confidence: integer("confidence").notNull(), // 1-100
  assertiveness: integer("assertiveness").notNull(), // 1-100 Nível de assertividade específico do sinal
  normalSpins: integer("normal_spins").notNull(), // Giros no modo normal
  turboSpins: integer("turbo_spins").notNull(), // Giros no modo turbo
  autoMode: boolean("auto_mode").default(false), // Modo automático recomendado
  profitableTimeStart: text("profitable_time_start").notNull(), // Horário inicial pagante
  profitableTimeEnd: text("profitable_time_end").notNull(), // Horário final pagante
  bettingHouses: text("betting_houses").array().notNull(), // Casas de apostas compatíveis
  algorithm: text("algorithm").notNull(), // Algoritmo específico usado
  result: text("result"), // 'WIN', 'LOSS', null for pending
  userFeedback: text("user_feedback"), // 'FUNCIONOU', 'NAO_FUNCIONOU', null
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
});

export const insertSignalSchema = createInsertSchema(signals).omit({
  id: true,
  createdAt: true,
});

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Signal = typeof signals.$inferSelect;
export type InsertSignal = z.infer<typeof insertSignalSchema>;
