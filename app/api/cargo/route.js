export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

function errorResponse(message, status = 500, fields = undefined) {
  return NextResponse.json({ message, fields }, { status })
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

function normalizeDecimalText(value) {
  return typeof value === 'string' ? value.trim().replace(',', '.') : value
}

const digitsOnlyPattern = /^\d+$/
const decimalNumberPattern = /^\d+([.,]\d+)?$/
const lettersOnlyPattern = /^[A-Za-z ]+$/

function parseRequiredNumber(value, fieldLabel, { min = 0 } = {}) {
  const normalizedValue = normalizeDecimalText(value)
  const number = Number(normalizedValue)

  if (!Number.isFinite(number)) {
    return { error: `${fieldLabel} harus berupa angka.` }
  }

  if (number < min) {
    return { error: `${fieldLabel} minimal ${min}.` }
  }

  return { value: number }
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime())
}

function validateCargoPayload(payload, mode) {
  if (!payload || typeof payload !== 'object') {
    return { error: 'Format data cargo tidak valid. Kirim data dalam bentuk JSON.' }
  }

  const rawItemWeight = cleanText(String(payload.itemWeight ?? ''))
  const rawShippingPrice = cleanText(String(payload.shippingPrice ?? ''))
  const itemWeight = parseRequiredNumber(rawItemWeight, 'Berat barang', { min: 0.1 })
  const shippingPrice = parseRequiredNumber(rawShippingPrice, 'Harga pengiriman', { min: 0 })
  const values = {
    id: cleanText(payload.id),
    resi: cleanText(payload.resi),
    shippingDate: cleanText(payload.shippingDate),
    senderName: cleanText(payload.senderName),
    receiverName: cleanText(payload.receiverName),
    phoneNumber: cleanText(payload.phoneNumber),
    originCity: cleanText(payload.originCity),
    destinationCity: cleanText(payload.destinationCity),
    itemType: cleanText(payload.itemType),
    itemName: cleanText(payload.itemName),
    itemWeight: itemWeight.value,
    shippingPrice: shippingPrice.value,
    vehicleType: cleanText(payload.vehicleType),
    shippingType: cleanText(payload.shippingType),
    deliveryStatus: cleanText(payload.deliveryStatus),
    itemStatus: cleanText(payload.itemStatus),
    transactionStatus: cleanText(payload.transactionStatus),
    description: cleanText(payload.description),
  }

  const requiredFields = [
    ['id', 'ID cargo'],
    ['resi', 'Nomor resi'],
    ['shippingDate', 'Tanggal pengiriman'],
    ['senderName', 'Nama pengirim'],
    ['receiverName', 'Nama penerima'],
    ['phoneNumber', 'Nomor telepon'],
    ['originCity', 'Kota asal'],
    ['destinationCity', 'Kota tujuan'],
    ['itemType', 'Jenis barang'],
    ['itemName', 'Nama barang'],
    ['vehicleType', 'Jenis kendaraan'],
    ['shippingType', 'Tipe pengiriman'],
    ['deliveryStatus', 'Status pengiriman'],
    ['itemStatus', 'Status barang'],
    ['transactionStatus', 'Status transaksi'],
  ]
  const missingFields = requiredFields.filter(([field]) => !values[field]).map(([, label]) => label)

  if (missingFields.length > 0) {
    return { error: `Form tidak lengkap. Lengkapi: ${missingFields.join(', ')}.` }
  }

  if (!isValidDate(values.shippingDate)) {
    return { error: 'Tanggal pengiriman tidak valid. Gunakan format tanggal yang benar.' }
  }

  const letterFields = [
    ['senderName', 'Nama pengirim'],
    ['receiverName', 'Nama penerima'],
    ['originCity', 'Kota asal'],
    ['destinationCity', 'Kota tujuan'],
    ['itemType', 'Jenis barang'],
    ['itemName', 'Nama barang'],
    ['vehicleType', 'Jenis kendaraan'],
  ]
  const invalidLetterField = letterFields.find(([field]) => !lettersOnlyPattern.test(values[field]))

  if (invalidLetterField) {
    return { error: `${invalidLetterField[1]} hanya boleh berisi huruf dan spasi.` }
  }

  if (values.senderName.toLowerCase() === values.receiverName.toLowerCase()) {
    return { error: 'Nama pengirim dan nama penerima tidak boleh sama.' }
  }

  if (!digitsOnlyPattern.test(values.phoneNumber)) {
    return { error: 'Nomor telepon hanya boleh berisi angka.' }
  }

  if (!values.phoneNumber.startsWith('08') || values.phoneNumber.length < 10 || values.phoneNumber.length > 13) {
    return { error: 'Nomor telepon harus diawali dengan \'08\' dan terdiri dari 10 hingga 13 digit.' }
  }

  if (values.originCity.toLowerCase() === values.destinationCity.toLowerCase()) {
    return { error: 'Kota asal dan kota tujuan tidak boleh sama.' }
  }

  if (!decimalNumberPattern.test(rawItemWeight)) {
    return { error: 'Berat barang hanya boleh berisi angka. Gunakan koma atau titik untuk desimal.' }
  }

  if (itemWeight.error) {
    return { error: itemWeight.error }
  }

  if (!Number.isFinite(itemWeight.value) || itemWeight.value <= 0) {
    return { error: 'Berat barang harus berupa angka yang valid dan lebih dari 0.' }
  }

  if (!digitsOnlyPattern.test(rawShippingPrice)) {
    return { error: 'Harga pengiriman hanya boleh berisi angka.' }
  }

  if (shippingPrice.error) {
    return { error: shippingPrice.error }
  }

  if (!Number.isFinite(shippingPrice.value) || shippingPrice.value <= 0) {
    return { error: 'Harga pengiriman harus berupa angka yang valid dan lebih besar dari 0.' }
  }

  if (mode === 'edit' && !values.id) {
    return { error: 'ID cargo wajib dikirim saat memperbarui data.' }
  }

  return { values }
}

