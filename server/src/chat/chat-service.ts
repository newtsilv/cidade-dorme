import type { ChatMessage, Player } from '../../../src/features/game/types'
import { createId } from '../utils/ids'

export const createMessage = ({ roomId, player, text }: { roomId: string; player: Player; text: string }): ChatMessage => ({
  id: createId(),
  roomId,
  playerId: player.id,
  playerName: player.name,
  text: text.trim().slice(0, 240),
  createdAt: new Date().toISOString(),
})
