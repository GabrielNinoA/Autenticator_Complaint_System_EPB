const database = require('../config/database');

class AuthService {
    /**
     * Valida las credenciales del usuario
     */
    async validateCredentials(username, password) {
        try {
            const sql = 'SELECT id, username, islogged FROM users WHERE username = ? AND userpassword = ?';
            const results = await database.query(sql, [username, password]);
            
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('❌ Error validando credenciales:', error.message);
            throw error;
        }
    }

    /**
     * Actualiza el estado de login del usuario
     */
    async updateLoginStatus(username, isLogged) {
        try {
            const sql = 'UPDATE users SET islogged = ? WHERE username = ?';
            const result = await database.query(sql, [isLogged, username]);
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('❌ Error actualizando estado de login:', error.message);
            throw error;
        }
    }

    /**
     * Verifica si un usuario está logueado
     */
    async isUserLogged(username) {
        try {
            const sql = 'SELECT username, islogged FROM users WHERE username = ?';
            const results = await database.query(sql, [username]);
            
            if (results.length === 0) {
                return { exists: false, isLogged: false };
            }
            
            return {
                exists: true,
                isLogged: results[0].islogged === 1,
                username: results[0].username
            };
        } catch (error) {
            console.error('❌ Error verificando estado de usuario:', error.message);
            throw error;
        }
    }

    /**
     * Realiza el login completo (valida y actualiza estado)
     */
    async login(username, password) {
        try {
            // Validar credenciales
            const user = await this.validateCredentials(username, password);
            
            if (!user) {
                return {
                    success: false,
                    message: 'Credenciales inválidas'
                };
            }

            // Actualizar estado a logueado
            const updated = await this.updateLoginStatus(username, true);
            
            if (!updated) {
                return {
                    success: false,
                    message: 'Error actualizando estado de sesión'
                };
            }

            return {
                success: true,
                username: user.username,
                message: 'Login exitoso'
            };
        } catch (error) {
            console.error('❌ Error en login:', error.message);
            throw error;
        }
    }

    /**
     * Realiza el logout (actualiza estado)
     */
    async logout(username) {
        try {
            // Verificar que el usuario existe
            const userStatus = await this.isUserLogged(username);
            
            if (!userStatus.exists) {
                return {
                    success: false,
                    message: 'Usuario no encontrado'
                };
            }

            // Actualizar estado a deslogueado
            const updated = await this.updateLoginStatus(username, false);
            
            if (!updated) {
                return {
                    success: false,
                    message: 'Error actualizando estado de sesión'
                };
            }

            return {
                success: true,
                message: 'Logout exitoso'
            };
        } catch (error) {
            console.error('❌ Error en logout:', error.message);
            throw error;
        }
    }
}

module.exports = new AuthService();
