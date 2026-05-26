import { promises as fs } from 'fs'
import path from 'path'

const databasePath = path.join(process.cwd(), 'data', 'adminDb.json')

const defaultDatabase = {
  cargo: [],
  vehicles: [],
}

export const cargoSearchFields = ['resi', 'senderName', 'receiverName', 'itemName']

export async function readAdminDb() {
  try {
    const content = await fs.readFile(databasePath, 'utf8')
    const parsed = JSON.parse(content)

    return {
      cargo: Array.isArray(parsed.cargo) ? parsed.cargo : defaultDatabase.cargo,
      vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : defaultDatabase.vehicles,
    }
  } catch {
    await writeAdminDb(defaultDatabase)
    return defaultDatabase
  }
}

export async function writeAdminDb(nextData) {
  await fs.mkdir(path.dirname(databasePath), { recursive: true })
  await fs.writeFile(databasePath, JSON.stringify(nextData, null, 2), 'utf8')
}

export function filterCargo(items, query) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return items
  }

  return items.filter((item) =>
    cargoSearchFields.some((field) => String(item[field] ?? '').toLowerCase().includes(normalizedQuery))
  )
}
