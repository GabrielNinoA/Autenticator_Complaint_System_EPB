const mysql = require('mysql2/promise');
require('dotenv').config();

class DatabaseConfig {
    constructor() {
        this.pool = null;
        this.config = {
            host: process.env.MYSQL_ADDON_HOST,
            port: parseInt(process.env.MYSQL_ADDON_PORT) || 3306,
            user: process.env.MYSQL_ADDON_USER,
            password: process.env.MYSQL_ADDON_PASSWORD,
            database: process.env.MYSQL_ADDON_DB,
            charset: 'utf8mb4',
            timezone: 'Z',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            ssl: process.env.NODE_ENV === 'production' ? {
                rejectUnauthorized: false
            } : false
        };
    }

    /**
     * Obtiene o crea el pool de conexiones
     */
    getPool() {
        if (!this.pool) {
            this.pool = mysql.createPool(this.config);
        }
        return this.pool;
    }

    /**
     * Ejecuta una consulta SQL
     */
    async query(sql, params = []) {
        try {
            const pool = this.getPool();
            const [results] = await pool.execute(sql, params);
            return results;
        } catch (error) {
            console.error('❌ Error en consulta SQL:', error.message);
            throw error;
        }
    }

    /**
     * Prueba la conexión a la base de datos
     */
    async testConnection() {
        try {
            const pool = this.getPool();
            const connection = await pool.getConnection();
            await connection.ping();
            connection.release();
            console.log('✅ Conexión a base de datos exitosa');
            return true;
        } catch (error) {
            console.error('❌ Error de conexión a base de datos:', error.message);
            return false;
        }
    }

    /**
     * Cierra el pool de conexiones
     */
    async closePool() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log('✅ Pool de conexiones cerrado');
        }
    }
}

module.exports = new DatabaseConfig();
