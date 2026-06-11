import type { Role, RoleId } from './types'

export const ROLES: Record<RoleId, Role> = {
  citizen: {
    id: 'citizen',
    name: 'Cidadao',
    description: 'Descubra os assassinos e vote para salvar a cidade.',
    team: 'citizens',
    actionType: 'none',
  },
  assassin: {
    id: 'assassin',
    name: 'Assassino',
    description: 'Escolha uma vitima durante a noite e sobreviva ate dominar a cidade.',
    team: 'assassins',
    actionType: 'kill',
  },
  detective: {
    id: 'detective',
    name: 'Detetive',
    description: 'Dê um palpite de quem e assassino. O sistema dira apenas se acertou.',
    team: 'citizens',
    actionType: 'guess-assassin',
  },
  doctor: {
    id: 'doctor',
    name: 'Medico',
    description: 'Proteja uma pessoa por noite para impedir uma morte.',
    team: 'citizens',
    actionType: 'protect',
  },
  liar: {
    id: 'liar',
    name: 'Mentiroso',
    description: 'Venca sozinho se a cidade votar para eliminar voce.',
    team: 'solo',
    actionType: 'none',
  },
}

export const getRole = (roleId: RoleId): Role => ROLES[roleId]
