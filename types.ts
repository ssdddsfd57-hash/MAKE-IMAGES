
export enum FontStyle {
  // 豪放张扬 (Impact & Aggressive)
  WILD_SHADE = 'Bungee Shade',
  WILD_METAL = 'Metal Mania',
  WILD_BEAST = 'Rubik Beastly',
  WILD_IMPACT = 'Syne',
  WILD_MARKER = 'Permanent Marker',
  WILD_ROCK = 'Rock Salt',
  WILD_CREEP = 'Creepster',
  
  // 极度秀丽 (Elegant & Fluid)
  LUXE_MONSIEUR = 'Monsieur La Doulaise',
  LUXE_PINYON = 'Pinyon Script',
  LUXE_ITALIANNO = 'Italianno',
  LUXE_DECO = 'Cinzel Decorative',
  LUXE_VIBES = 'Great Vibes',
  LUXE_PARISIENNE = 'Parisienne',
  
  // 肆意潦草 (Scribbled & Raw)
  RAW_REENIE = 'Reenie Beanie',
  RAW_JUST_HAND = 'Just Another Hand',
  RAW_GRACE = 'Covered By Your Grace',
  RAW_ZEYADA = 'Zeyada',
  RAW_NANUM = 'Nanum Pen Script',
  
  // 艺术变体
  GOTHIC = 'UnifrakturMaguntia',
}

export enum TextPosition {
  CENTER = 'CENTER',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  TOP_RIGHT = 'TOP_RIGHT'
}

export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export interface AvatarSettings {
  text: string;
  color: string;
  fontSize: number;
  fontStyle: FontStyle;
  position: TextPosition;
  intensity: number;
  auraSize: number; // 新增：控制光晕大小
  textTransform: TextTransform;
  letterSpacing: number;
}

export interface AppStats {
  localCreations: number;
  sessionCreations: number;
  simulatedLiveUsers: number;
}
