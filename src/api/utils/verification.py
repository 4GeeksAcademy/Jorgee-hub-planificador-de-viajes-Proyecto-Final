# src/back/utils/verification.py
from flask_jwt_extended import create_access_token, decode_token
from flask import current_app
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


def generar_token_verificacion(email):

    try:
        # 📝 Crear un token JWT con el email
        #    ⏰ Expira en 1 hora (3600 segundos)
        token = create_access_token(
            identity=email,
            expires_delta=timedelta(hours=1),  # 1 hora de validez
            additional_claims={
                "type": "email_verification" 
            }
        )
        logger.info(f"✅ Token JWT generado para: {email}")
        return token
        
    except Exception as e:
        logger.error(f"❌ Error generando token JWT: {str(e)}")
        return None


def verificar_token(token):
    try:
        # 📝 Decodificar el token JWT
        claims = decode_token(token)
        
        # 📝 Verificar que sea para verificación de email
        if claims.get("type") != "email_verification":
            logger.warning(f"❌ Token no es de verificación de email")
            return None
        
        # ✅ Devuelve el email (identity)
        email = claims.get("sub")
        logger.info(f"✅ Token JWT válido para: {email}")
        return email
        
    except Exception as e:
        logger.warning(f"❌ Token JWT inválido o expirado: {str(e)}")
        return None