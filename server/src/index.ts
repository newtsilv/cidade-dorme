import cors from '@fastify/cors'
import Fastify from 'fastify'
import { Server } from 'socket.io'
import { registerSocketHandlers } from './socket/handlers'
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socket/events'

const port = Number(process.env.SERVER_PORT ?? 4000)
const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:3000'

const app = Fastify({ logger: true })
await app.register(cors, { origin: clientOrigin })

app.get('/health', async () => ({ ok: true }))

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(app.server, {
  cors: {
    origin: clientOrigin,
  },
})

registerSocketHandlers(io)

await app.listen({ port, host: '0.0.0.0' })
