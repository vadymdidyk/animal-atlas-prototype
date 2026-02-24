export const appConfig = {
  session: {
    DURATION_MINUTES: 5,
    TTL_MS: 5 * 60 * 1000,
    TIME_WARNING_MINUTES: 1,
  },

  languages: {
    SUPPORTED: ['jp', 'en'] as const,
    DEFAULT: 'jp',
    QUIZ_HIDER_SYMBOLS: { jp: '◆', en: '_' } as Record<string, string>,
  },

  model: {
    NAME: 'aa_model_v1.0'
  },

  storage: {
    SESSION_KEY: 'aa-v1-session',
    SETTINGS_KEY: 'aa-v1-settings',
    COLLECTION_KEY: 'aa-v1-collection',
  },

  routes: {
    ROOT: '/',
    IDLE: '/idle',
    GOAL: '/goal',
    COLLECTION: '/collection',
    COLLECTION_DETAIL: '/collection/:itemName',
    CAMERA: '/camera',
  },
}

export function collectionDetailPath(itemName: string) {
  return `${appConfig.routes.COLLECTION}/${itemName}`
}