"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, session
from api.models import db, User, Beer, Brewery, FavoriteUsers, FavoriteBeers, FavoriteBreweries
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import hashlib

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# User sign up route including authentication to hash passwords
@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    email = body["email"]
    password = hashlib.sha256(body["password"].encode("utf-8")).hexdigest()
    user = User(email = email, password = password, is_active = True)
    db.session.add(user)
    db.session.commit()
    response_body = {
        "message": "User successfully created"
    }

    return jsonify(response_body), 200

# User log in route with password hashing - for active users only
@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    email = body["email"]
    password = hashlib.sha256(body["password"].encode("utf-8")).hexdigest()
    user = User.query.filter_by(email = email).first()
    if user and user.password == password:
        if user.is_active:
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token)
        else:
            return jsonify({"error": "User is not active"}), 403
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# Get the user from the database - active users only
def get_current_user():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if user and user.is_active:
        return user
    return None

# created the get users route including authentication
@api.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200

# Get all beers route
@api.route('/beers', methods=['GET'])
def get_all_beers():
    beers = Beer.query.all()
    return jsonify([beer.serialize() for beer in beers]), 200

# Get all breweries route
@api.route('/breweries', methods=['GET'])
def get_all_breweries():
    breweries = Brewery.query.all()
    return jsonify([brewery.serialize() for brewery in breweries]), 200

# Access user's favorite beers list (with user authentication)
@api.route('/favorite_beers', methods=['GET'])
@jwt_required()
def handle_get_favorite_beers():
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorite_beers = FavoriteBeers.query.filter_by(owner_id=current_user.id).all()
    return jsonify([favorite_beer.serialize() for favorite_beer in favorite_beers]), 200

# Access user's favorite breweries list (with user authentication)
@api.route('/favorite_breweries', methods=['GET'])
@jwt_required()
def handle_get_favorite_breweries():
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorite_breweries = FavoriteBreweries.query.filter_by(owner_id=current_user.id).all()
    return jsonify([favorite_brewery.serialize() for favorite_brewery in favorite_breweries]), 200

# Access user's favorite users list (including authentication piece)
@api.route('/favorite_users', methods=['GET'])
@jwt_required()
def handle_get_favorite_users():
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorite_users = FavoriteUsers.query.filter_by(owner_id=current_user.id).all()
    return jsonify([favorite_user.serialize() for favorite_user in favorite_users]), 200

# Add a favorite beer for the current user with authentication
@api.route('favorite_beers/<int:beer_id>', methods=['POST'])
@jwt_required()
def add_favorite_beer(beer_id):
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    new_favorite_beer = FavoriteBeers(owner_id=current_user.id, favorited_beer_id=beer_id)
    db.session.add(new_favorite_beer)
    db.session.commit()
    return jsonify({"done": True}), 201

# Add a favorite brewery for the current user with authentication
@api.route('favorite_breweries/<int:brewery_id>', methods=['POST'])
@jwt_required()
def add_favorite_brewery(brewery_id):
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    new_favorite_brewery = FavoriteBreweries(owner_id=current_user.id, favorited_brewery_id=brewery_id)
    db.session.add(new_favorite_brewery)
    db.session.commit()
    return jsonify({"done": True}), 201

# Add a favorite user for the current user with authentication
@api.route('favorite_users/<int:user_id>', methods=['POST'])
@jwt_required()
def add_favorite_user(user_id):
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    new_favorite_user = FavoriteUsers(owner_id=current_user.id, favorited_user_id=user_id)
    db.session.add(new_favorite_user)
    db.session.commit()
    return jsonify({"done": True}), 201

# Delete a favorite beer with user authentication
@api.route('favorite_beers/<int:beer_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_beer(beer_id):
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorite_beer = FavoriteBeers.query.filter_by(owner_id=current_user.id, favorited_beer_id=beer_id).first()
    if favorite_beer:
        db.session.delete(favorite_beer)
        db.session.commit()
        return jsonify({"done": True}), 200
    else:
        return jsonify({"error": "Favorite not found"}), 404

# Delete a favorite brewery with user authentication
@api.route('favorite_breweries/<int:brewery_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_brewery(brewery_id):
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorite_brewery = FavoriteBreweries.query.filter_by(owner_id=current_user.id, favorited_brewery_id=brewery_id).first()
    if favorite_brewery:
        db.session.delete(favorite_brewery)
        db.session.commit()
        return jsonify({"done": True}), 200
    else:
        return jsonify({"error": "Favorite not found"}), 404

# Delete a favorite user with user authentication
@api.route('favorite_users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_user(user_id):
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorite_user = FavoriteUsers.query.filter_by(owner_id=current_user.id, favorited_user_id=user_id).first()
    if favorite_user:
        db.session.delete(favorite_user)
        db.session.commit()
        return jsonify({"done": True}), 200
    else:
        return jsonify({"error": "Favorite not found"}), 404

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
