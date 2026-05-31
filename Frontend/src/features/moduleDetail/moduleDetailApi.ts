const API = import.meta.env.VITE_API_URL

export async function getModul(id: string) {
    const res = await fetch(`${API}/moduli/${id}`)
    if (!res.ok) throw new Error('Failed to fetch module.')
    return res.json()
}

export async function getModuleContent(id: string) {
    const res = await fetch(`${API}/moduli/${id}/vsebina`)

    if (!res.ok) {
        throw new Error("Failed to fetch module content.")
    }

    return res.json()
}
