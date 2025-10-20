/**
 * Middleware de manejo de errores global
 */
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error no manejado:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && {
            error: err.message,
            stack: err.stack
        })
    });
};

/**
 * Middleware para rutas no encontradas
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};
