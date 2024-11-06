import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT l.name AS location_name,COUNT(DISTINCT cm.shelve_id) AS shelver_count,COUNT(CASE WHEN cm.status = "Empty" THEN 1 END) AS empty_count,COUNT(CASE WHEN cm.status = "Full" THEN 1 END) AS full_count,COUNT(CASE WHEN cm.status = "Inactive" THEN 1 END) AS inactive_count,GROUP_CONCAT(CASE WHEN cm.status = "Full" THEN bsm.tat_sku END) AS full_tat_skus,GROUP_CONCAT(CASE WHEN cm.status = "Full" THEN im.min_stock END) AS min_stocks,(COUNT(CASE WHEN cm.status = "Empty" THEN 1 END) + COUNT(CASE WHEN cm.status = "Full" THEN 1 END)) AS total_empty_full_count FROM location l LEFT JOIN container_management cm ON cm.location_id = l.id LEFT JOIN bin_stock_management bsm ON bsm.container_rfid = cm.container_id AND cm.status = "Full" LEFT JOIN items_management im ON im.supplier_sku = bsm.tat_sku GROUP BY l.id, l.name');
    const response = NextResponse.json({ message: 'Message successful' ,rows}, { status: 200 });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
