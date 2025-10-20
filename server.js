require('dotenv').config();
const express = require('express');
const database = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de peticiones
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Rutas
app.use('/auth', authRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        service: 'Authentication Microservice',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// Middleware de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
    try {
        // Probar conexión a base de datos
        const isConnected = await database.testConnection();
        
        if (!isConnected) {
            console.error('❌ No se pudo conectar a la base de datos. Abortando inicio del servidor.');
            process.exit(1);
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('╔════════════════════════════════════════════════╗');
            console.log('║   🔐 AUTH MICROSERVICE - SISTEMA QUEJAS EPB   ║');
            console.log('╠════════════════════════════════════════════════╣');
            console.log(`║   🚀 Servidor corriendo en puerto: ${PORT}        ║`);
            console.log(`║   🌍 Entorno: ${process.env.NODE_ENV || 'development'}              ║`);
            console.log(`║   📅 Fecha: ${new Date().toLocaleString('es-CO')}    ║`);
            console.log('╚════════════════════════════════════════════════╝');
        });
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error.message);
        process.exit(1);
    }
};

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
    console.log('⚠️  SIGTERM recibido. Cerrando servidor...');
    await database.closePool();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('⚠️  SIGINT recibido. Cerrando servidor...');
    await database.closePool();
    process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;
