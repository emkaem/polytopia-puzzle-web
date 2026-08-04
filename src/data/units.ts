// Polytopia v116 unit stats for the three units supported by the calculator.
// Source: extracted from polytopia-damage-calculator.firebaseapp.com bundle (v116 "Splash Rework").

import warriorImg from '../units/Imperius_default_Warrior.png'
import archerImg from '../units/Imperius_default_Archer.png'
import riderImg from '../units/Imperius_default_Rider.png'
import giantImg from '../units/Imperius_default_Giant.png'
import defenderImg from '../units/Imperius_default_Defender.png'
import mindbenderImg from '../units/Imperius_default_Mindbender.png'
import swordsmanImg from '../units/Imperius_default_Swordsman.png'
import catapultImg from '../units/Imperius_default_Catapult.png'
import cloakImg from '../units/Imperius_default_Cloak.png'
import daggerImg from '../units/Imperius_default_Dagger.png'
import knightImg from '../units/Imperius_default_Knight.png'
import amphibianImg from '../units/Imperius_default_Amphibian.png'
import jellyImg from '../units/Imperius_default_Jelly.png'
import pufferImg from '../units/Imperius_default_Puffer.png'
import sharkImg from '../units/Imperius_default_Shark.png'
import tridentionImg from '../units/Imperius_default_Tridention.png'
import crabImg from '../units/Imperius_default_Crab.png'
import raftImg from '../units/Imperius_default_Transportship.png'
import rammerImg from '../units/Imperius_default_Rammership.png'
import scoutImg from '../units/Imperius_default_Scoutship.png'
import bomberImg from '../units/Imperius_default_Bombership.png'
import juggernautImg from '../units/Imperius_default_Juggernaut.png'
import dinghyImg from '../units/Imperius_default_Cloak_Boat.png'
import pirateImg from '../units/Imperius_default_Pirate.png'

import warriorDefImg from '../units-defender/Xin-xi_default_Warrior.png'
import archerDefImg from '../units-defender/Xin-xi_default_Archer.png'
import riderDefImg from '../units-defender/Xin-xi_default_Rider.png'
import giantDefImg from '../units-defender/Xin-xi_default_Giant.png'
import defenderDefImg from '../units-defender/Xin-xi_default_Defender.png'
import mindbenderDefImg from '../units-defender/Xin-xi_default_Mindbender.png'
import swordsmanDefImg from '../units-defender/Xin-xi_default_Swordsman.png'
import catapultDefImg from '../units-defender/Xin-xi_default_Catapult.png'
import cloakDefImg from '../units-defender/Xin-xi_default_Cloak.png'
import daggerDefImg from '../units-defender/Xin-xi_default_Dagger.png'
import knightDefImg from '../units-defender/Xin-xi_default_Knight.png'
import amphibianDefImg from '../units-defender/Xin-xi_default_Amphibian.png'
import jellyDefImg from '../units-defender/Xin-xi_default_Jelly.png'
import pufferDefImg from '../units-defender/Xin-xi_default_Puffer.png'
import sharkDefImg from '../units-defender/Xin-xi_default_Shark.png'
import tridentionDefImg from '../units-defender/Xin-xi_default_Tridention.png'
import crabDefImg from '../units-defender/Xin-xi_default_Crab.png'
import raftDefImg from '../units-defender/Xin-xi_default_Transportship.png'
import rammerDefImg from '../units-defender/Xin-xi_default_Rammership.png'
import scoutDefImg from '../units-defender/Xin-xi_default_Scoutship.png'
import bomberDefImg from '../units-defender/Xin-xi_default_Bombership.png'
import juggernautDefImg from '../units-defender/Xin-xi_default_Juggernaut.png'
import dinghyDefImg from '../units-defender/Xin-xi_default_Cloak_Boat.png'
import pirateDefImg from '../units-defender/Xin-xi_default_Pirate.png'

