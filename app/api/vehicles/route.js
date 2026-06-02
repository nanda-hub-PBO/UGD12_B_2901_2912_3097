export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

function errorResponse(message, status = 500) {
  return NextResponse.json({ message }, { status })
}

async function readJsonBody(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

const vehicleCodePattern = /^(?=.*[A-Z])(?=.*\d)[A-Z0-9-]+$/
const vehicleCapacityPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9 ]+$/

function validateVehiclePayload(payload, mode) {
  if (!payload || typeof payload !== 'object') {
    return { error: 'Format data kendaraan tidak valid. Kirim data dalam bentuk JSON.' }
  }

  const values = {
    id: cleanText(payload.id),
    name: cleanText(payload.name),
    type: cleanText(payload.type),
    code: cleanText(payload.code).toUpperCase(),
    capacity: cleanText(payload.capacity),
    status: cleanText(payload.status),
  }
  const missingFields = [
    ['name', 'Nama kendaraan'],
    ['type', 'Jenis kendaraan'],
    ['code', 'Kode kendaraan'],
    ['capacity', 'Kapasitas'],
    ['status', 'Status'],
  ].filter(([field]) => !values[field]).map(([, label]) => label)

  if (missingFields.length > 0) {
    return { error: `Form tidak lengkap. Lengkapi: ${missingFields.join(', ')}.` }
  }

  if (!vehicleCodePattern.test(values.code)) {
    return { error: 'Kode kendaraan harus berisi gabungan huruf dan angka. Contoh: VH-003.' }
  }

  if (!vehicleCapacityPattern.test(values.capacity)) {
    return { error: 'Kapasitas muatan harus berisi gabungan angka dan huruf. Contoh: 2 Ton.' }
  }

  if (mode === 'edit') {
    const id = Number.parseInt(values.id, 10)

    if (!Number.isInteger(id) || id <= 0) {
      return { error: 'ID kendaraan harus berupa angka yang valid.' }
    }

    values.id = id
  }

  return { values }
}

function databaseErrorResponse(error, fallbackMessage) {
  if (error.code === '23505') {
    return errorResponse('Data kendaraan dengan kode tersebut sudah ada.', 409)
  }

  if (error.code === '22P02') {
    return errorResponse('Tipe data tidak sesuai dengan format database.', 400)
  }

  return errorResponse(fallbackMessage, 500)
}

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY id DESC')
    const mappedRows = result.rows.map(row => ({
      id: String(row.id),
      name: row.nama,
      type: row.jenis,
      code: row.kode,
      capacity: row.kapasitas,
      status: row.status
    }))
    return NextResponse.json({ items: mappedRows })
  } catch (error) {
    return errorResponse('Gagal mengambil data kendaraan dari database.', 500)
  }
}

export async function POST(request) {
  try {
    const payload = await readJsonBody(request)
    const validation = validateVehiclePayload(payload, 'add')

    if (validation.error) {
      return errorResponse(validation.error, 400)
    }

    const { name, type, code, capacity, status } = validation.values

    const result = await pool.query(
      `INSERT INTO vehicles (nama, jenis, kode, kapasitas, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, type, code, capacity, status]
    )

    return NextResponse.json({ item: { ...validation.values, id: String(result.rows[0].id) } }, { status: 201 })
  } catch (error) {
    return databaseErrorResponse(error, 'Gagal menambahkan data kendaraan.')
  }
}

export async function PUT(request) {
  try {
    const payload = await readJsonBody(request)
    const validation = validateVehiclePayload(payload, 'edit')

    if (validation.error) {
      return errorResponse(validation.error, 400)
    }

    const { id, name, type, code, capacity, status } = validation.values

    const result = await pool.query(
      `UPDATE vehicles SET
        nama = $2, jenis = $3, kode = $4, kapasitas = $5, status = $6
       WHERE id = $1 RETURNING *`,
      [id, name, type, code, capacity, status]
    )

    if (result.rowCount === 0) {
      return errorResponse('Data kendaraan tidak ditemukan.', 404)
    }

    return NextResponse.json({ item: { ...validation.values, id: String(result.rows[0].id) } })
  } catch (error) {
    return databaseErrorResponse(error, 'Gagal memperbarui data kendaraan.')
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return errorResponse('ID kendaraan wajib dikirim.', 400)
  }

  const parsedId = Number.parseInt(id, 10)

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return errorResponse('ID kendaraan harus berupa angka yang valid.', 400)
  }

  try {
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1', [parsedId])
    if (result.rowCount === 0) {
      return errorResponse('Data kendaraan tidak ditemukan.', 404)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return errorResponse('Gagal menghapus data kendaraan dari database.', 500)
  }
}
