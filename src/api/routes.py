"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.json
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "El email ya está registrado"}), 409

    new_user = User(
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
        first_name=data.get("first_name"),
        last_name=data.get("last_name")
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Usuario creado exitosamente"}), 201
