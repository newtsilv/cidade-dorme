export const getServerPort = (env: Pick<NodeJS.ProcessEnv, 'PORT' | 'SERVER_PORT'>): number => {
  const rawPort = env.PORT ?? env.SERVER_PORT ?? '4000'
  const port = Number(rawPort)

  return Number.isFinite(port) && port > 0 ? port : 4000
}

export const getClientOrigin = (env: Pick<NodeJS.ProcessEnv, 'CLIENT_ORIGIN'>): string =>
  env.CLIENT_ORIGIN ?? 'http://localhost:3000'
