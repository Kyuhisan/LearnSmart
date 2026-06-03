import { http, HttpResponse } from 'msw'

export const API = 'http://localhost:8081'

// ── reusable fixtures ────────────────────────────────────────────────────────
export const mockModule = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: 'mod-1',
  naziv: 'Math Basics',
  opis: 'Learn the fundamentals of mathematics.',
  jeObjavljen: false,
  tezavnost: 2,
  ustvarjenOb: '2024-01-01T00:00:00Z',
  uciteljImePriimek: 'Test Prof',
  kategorije: ['MATH'],
  kodaVpisa: 'CODE1',
  steviloVpisanih: 5,
  ...overrides,
})

export const mockQuizResult = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: 'r1',
  kvizId: 'quiz-1',
  kvizNaziv: 'Test Quiz',
  tocke: 8,
  skupajVprasanj: 10,
  odstotek: 80,
  casResevanjaS: 120,
  oddanoOb: '2024-06-01T10:00:00Z',
  ...overrides,
})

// ── default handlers (all tests start with these) ────────────────────────────
export const handlers = [
  // Auth / profile
  http.get(`${API}/api/me/status`, () =>
    HttpResponse.json({ username: 'testuser', vloga: 'ucenec', ucniTip: 'visual', xp: 100, nivo: 1, isNewUser: false })
  ),
  http.post(`${API}/api/me/complete-registration`, () =>
    HttpResponse.json({ vloga: 'ucenec', username: 'newuser' })
  ),

  // Health (WakeBackend) — backend is awake by default
  http.get(`${API}/health`, () => new HttpResponse(null, { status: 200 })),

  // Modules — public list (different id/name from the professor's own modules)
  http.get(`${API}/moduli`, () =>
    HttpResponse.json([mockModule({ id: 'mod-pub', naziv: 'Public Physics', jeObjavljen: true })])
  ),

  // Modules — professor's own
  http.get(`${API}/moduli/moji`, () =>
    HttpResponse.json([mockModule({ id: 'mod-1', naziv: 'Math Basics', jeObjavljen: false })])
  ),

  // Module mutations
  http.delete(`${API}/moduli/:id`, () => new HttpResponse(null, { status: 204 })),
  http.patch(`${API}/moduli/:id/objavi`, () => HttpResponse.json(mockModule({ jeObjavljen: true }))),
  http.patch(`${API}/moduli/:id/umakni`, () => HttpResponse.json(mockModule({ jeObjavljen: false }))),

  // Enrollments
  http.get(`${API}/vpisi/moji`, () => HttpResponse.json([])),
  http.post(`${API}/vpisi/vpis`, () => HttpResponse.json({ success: true })),
  http.delete(`${API}/vpisi/:predmetId`, () => new HttpResponse(null, { status: 204 })),

  // Quizzes
  http.get(`${API}/kvizi/moji`, () => HttpResponse.json([])),
  http.get(`${API}/kvizi/rezultati/moji`, () => HttpResponse.json([])),
  http.get(`${API}/kvizi/completion`, () => HttpResponse.json({})),
  http.get(`${API}/kvizi/:id/vprasanja`, () =>
    HttpResponse.json([
      { id: 'q1', besediloVprasanja: 'What is 2 + 2?', moznosti: ['3', '4', '5', '6'], indeksPravilnegaOdgovora: 1, razlaga: 'Basic arithmetic.' },
    ])
  ),
  http.post(`${API}/kvizi/:id/rezultat`, () =>
    HttpResponse.json({ xpZasluzen: 10, skupajXp: 110, nivo: 1 })
  ),

  // AI
  http.post(`${API}/ai/classify-style`, () =>
    HttpResponse.json({ learningStyle: 'visual' })
  ),
]
