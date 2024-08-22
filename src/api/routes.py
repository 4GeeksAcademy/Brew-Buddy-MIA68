"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Access user's favorites list
@api.route('/users/favorites', methods=['GET'])
def handle_get_favorites():
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorites = Favorites.query.filter_by(led_user_id=current_user.id).all()
    return jsonify([favorite.serialize() for favorite in favorites]), 200

# Add a favorite beer for the current user
@api.route('/favorites/beers/<int:beer_id>', methods=['POST'])
def add_favorite_beer(beer_id):
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    new_favorite = Favorites(led_user_id=current_user.id, led_favorite_beers=beer_id)
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({"done": True}), 201

# Add a favorite user for the current user
# @api.route('/favorites/users/<int:user_id>', methods=['POST'])
# def add_favorite_user(user_id):
#     current_user = get_current_user()
#     if not current_user:
#         return jsonify({"error": "User not authenticated"}), 401
    
#     new_favorite = Favorites(led_user_id=current_user.id, led_favorite_users=user_id)
#     db.session.add(new_favorite)
#     db.session.commit()
#     return jsonify({"done": True}), 201

# Delete a favorite beer
@api.route('/favorites/beers/<int:beer_id>', methods=['DELETE'])
def delete_favorite_beer(beer_id):
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorite = Favorites.query.filter_by(led_user_id=current_user.id, led_favorite_beers=beer_id).first()
    if favorite:
        db.session.delete(favorite)
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
