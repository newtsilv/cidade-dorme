import type { RoleId } from './types'

const roleImages: Record<RoleId, string> = {
  assassin: '/avatars/assassino.png',
  detective: '/avatars/detetive.png',
  doctor: '/avatars/medico.png',
  citizen: '/avatars/cidadao.png',
  liar: '/avatars/mentiroso.png',
}

export const getRoleImagePath = (roleId: RoleId) => roleImages[roleId]