function databaseErrorResponse(error, fallbackMessage) {
  if (error.code === '23505') {
    return errorResponse('Data dengan ID atau nomor resi tersebut sudah ada.', 409)
  }

  if (error.code === '22P02') {
    return errorResponse('Tipe data tidak sesuai dengan format database.', 400)
  }

  return errorResponse(fallbackMessage, 500)
}

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
         LOWER(sender_name) LIKE $1 OR 
         LOWER(receiver_name) LIKE $1 OR 
         LOWER(item_name) LIKE $1
         ORDER BY id DESC`,
        [q]
      )
    } else {
      result = await pool.query('SELECT * FROM cargo ORDER BY id DESC')
    }
    
    const items = result.rows.map(row => ({
      id: row.id,
      resi: row.resi,
      shippingDate: row.shipping_date ?? row.shipment_date ?? row.shippingDate,
      senderName: row.sender_name ?? row.senderName,
      receiverName: row.receiver_name ?? row.receiverName,
      phoneNumber: row.phone_number ?? row.phoneNumber,
      originCity: row.origin_city ?? row.originCity,
      destinationCity: row.destination_city ?? row.destinationCity,
      itemType: row.item_type ?? row.itemType,
      itemName: row.item_name ?? row.itemName,
      itemWeight: row.item_weight ?? row.itemWeight ? Number(row.item_weight ?? row.itemWeight) : null,
      shippingPrice: row.shipping_price ?? row.shippingPrice ? Number(row.shipping_price ?? row.shippingPrice) : 0,
      vehicleType: row.vehicle_type ?? row.vehicleType,
      shippingType: row.shipping_type ?? row.shippingType,
      deliveryStatus: row.delivery_status ?? row.deliveryStatus,
      itemStatus: row.item_status ?? row.itemStatus,
      transactionStatus: row.transaction_status ?? row.transactionStatus,
      description: row.description ?? row.item_description
    }));

    return NextResponse.json({ items })
  } catch (error) {
    return errorResponse(`Gagal mengambil data cargo: ${error.message || error}`, 500)
  }
}

export async function POST(request) {
  try {
    const payload = await readJsonBody(request)
    const validation = validateCargoPayload(payload, 'add')

    if (validation.error) {
      return errorResponse(validation.error, 400)
    }

    const { 
      id, resi, shippingDate, senderName, receiverName, phoneNumber, 
      originCity, destinationCity, itemType, itemName, itemWeight, 
      shippingPrice, vehicleType, shippingType, deliveryStatus, 
      itemStatus, transactionStatus, description 
    } = validation.values

    await pool.query(
      `INSERT INTO cargo (
        id, resi, shipment_date, sender_name, receiver_name, phone_number,
        origin_city, destination_city, item_type, item_name, item_weight,
        shipping_price, vehicle_type, shipping_type, delivery_status,
        item_status, transaction_status, item_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        id, resi, shippingDate || null, senderName, receiverName, phoneNumber,
        originCity, destinationCity, itemType, itemName, itemWeight || null,
        shippingPrice, vehicleType, shippingType, deliveryStatus,
        itemStatus, transactionStatus, description
      ]
    )

    return NextResponse.json({ item: validation.values }, { status: 201 })
  } catch (error) {
    return databaseErrorResponse(error, 'Gagal menambahkan data cargo.')
  }
}

export async function PUT(request) {
  try {
    const payload = await readJsonBody(request)
    const validation = validateCargoPayload(payload, 'edit')

    if (validation.error) {
      return errorResponse(validation.error, 400)
    }

    const { 
      id, resi, shippingDate, senderName, receiverName, phoneNumber, 
      originCity, destinationCity, itemType, itemName, itemWeight, 
      shippingPrice, vehicleType, shippingType, deliveryStatus, 
      itemStatus, transactionStatus, description 
    } = validation.values

    const result = await pool.query(
      `UPDATE cargo SET
        resi = $2, shipment_date = $3, sender_name = $4, receiver_name = $5, 
        phone_number = $6, origin_city = $7, destination_city = $8, 
        item_type = $9, item_name = $10, item_weight = $11, 
        shipping_price = $12, vehicle_type = $13, shipping_type = $14, 
        delivery_status = $15, item_status = $16, transaction_status = $17, 
        item_description = $18
       WHERE id = $1 RETURNING *`,
      [
        id, resi, shippingDate || null, senderName, receiverName, phoneNumber,
        originCity, destinationCity, itemType, itemName, itemWeight || null,
        shippingPrice, vehicleType, shippingType, deliveryStatus,
        itemStatus, transactionStatus, description
      ]
    )

    if (result.rowCount === 0) {
      return errorResponse('Data cargo tidak ditemukan.', 404)
    }

    return NextResponse.json({ item: validation.values })
  } catch (error) {
    return databaseErrorResponse(error, 'Gagal memperbarui data cargo.')
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return errorResponse('ID cargo wajib dikirim.', 400)
  }

  try {
    const result = await pool.query('DELETE FROM cargo WHERE id = $1', [id])
    if (result.rowCount === 0) {
      return errorResponse('Data cargo tidak ditemukan.', 404)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return errorResponse('Gagal menghapus data cargo dari database.', 500)
  }
}
