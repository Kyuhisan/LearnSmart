export interface Modul { id: string; naziv: string }

export interface BackendQuestion {
  besediloVprasanja: string
  moznosti: string[]
  indeksPravilnegaOdgovora: number
  razlaga: string
}

export interface BankaQuestion {
  id: string
  besediloVprasanja: string
  moznosti: string[]
  indeksPravilnegaOdgovora: number
  razlaga: string
}

export interface KvizQuestion {
  id: string
  besediloVprasanja: string
  moznosti: string[]
  indeksPravilnegaOdgovora: number
  razlaga: string
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