// Polytopia v116 unit stats for the three units supported by the calculator.
// Source: extracted from polytopia-damage-calculator.firebaseapp.com bundle (v116 "Splash Rework").

import warriorImg from '../units/Imperius_default_Warrior.png'
import archerImg from '../units/Imperius_default_Archer.png'
import riderImg from '../units/Imperius_default_Rider.png'

import warriorDefImg from '../units-defender/Xin-xi_default_Warrior.png'
import archerDefImg from '../units-defender/Xin-xi_default_Archer.png'
import riderDefImg from '../units-defender/Xin-xi_default_Rider.png'

export type Skill = 'fortify' | 'stiff' | 'surprise'

export interface UnitDefinition {
  id: string
  name: string
  maxHealth: number
  attack: number
  defence: number
  skills: Skill[]
  /** Attacker-side sprite (Imperius tribe, faces right) */
  image: string
  /** Defender-side sprite (Xin-xi tribe, will be flipped to face left) */
  defenderImage: string
}

export const UNITS: UnitDefinition[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    maxHealth: 10,
    attack: 2,
    defence: 2,
    skills: ['fortify'],
    image: warriorImg,
    defenderImage: warriorDefImg,
  },
  {
    id: 'archer',
    name: 'Archer',
    maxHealth: 10,
    attack: 2,
    defence: 1,
    skills: ['fortify'],
    image: archerImg,
    defenderImage: archerDefImg,
  },
  {
    id: 'rider',
    name: 'Rider',
    maxHealth: 10,
    attack: 2,
    defence: 1,
    skills: ['fortify'],
    image: riderImg,
    defenderImage: riderDefImg,
  },
]

export const UNIT_MAP: Record<string, UnitDefinition> = Object.fromEntries(
  UNITS.map((u) => [u.id, u]),
)
