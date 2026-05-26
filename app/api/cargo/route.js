import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') ?? ''
  
  try {
    let result;
    if (query) {
      const q = `%${query.toLowerCase()}%`;
      result = await pool.query(
        `SELECT * FROM cargo WHERE 
         LOWER(resi) LIKE $1 OR 
         LOWER("senderName") LIKE $1 OR 
         LOWER("receiverName") LIKE $1 OR 
         LOWER("itemName") LIKE $1
         ORDER BY id DESC`,
        [q]
      )
    } else {
      result = await pool.query('SELECT * FROM cargo ORDER BY id DESC')
    }
    
    // In PostgreSQL, numeric fields are returned as strings. We map shippingPrice to number.
    const items = result.rows.map(row => ({
      ...row,
      shippingPrice: row.shippingPrice ? Number(row.shippingPrice) : 0,
      itemWeight: row.itemWeight ? Number(row.itemWeight) : null
    }));

    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const payload = await request.json()
    const { 
      id, resi, shippingDate, senderName, receiverName, phoneNumber, 
      originCity, destinationCity, itemType, itemName, itemWeight, 
      shippingPrice, vehicleType, shippingType, deliveryStatus, 
      itemStatus, transactionStatus, description 
    } = payload

    await pool.query(
      `INSERT INTO cargo (
        id, resi, "shippingDate", "senderName", "receiverName", "phoneNumber",
        "originCity", "destinationCity", "itemType", "itemName", "itemWeight",
        "shippingPrice", "vehicleType", "shippingType", "deliveryStatus",
        "itemStatus", "transactionStatus", description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        id, resi, shippingDate || null, senderName, receiverName, phoneNumber,
        originCity, destinationCity, itemType, itemName, itemWeight || null,
        shippingPrice, vehicleType, shippingType, deliveryStatus,
        itemStatus, transactionStatus, description
      ]
    )

    return NextResponse.json({ item: payload }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menambahkan data cargo.', error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const payload = await request.json()
    const { 
      id, resi, shippingDate, senderName, receiverName, phoneNumber, 
      originCity, destinationCity, itemType, itemName, itemWeight, 
      shippingPrice, vehicleType, shippingType, deliveryStatus, 
      itemStatus, transactionStatus, description 
    } = payload

    const result = await pool.query(
      `UPDATE cargo SET
        resi = $2, "shippingDate" = $3, "senderName" = $4, "receiverName" = $5, 
        "phoneNumber" = $6, "originCity" = $7, "destinationCity" = $8, 
        "itemType" = $9, "itemName" = $10, "itemWeight" = $11, 
        "shippingPrice" = $12, "vehicleType" = $13, "shippingType" = $14, 
        "deliveryStatus" = $15, "itemStatus" = $16, "transactionStatus" = $17, 
        description = $18
       WHERE id = $1 RETURNING *`,
      [
        id, resi, shippingDate || null, senderName, receiverName, phoneNumber,
        originCity, destinationCity, itemType, itemName, itemWeight || null,
        shippingPrice, vehicleType, shippingType, deliveryStatus,
        itemStatus, transactionStatus, description
      ]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Data cargo tidak ditemukan.' }, { status: 404 })
    }

    const item = result.rows[0]
    item.shippingPrice = item.shippingPrice ? Number(item.shippingPrice) : 0
    item.itemWeight = item.itemWeight ? Number(item.itemWeight) : null

    return NextResponse.json({ item })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui data cargo.', error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ message: 'ID cargo wajib dikirim.' }, { status: 400 })
  }

  try {
    const result = await pool.query('DELETE FROM cargo WHERE id = $1', [id])
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Data cargo tidak ditemukan.' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 })
  }
}
