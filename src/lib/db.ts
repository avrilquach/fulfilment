import mysql, { Connection } from 'mysql2/promise';

// Cấu hình kết nối MySQL với kiểu dữ liệu
const connectionConfig = {
  host: process.env.MYSQL_HOST as string,
  user: process.env.MYSQL_USER as string,
  password: process.env.MYSQL_PASSWORD as string,
  database: process.env.MYSQL_DATABASE as string,
  waitForConnections: true,
  connectionLimit: 10,  // Adjust based on expected load
  queueLimit: 0,
};

// Hàm để tạo kết nối MySQL với kiểu trả về là `Promise<Connection>`
export async function getConnection(): Promise<Connection> {
  const connection: Connection = await mysql.createConnection(connectionConfig);
  return connection;
}

