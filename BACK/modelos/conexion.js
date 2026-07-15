import 'dotenv/config'; 
import pg from 'pg';

const { Pool } = pg;

// Configuración del pool utilizando las variables de entorno
export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  // Opcional: configuraciones de optimización
  max: 10, // Máximo número de clientes en el pool
  idleTimeoutMillis: 30000, // Tiempo antes de cerrar una conexión inactiva
  connectionTimeoutMillis: 2000, // Tiempo máximo para intentar conectar
});

// Opcional: Verificar que la conexión inicial sea exitosa
