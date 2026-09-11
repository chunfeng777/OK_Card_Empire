export type OpeningStage = 'choose' | 'shuffle' | 'focus' | 'tear' | 'opening' | 'video' | 'handoff'
export interface SealBounds { left: number; top: number; width: number }
export interface OpeningResult { name: string; rarity: string; coin: number; image: string }
export const PACK_COVER = '/images/pack-opening/ok-pack.jpg'
export const PACK_VIDEO = '/videos/ok-pack-reveal.mp4'
