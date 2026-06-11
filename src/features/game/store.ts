"use client";

import { create } from "zustand";
import type { ChatMessage, GameState, RoleId } from "./types";
import type { PublicRoom } from "../../../server/src/socket/events";

type DetectiveResult = { targetId: string; correct: boolean };

type GameStore = {
  name: string;
  avatar: string;
  room?: PublicRoom;
  game?: GameState;
  playerId?: string;
  ownRole?: RoleId;
  messages: ChatMessage[];
  error?: string;
  detectiveResult?: DetectiveResult;
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
  setRoom: (room?: PublicRoom) => void;
  setGame: (game?: GameState) => void;
  setPlayerId: (playerId: string) => void;
  setOwnRole: (role: RoleId) => void;
  addMessage: (message: ChatMessage) => void;
  setError: (message?: string) => void;
  setDetectiveResult: (result?: DetectiveResult) => void;
  resetSession: () => void;
};

export const useGameStore = create<GameStore>()((set) => ({
  name: "",
  avatar: "emanuel",
  messages: [],
  setName: (name) => set({ name }),
  setAvatar: (avatar) => set({ avatar }),
  setRoom: (room) => set({ room }),
  setGame: (game) => set({ game }),
  setPlayerId: (playerId) => set({ playerId }),
  setOwnRole: (ownRole) => set({ ownRole }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setError: (error) => set({ error }),
  setDetectiveResult: (detectiveResult) => set({ detectiveResult }),
  resetSession: () =>
    set({
      room: undefined,
      game: undefined,
      playerId: undefined,
      ownRole: undefined,
      messages: [],
      error: undefined,
    }),
}));
