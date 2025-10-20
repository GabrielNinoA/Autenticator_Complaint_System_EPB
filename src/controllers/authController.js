const authService = require('../services/authService');

class AuthController {
    /**
     * Envía una respuesta exitosa estandarizada
     */
    sendSuccessResponse(res, data, message = null) {
        const response = {
            success: true,
            ...data,
            timestamp: new Date().toISOString()
        };
        
        if (message) {
            response.message = message;
        }
        
        return res.json(response);
    }

    /**
     * Envía una respuesta de error estandarizada
     */
    sendErrorResponse(res, statusCode, message, error = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (error && process.env.NODE_ENV === 'development') {
            response.error = error.message;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Valida que los campos requeridos existan
     */
    validateRequiredFields(fields, data) {
        const missing = fields.filter(field => !data[field]);
        return {
            isValid: missing.length === 0,
            missing
        };
    }

    /**
     * POST /auth/login
     * Inicia sesión de un usuario
     */
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Validar campos requeridos
            const validation = this.validateRequiredFields(['username', 'password'], req.body);
            if (!validation.isValid) {
                return this.sendErrorResponse(
                    res,
                    400,
                    `Campos requeridos faltantes: ${validation.missing.join(', ')}`
                );
            }

            // Validar longitud mínima
            if (username.trim().length < 3) {
                return this.sendErrorResponse(res, 400, 'El username debe tener al menos 3 caracteres');
            }

            if (password.length < 4) {
                return this.sendErrorResponse(res, 400, 'La contraseña debe tener al menos 4 caracteres');
            }

            // Realizar login
            const result = await authService.login(username.trim(), password);

            if (!result.success) {
                return this.sendErrorResponse(res, 401, result.message);
            }

            return this.sendSuccessResponse(res, {
                username: result.username
            }, result.message);

        } catch (error) {
            console.error('❌ Error en login controller:', error.message);
            return this.sendErrorResponse(res, 500, 'Error interno del servidor', error);
        }
    }

    /**
     * POST /auth/logout
     * Cierra sesión de un usuario
     */
    async logout(req, res) {
        try {
            const { username } = req.body;

            // Validar campo requerido
            if (!username) {
                return this.sendErrorResponse(res, 400, 'El campo username es requerido');
            }

            // Realizar logout
            const result = await authService.logout(username.trim());

            if (!result.success) {
                return this.sendErrorResponse(res, 404, result.message);
            }

            return this.sendSuccessResponse(res, {}, result.message);

        } catch (error) {
            console.error('❌ Error en logout controller:', error.message);
            return this.sendErrorResponse(res, 500, 'Error interno del servidor', error);
        }
    }

    /**
     * GET /auth/verify/:username
     * Verifica si un usuario está logueado
     */
    async verifyUser(req, res) {
        try {
            const { username } = req.params;

            // Validar parámetro
            if (!username || username.trim().length < 3) {
                return this.sendErrorResponse(res, 400, 'Username inválido');
            }

            // Verificar estado del usuario
            const userStatus = await authService.isUserLogged(username.trim());

            if (!userStatus.exists) {
                return this.sendErrorResponse(res, 404, 'Usuario no encontrado');
            }

            return this.sendSuccessResponse(res, {
                isLogged: userStatus.isLogged,
                username: userStatus.username
            });

        } catch (error) {
            console.error('❌ Error en verify controller:', error.message);
            return this.sendErrorResponse(res, 500, 'Error interno del servidor', error);
        }
    }
}

module.exports = new AuthController();
