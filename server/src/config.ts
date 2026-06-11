export const getServerPort = (env: Pick<NodeJS.ProcessEnv, 'PORT' | 'SERVER_PORT'>): number => {
  const rawPort = env.PORT ?? env.SERVER_PORT ?? '4000'
  const port = Number(rawPort)

  return Number.isFinite(port) && port > 0 ? port : 4000
}

const normalizeOrigin = (origin: string): string => origin.trim().replace(/\/+$/, '')

export const getClientOrigin = (env: Pick<NodeJS.ProcessEnv, 'CLIENT_ORIGIN'>): string =>
  normalizeOrigin(env.CLIENT_ORIGIN ?? 'http://localhost:3000')

export const getAllowedOrigins = (clientOrigin: string): string[] =>
  Array.from(new Set([normalizeOrigin(clientOrigin), 'http://localhost:3000', 'http://localhost:3001']))
