import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export async function POST(req: Request) {
  // Extract specific fields from the JSON payload
  const { id, status, container_rfid } = await req.json();

  // Validate required fields
  if (!id || !status || !container_rfid) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  let connection;
  try {
    connection = await getConnection();

    // Query to select from bin_stock_management based on container_rfid
    const binStockQuery = `
      SELECT * FROM bin_stock_management
      WHERE container_rfid = ?
    `;
    const [binStockData] = await connection.execute<RowDataPacket[]>(binStockQuery, [container_rfid]);

    // Check if any rows were returned
    if (binStockData.length === 0) {
      return NextResponse.json({ message: 'No matching bin stock found' }, { status: 404 });
    }

    // Extract the necessary data from binStockData (assuming only one record is returned)
    const binStock = binStockData[0]; // You can adjust this based on your needs
    const tat_sku = binStock.tat_sku;  // Assuming SKU is stored in the bin_stock_management table
    const qty_per_container = binStock.qty_per_container;  // Assuming qty is stored in the bin_stock_management table

    // Update the container_management table status
    const updateQuery = `
      UPDATE container_management
      SET status = ?, fill_date = NOW()
      WHERE id = ?
    `;
    const [result] = await connection.execute<ResultSetHeader>(updateQuery, [status, id]);

    if (result.affectedRows > 0) {
      // Insert into spend_tracker if the update was successful
      const spendTrackerQuery = `
        INSERT INTO spend_tracker (sku, rfid, qty, status, time)
        VALUES (?, ?, ?, ?, NOW())
      `;
      await connection.execute(spendTrackerQuery, [
        tat_sku,
        container_rfid,
        qty_per_container,
        status
      ]);

      return NextResponse.json({ message: 'Data updated and logged successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No data found to update' }, { status: 404 });
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end(); // Always close the connection to avoid leaks
    }
  }
}
