export interface Modul { id: string; naziv: string; hasTranscript: boolean }

export interface BackendQuestion {
  besediloVprasanja: string
  moznosti: string[]
  indeksPravilnegaOdgovora: number
  razlaga: string
  tezavnost: string
}

export interface BankaQuestion {
  id: string
  besediloVprasanja: string
  moznosti: string[]
  indeksPravilnegaOdgovora: number
  razlaga: string
  tezavnost: string | null
}

export interface KvizQuestion {
  id: string
  besediloVprasanja: string
  moznosti: string[]
  indeksPravilnegaOdgovora: number
  razlaga: string
  tezavnost: string | null
}

export interface Kviz {
  id: string
  naziv: string
  status: string
  casIzvajanja: number
  predmetId: string
}

export type QuestionState = BackendQuestion & { id: number; approved: boolean | null }
export type AIDifficultyColor = Record<string, string>
export type View = 'generate' | 'banka' | 'newquiz' | 'kviz'