"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Trip
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (create_access_token, JWTManager, jwt_required, get_jwt_identity)
from datetime import date
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.json
    existing_user_email = User.query.filter_by(email=data["email"]).first()
    if existing_user_email:
        return jsonify({"error": "El email ya está registrado"}), 409
    existing_user_name = User.query.filter_by(username=data["username"]).first()
    if existing_user_name:
        return jsonify({"error": "El nombre de usuario ya está registrado"}), 409
        

    new_user = User(
        username=data["username"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
        first_name=data.get("first_name"),
        last_name=data.get("last_name")
        
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Usuario creado exitosamente"}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.json
    existing_user = User.query.filter_by(email=data["email"]).first()
    if not existing_user:
        return jsonify({"error": "Credenciales inválidas"}), 401
    if not check_password_hash(existing_user.password_hash, data["password"]):
        return jsonify({"error": "Credenciales inválidas"}), 401
    access_token = create_access_token(identity=str(existing_user.id))
    return jsonify({"token": access_token, "user": existing_user.serialize()}), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@api.route('/trips', methods=['POST'])#Crear trip
@jwt_required()
def create_trip():
    data = request.json
    current_user_id = get_jwt_identity()
    
    new_trip = Trip(
        name= data["name"],
        start_date= data["start_date"],
        end_date= data["end_date"],
        user_id= current_user_id
    )
    db.session.add(new_trip)
    db.session.commit()
    return jsonify(new_trip.serialize()), 201

@api.route('/trips', methods=['GET']) # Listar todos los trips
@jwt_required()
def get_trips():
    current_user_id = get_jwt_identity()
    existing_user_trips = Trip.query.filter_by(user_id=current_user_id).all()
    trips_serialized =[trip.serialize() for trip in existing_user_trips]
    return jsonify(trips_serialized), 200

@api.route('/trips/<int:trip_id>', methods=['GET']) #Listar un solo trip
@jwt_required()
def get_trip(trip_id):
        trip = Trip.query.get(trip_id)
        if not trip:
            return jsonify ({"error": "Viaje no encontrado"}), 404
        
        current_user_id = get_jwt_identity()
        if str(trip.user_id) != current_user_id:
            return jsonify ({"error": "No tienes permisos sobre este viaje"}), 403
        return jsonify(trip.serialize()), 200
        
@api.route('/trips/<int:trip_id>', methods=['PUT']) #Actualizar un trip
@jwt_required()
def update_trip(trip_id):
    data = request.json
    trip = Trip.query.get(trip_id)
    if not trip:
        return jsonify ({"error": "Viaje no encontrado"}), 404
    
    current_user_id = get_jwt_identity()
    if str(trip.user_id) != current_user_id:
        return jsonify ({"error": "No tienes permisos sobre este viaje"}), 403
    
    trip.name = data.get("name", trip.name)
    trip.start_date = date.fromisoformat(data["start_date"]) if data.get("start_date") else trip.start_date
    trip.end_date = date.fromisoformat(data["end_date"]) if data.get("end_date") else trip.end_date

    db.session.commit()
    return jsonify(trip.serialize()), 200

@api.route('/trips/<int:trip_id>', methods=['DELETE']) #Borrar un trip
@jwt_required()
def delete_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return jsonify({"error": "Viaje no encontrado"}), 404
    current_user_id = get_jwt_identity()
    if str(trip.user_id) != current_user_id:
        return jsonify ({"error": "No tienes permisos sobre este viaje"}), 403
    trip_name = trip.name
    db.session.delete(trip)
    db.session.commit()
    return jsonify({"message": f"Viaje '{trip_name}' eliminado correctamente"}), 200