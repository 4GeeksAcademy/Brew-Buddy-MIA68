"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, session
from api.models import db, User, Beer, FavoriteUsers, FavoriteBeers
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# To get the current user (does not include JWTManager/user authentication piece)
def get_current_user():
    user_id = session.get('user_id')  # Get the user ID from the session
    if user_id:
        return User.query.get(user_id)  # Query the user from the database
    return None

# preemptively created the get user route, feel free to fix if you're working on the user stuff
@api.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200

# Get all beers route
@api.route('/beers', methods=['GET'])
def get_all_beers():
    beers = Beer.query.all()
    return jsonify([beer.serialize() for beer in beers]), 200

# Access user's favorite beers list
@api.route('favorite_beers', methods=['GET'])
def handle_get_favorite_beers():
    return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorite_beers = FavoriteBeers.query.filter_by(owner_id=current_user.id).all()
    return jsonify([favorite_beer.serialize() for favorite_beer in favorite_beers]), 200

#comment (please delete)
# Access user's favorite users list
@api.route('favorite_users', methods=['GET'])
def handle_get_favorite_users():
    return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorite_users = FavoriteUsers.query.filter_by(owner_id=current_user.id).all()
    return jsonify([favorite_user.serialize() for favorite_user in favorite_users]), 200

# Add a favorite beer for the current user
@api.route('favorite_beers/<int:beer_id>', methods=['POST'])
def add_favorite_beer(beer_id):
    return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    new_favorite_beer = FavoriteBeers(owner_id=current_user.id, favorited_beer_id=beer_id)
    db.session.add(new_favorite_beer)
    db.session.commit()
    return jsonify({"done": True}), 201

# Add a favorite user for the current user
@api.route('favorite_users/<int:user_id>', methods=['POST'])
def add_favorite_user(user_id):
    return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    new_favorite_user = FavoriteUsers(owner_id=current_user.id, favorited_user_id=user_id)
    db.session.add(new_favorite_user)
    db.session.commit()
    return jsonify({"done": True}), 201

# Delete a favorite beer
@api.route('favorite_beers/<int:beer_id>', methods=['DELETE'])
def delete_favorite_beer(beer_id):
    return jsonify({"message": "Not implemented"}), 405
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

# Delete a favorite user
@api.route('favorite_users/<int:user_id>', methods=['DELETE'])
def delete_favorite_user(user_id):
    return jsonify({"message": "Not implemented"}), 405
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
