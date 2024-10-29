import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const {
    id,
    cm_part_id,
    status,
    fill_date,
    zone_id,
    shelve_id,
    bin_id,
    container_rfid, // Include container_rfid in the request body
  } = await req.json();

  // Check if the required field 'id' is provided
  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  try {
    const connection = await getConnection();

    // SQL query to update the existing record
    const query = `
      UPDATE parts_list
      SET
        ${cm_part_id ? 'cm_part_id = ?,' : ''}
        ${status ? 'status = ?,' : ''}
        ${fill_date ? 'fill_date = ?,' : ''}
        ${zone_id ? 'zone_id = ?,' : ''}
        ${shelve_id ? 'shelve_id = ?,' : ''}
        ${bin_id ? 'bin_id = ?,' : ''}
        ${container_rfid ? 'container_rfid = ?,' : ''} -- Include container_rfid in the update
        updated_at = NOW()  -- Assuming you want to track when the record was last updated
      WHERE id = ?
    `;

    // Collect the parameters for the query
    const params = [
      ...(cm_part_id ? [cm_part_id] : []),
      ...(status ? [status] : []),
      ...(fill_date ? [fill_date] : []),
      ...(zone_id ? [zone_id] : []),
      ...(shelve_id ? [shelve_id] : []),
      ...(bin_id ? [bin_id] : []),
      ...(container_rfid ? [container_rfid] : []), // Include container_rfid in parameters
      id
    ].filter(Boolean); // Remove any undefined values

    // Execute the query with the provided values
    const [result] = await connection.execute(query, params);

    // Check if the update was successful
    if (result.affectedRows > 0) {
      if(bin_id){
        const queryUpdate = `
              UPDATE bin
              SET
                status = 1
              WHERE id = ${bin_id}
            `;
        const [update] = await connection.execute(queryUpdate);
      }
      return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No data found or failed to update' }, { status: 404 });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
