import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY id DESC')
    return NextResponse.json({ items: result.rows })
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const payload = await request.json()
    const { id, name, type, code, capacity, status } = payload

    await pool.query(
      `INSERT INTO vehicles (id, name, type, code, capacity, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, name, type, code, capacity, status]
    )

    return NextResponse.json({ item: payload }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menambahkan data kendaraan.', error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const payload = await request.json()
    const { id, name, type, code, capacity, status } = payload

    const result = await pool.query(
      `UPDATE vehicles SET
        name = $2, type = $3, code = $4, capacity = $5, status = $6
       WHERE id = $1 RETURNING *`,
      [id, name, type, code, capacity, status]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Data kendaraan tidak ditemukan.' }, { status: 404 })
    }

    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui data kendaraan.', error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ message: 'ID kendaraan wajib dikirim.' }, { status: 400 })
  }

  try {
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1', [id])
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Data kendaraan tidak ditemukan.' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 })
  }
}
