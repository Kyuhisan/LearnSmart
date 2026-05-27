const API = import.meta.env.VITE_API_URL

export async function getModuleContent(id: string) {
    const res = await fetch(`${API}/moduli/${id}/vsebina`)

    if (!res.ok) {
        throw new Error("Failed to fetch module content.")
    }

    return res.json()
}

export async function getVisualContent(predmetId: string) {
    const res = await fetch(`${API}/content/predmet/${predmetId}/visual`)

    if (!res.ok) {
        throw new Error("Failed to fetch visual content.")
    }

    return res.json()
}