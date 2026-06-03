import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../test/server'
import { API } from '../../test/handlers'
import {
  getModuliJavni,
  getModuliUcitelj,
  ustvariModul,
  urediModul,
  izbrisiModul,
  objaviModul,
  umaknjiModul,
  getMojiVpisi,
  vpisZKodo,
  odjavaIzModula,
  getStilMix,
  getTopStudents,
  getKviziUcitelja,
} from './moduleApi'

// ── helper: capture the request from an MSW handler ──────────────────────────
function captureRequest(method: 'get' | 'post' | 'put' | 'delete' | 'patch', path: string) {
  let captured: Request | null = null
  server.use(
    http[method](`${API}${path}`, ({ request }) => {
      captured = request
      return HttpResponse.json({})
    })
  )
  return { get: () => captured }
}

const TOKEN = 'test-bearer-token'

describe('moduleApi', () => {
  // ── getModuliJavni ──────────────────────────────────────────────────────────
  it('getModuliJavni — GET /moduli (no auth)', async () => {
    const cap = captureRequest('get', '/moduli')
    await getModuliJavni()
    expect(cap.get()?.url).toBe(`${API}/moduli`)
    expect(cap.get()?.headers.get('Authorization')).toBeNull()
  })

  // ── getModuliUcitelj ────────────────────────────────────────────────────────
  it('getModuliUcitelj — GET /moduli/moji with Bearer token', async () => {
    const cap = captureRequest('get', '/moduli/moji')
    await getModuliUcitelj(TOKEN)
    expect(cap.get()?.url).toBe(`${API}/moduli/moji`)
    expect(cap.get()?.headers.get('Authorization')).toBe(`Bearer ${TOKEN}`)
  })

  // ── ustvariModul ────────────────────────────────────────────────────────────
  it('ustvariModul — POST /moduli with JSON body', async () => {
    let captured: Request | null = null
    server.use(
      http.post(`${API}/moduli`, async ({ request }) => {
        captured = request
        return HttpResponse.json({ id: 'new-id' })
      })
    )
    const payload = { naziv: 'New Module', opis: 'Desc', tezavnost: 3 }
    await ustvariModul(TOKEN, payload)
    expect(captured?.method).toBe('POST')
    expect(captured?.headers.get('Content-Type')).toContain('application/json')
    expect(captured?.headers.get('Authorization')).toBe(`Bearer ${TOKEN}`)
    const body = await captured?.clone().json()
    expect(body).toEqual(payload)
  })

  // ── urediModul ──────────────────────────────────────────────────────────────
  it('urediModul — PUT /moduli/:id', async () => {
    let captured: Request | null = null
    server.use(
      http.put(`${API}/moduli/mod-42`, async ({ request }) => {
        captured = request
        return HttpResponse.json({})
      })
    )
    await urediModul(TOKEN, 'mod-42', { naziv: 'Updated' })
    expect(captured?.method).toBe('PUT')
    expect(captured?.url).toContain('/moduli/mod-42')
  })

  // ── izbrisiModul ────────────────────────────────────────────────────────────
  it('izbrisiModul — DELETE /moduli/:id', async () => {
    let captured: Request | null = null
    server.use(
      http.delete(`${API}/moduli/mod-99`, ({ request }) => {
        captured = request
        return new HttpResponse(null, { status: 204 })
      })
    )
    await izbrisiModul(TOKEN, 'mod-99')
    expect(captured?.method).toBe('DELETE')
    expect(captured?.headers.get('Authorization')).toBe(`Bearer ${TOKEN}`)
  })

  // ── objaviModul ─────────────────────────────────────────────────────────────
  it('objaviModul — PATCH /moduli/:id/objavi', async () => {
    let captured: Request | null = null
    server.use(
      http.patch(`${API}/moduli/mod-1/objavi`, ({ request }) => {
        captured = request
        return HttpResponse.json({})
      })
    )
    await objaviModul(TOKEN, 'mod-1')
    expect(captured?.url).toContain('/moduli/mod-1/objavi')
    expect(captured?.method).toBe('PATCH')
  })

  // ── umaknjiModul ────────────────────────────────────────────────────────────
  it('umaknjiModul — PATCH /moduli/:id/umakni', async () => {
    let captured: Request | null = null
    server.use(
      http.patch(`${API}/moduli/mod-1/umakni`, ({ request }) => {
        captured = request
        return HttpResponse.json({})
      })
    )
    await umaknjiModul(TOKEN, 'mod-1')
    expect(captured?.url).toContain('/moduli/mod-1/umakni')
  })

  // ── getMojiVpisi ────────────────────────────────────────────────────────────
  it('getMojiVpisi — GET /vpisi/moji with auth', async () => {
    const cap = captureRequest('get', '/vpisi/moji')
    await getMojiVpisi(TOKEN)
    expect(cap.get()?.headers.get('Authorization')).toBe(`Bearer ${TOKEN}`)
  })

  // ── vpisZKodo ───────────────────────────────────────────────────────────────
  it('vpisZKodo — POST /vpisi/vpis with kodaVpisa in body', async () => {
    let body: unknown = null
    server.use(
      http.post(`${API}/vpisi/vpis`, async ({ request }) => {
        body = await request.json()
        return HttpResponse.json({})
      })
    )
    await vpisZKodo(TOKEN, 'SECRET123')
    expect(body).toEqual({ kodaVpisa: 'SECRET123' })
  })

  // ── odjavaIzModula ──────────────────────────────────────────────────────────
  it('odjavaIzModula — DELETE /vpisi/:predmetId', async () => {
    let captured: Request | null = null
    server.use(
      http.delete(`${API}/vpisi/mod-5`, ({ request }) => {
        captured = request
        return new HttpResponse(null, { status: 204 })
      })
    )
    await odjavaIzModula(TOKEN, 'mod-5')
    expect(captured?.method).toBe('DELETE')
    expect(captured?.url).toContain('/vpisi/mod-5')
  })

  // ── getStilMix ──────────────────────────────────────────────────────────────
  it('getStilMix — GET /vpisi/ucitelj/stilMix', async () => {
    const cap = captureRequest('get', '/vpisi/ucitelj/stilMix')
    await getStilMix(TOKEN)
    expect(cap.get()?.url).toBe(`${API}/vpisi/ucitelj/stilMix`)
  })

  // ── getTopStudents ──────────────────────────────────────────────────────────
  it('getTopStudents — GET /kvizi/ucitelj/topStudents', async () => {
    const cap = captureRequest('get', '/kvizi/ucitelj/topStudents')
    await getTopStudents(TOKEN)
    expect(cap.get()?.url).toBe(`${API}/kvizi/ucitelj/topStudents`)
  })

  // ── getKviziUcitelja ────────────────────────────────────────────────────────
  it('getKviziUcitelja — GET /kvizi/ucitelj/vsi', async () => {
    const cap = captureRequest('get', '/kvizi/ucitelj/vsi')
    await getKviziUcitelja(TOKEN)
    expect(cap.get()?.url).toBe(`${API}/kvizi/ucitelj/vsi`)
    expect(cap.get()?.headers.get('Authorization')).toBe(`Bearer ${TOKEN}`)
  })
})
