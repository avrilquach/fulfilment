import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// Define an interface for the expected request body
interface AddBinStockRequest {
  tat_sku: string;
  qty_per_container: number;
  container_rfid: string;
}

export async function POST(req: Request) {
  let connection;

  try {
    // Parse the JSON body
    const body: AddBinStockRequest = await req.json();

    // Destructure properties and validate input
    const { tat_sku, qty_per_container, container_rfid } = body;
    if (!tat_sku || !qty_per_container || !container_rfid) {
      return NextResponse.json(
        { message: 'TAT SKU, quantity per container, and Container RFID are required.' },
        { status: 400 }
      );
    }

    // Establish database connection
    connection = await getConnection();

    // Check if container_rfid already exists in bin_stock_management
    const [existingContainer] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM bin_stock_management WHERE container_rfid = ?',
      [container_rfid]
    );

    if (existingContainer.length > 0) {
      return NextResponse.json(
        { message: `Container RFID ${container_rfid} already exists` },
        { status: 409 }
      );
    }

    // Insert into bin_stock_management
    const insertBinStockQuery = `
      INSERT INTO bin_stock_management (tat_sku, qty_per_container, container_rfid)
      VALUES (?, ?, ?)
    `;
    const [result] = await connection.execute<ResultSetHeader>(insertBinStockQuery, [
      tat_sku, qty_per_container, container_rfid,
    ]);

    if (result.insertId) {
      // Insert into spend_tracker if the above insertion was successful
      const spendTrackerQuery = `
        INSERT INTO spend_tracker (sku, rfid, qty, status, time)
        VALUES (?, ?, ?, ?, NOW())
      `;
      await connection.execute(spendTrackerQuery, [
        tat_sku, container_rfid, qty_per_container, 'Full',
      ]);

      // Update container_management to set status = 'Full' for the specified container_rfid
      const updateContainerStatusQuery = `
        UPDATE container_management
        SET status = 'Full'
        WHERE container_id = ?
      `;
      await connection.execute(updateContainerStatusQuery, [container_rfid]);

      return NextResponse.json(
        { message: 'Data added successfully', id: result.insertId },
        { status: 201 }
      );
    } else {
      return NextResponse.json({ message: 'Failed to add data' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  } finally {
    // Ensure connection is closed
    if (connection) await connection.end();
  }
}
