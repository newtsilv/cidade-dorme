import cors from '@fastify/cors'
import Fastify from 'fastify'
import { Server } from 'socket.io'
import { getAllowedOrigins, getClientOrigin, getServerPort } from './config'
import { registerSocketHandlers } from './socket/handlers'
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socket/events'

const port = getServerPort(process.env)
const clientOrigin = getClientOrigin(process.env)
const allowedOrigins = getAllowedOrigins(clientOrigin)

const app = Fastify({ logger: true })
await app.register(cors, { origin: allowedOrigins })

app.get('/health', async () => ({ ok: true }))

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(app.server, {
  cors: {
    origin: allowedOrigins,
  },
})

registerSocketHandlers(io)

await app.listen({ port, host: '0.0.0.0' })