export type Skill = 'fortify' | 'stiff' | 'surprise' | 'static' | 'persist' | 'splash' | 'stomp'
export type Tribe = 'normal' | 'cymanti' | 'aquarion' | 'elyrion' | 'polaris'

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
  tribe: Tribe
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
    tribe: 'normal',
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
    tribe: 'normal',
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
    tribe: 'normal',
  },
  {
    id: 'giant',
    name: 'Giant',
    maxHealth: 40,
    attack: 5,
    defence: 4,
    skills: [],
    image: giantImg,
    defenderImage: giantDefImg,
    tribe: 'normal',
  },
  {
    id: 'defender',
    name: 'Defender',
    maxHealth: 15,
    attack: 1,
    defence: 3,
    skills: ['fortify'],
    image: defenderImg,
    defenderImage: defenderDefImg,
    tribe: 'normal',
  },
  {
    id: 'mindbender',
    name: 'Mind Bender',
    maxHealth: 10,
    attack: 0,
    defence: 1,
    skills: ['stiff'],
    image: mindbenderImg,
    defenderImage: mindbenderDefImg,
    tribe: 'normal',
  },
  {
    id: 'swordsman',
    name: 'Swordsman',
    maxHealth: 15,
    attack: 3,
    defence: 3,
    skills: [],
    image: swordsmanImg,
    defenderImage: swordsmanDefImg,
    tribe: 'normal',
  },
  {
    id: 'catapult',
    name: 'Catapult',
    maxHealth: 10,
    attack: 4,
    defence: 0,
    skills: ['stiff'],
    image: catapultImg,
    defenderImage: catapultDefImg,
    tribe: 'normal',
  },
  {
    id: 'cloak',
    name: 'Cloak',
    maxHealth: 5,
    attack: 2,
    defence: 0.5,
    skills: ['stiff'],
    image: cloakImg,
    defenderImage: cloakDefImg,
    tribe: 'normal',
  },
  {
    id: 'dagger',
    name: 'Dagger',
    maxHealth: 10,
    attack: 2,
    defence: 2,
    skills: ['surprise', 'static'],
    image: daggerImg,
    defenderImage: daggerDefImg,
    tribe: 'normal',
  },
  {
    id: 'knight',
    name: 'Knight',
    maxHealth: 10,
    attack: 3.5,
    defence: 1,
    skills: ['fortify'],
    image: knightImg,
    defenderImage: knightDefImg,
    tribe: 'normal',
  },
  {
    id: 'amphibian',
    name: 'Amphibian',
    maxHealth: 10,
    attack: 2,
    defence: 1,
    skills: ['fortify'],
    image: amphibianImg,
    defenderImage: amphibianDefImg,
    tribe: 'aquarion',
  },
  {
    id: 'jelly',
    name: 'Jelly',
    maxHealth: 20,
    attack: 2,
    defence: 2,
    skills: ['static', 'stiff'],
    image: jellyImg,
    defenderImage: jellyDefImg,
    tribe: 'aquarion',
  },
  {
    id: 'puffer',
    name: 'Puffer',
    maxHealth: 10,
    attack: 4,
    defence: 0,
    skills: ['stiff'],
    image: pufferImg,
    defenderImage: pufferDefImg,
    tribe: 'aquarion',
  },
  {
    id: 'shark',
    name: 'Shark',
    maxHealth: 10,
    attack: 3.5,
    defence: 2,
    skills: [],
    image: sharkImg,
    defenderImage: sharkDefImg,
    tribe: 'aquarion',
  },
  {
    id: 'tridention',
    name: 'Tridention',
    maxHealth: 10,
    attack: 2.5,
    defence: 1,
    skills: ['persist'],
    image: tridentionImg,
    defenderImage: tridentionDefImg,
    tribe: 'aquarion',
  },
  {
    id: 'crab',
    name: 'Crab',
    maxHealth: 40,
    attack: 4,
    defence: 4,
    skills: ['static'],
    image: crabImg,
    defenderImage: crabDefImg,
    tribe: 'aquarion',
  },
  {
    id: 'raft',
    name: 'Raft',
    maxHealth: 10,
    attack: 0,
    defence: 1,
    skills: ['stiff', 'static'],
    image: raftImg,
    defenderImage: raftDefImg,
    tribe: 'normal',
  },
  {
    id: 'rammer',
    name: 'Rammer',
    maxHealth: 10,
    attack: 3,
    defence: 3,
    skills: ['static'],
    image: rammerImg,
    defenderImage: rammerDefImg,
    tribe: 'normal',
  },
  {
    id: 'scout',
    name: 'Scout',
    maxHealth: 10,
    attack: 2,
    defence: 1,
    skills: ['static'],
    image: scoutImg,
    defenderImage: scoutDefImg,
    tribe: 'normal',
  },
  {
    id: 'bomber',
    name: 'Bomber',
    maxHealth: 10,
    attack: 3,
    defence: 2,
    skills: ['stiff', 'static', 'splash'],
    image: bomberImg,
    defenderImage: bomberDefImg,
    tribe: 'normal', 
  },
  {
    id: 'juggernaut',
    name: 'Juggernaut',
    maxHealth: 40,
    attack: 4,
    defence: 4,
    skills: ['stiff', 'static', 'stomp'],
    image: juggernautImg,
    defenderImage: juggernautDefImg,
    tribe: 'normal', 
  },
  {
    id: 'dinghy',
    name: 'Dinghy',
    maxHealth: 5,
    attack: 2,
    defence: 0.5,
    skills: ['stiff', 'static'],
    image: dinghyImg,
    defenderImage: dinghyDefImg,
    tribe: 'normal',
  },
  {
    id: 'pirate',
    name: 'Pirate',
    maxHealth: 10,
    attack: 2,
    defence: 2,
    skills: ['surprise', 'static'],
    image: pirateImg,
    defenderImage: pirateDefImg,
    tribe: 'normal',
  },
]

export const UNIT_MAP: Record<string, UnitDefinition> = Object.fromEntries(
  UNITS.map((u) => [u.id, u]),
)
