import mysql from "mysql2/promise";
import { env } from "$env/dynamic/private";

const pool = mysql.createPool({
  host: env.DB_HOST || "127.0.0.1",
  user: env.DB_USER || "crc_user",
  password: env.DB_PASSWORD || "crc_password",
  database: env.DB_NAME || "crc_cards",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
  socketPath: undefined,
});

export default pool;
