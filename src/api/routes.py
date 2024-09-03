"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, session
from api.models import db, User, Beer, Brewery, FavoriteUsers, FavoriteBeers, FavoriteBreweries, PointTransaction
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import hashlib
from datetime import datetime, timedelta

from pyeasyencrypt.pyeasyencrypt import encrypt_string, decrypt_string
from api.send_email import send_email
import datetime
import json, os

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

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

# User log in route with password hashing - for active users only
# @api.route('/login', methods=['POST'])
# def handle_login():
#     body = request.get_json()
#     email = body["email"]
#     password = hashlib.sha256(body["password"].encode("utf-8")).hexdigest()
#     user = User.query.filter_by(email = email).first()
#     if user and user.password == password:
#         if user.is_active:
            # Check if the user has already logged in today
            # last_login = PointTransaction.query.filter_by(owner_id=user.id, action="Daily login").order_by(PointTransaction.timestamp.desc()).first()
            
            # if not last_login or (datetime.utcnow() - last_login.timestamp) > timedelta(days=1):
            #     # Award points for daily login
            #     points_earned = 1
            #     user.change_points(points_earned, "Daily login")
            #     db.session.commit()
            # else:
            #     points_earned = 0

    #         access_token = create_access_token(identity=user.id)
    #         return jsonify({
    #             "access_token": access_token,
    #             # "points_earned": points_earned,
    #             "total_points": user.points
    #         })
    #     else:
    #         return jsonify({"error": "User is not active"}), 403
    # else:
    #     return jsonify({"error": "Invalid email or password"}), 401

@api.route("/forgot_password", methods=["POST"])
def forgot_password():
    data=request.json
    email=data.get("email")
    if not email:
        return jsonify({"message": "email is required"}), 400
    user = User.query.filter_by(email=email) .first()
    if user is None:
        return jsonify({"message": "email does not exist"}), 400
    
    # Set token expiry time (e.g., 2 hours from now)
    expiration_time = (datetime.datetime.now() + datetime.timedelta(hours=2)).isoformat()

    #jwt_access_token 
    token= encrypt_string(json.dumps({
        "email": email, 
        "exp": expiration_time,
        "current_time": datetime.datetime.now().isoformat()
    }), os.getenv("FLASK_APP_KEY"))
    email_value = f"Here is the password recovery link!\n{os.getenv('FRONTEND_URL')}/reset_password/{token}"
    send_email(email, email_value, "Subject: password recovery for BrewBuddy")
    return jsonify({"message": "recovery password has been sent"}), 200


@api.route("/change_password", methods=["PUT"])
@jwt_required()  # This ensures that the request includes a valid JWT token
def change_password():
    data = request.json
    secret = data.get("secret")
    password = data.get("password")
    
    if not secret or not password:
        return jsonify({"message": "Invalid or expired token"}), 400
    
    try:
        # This will now work because @jwt_required() has validated the token
        user_id = get_jwt_identity()
        print(f"Decoded JWT Identity: {user_id}")
        
        user = User.query.get(user_id)
        user.password = hashlib.sha256(password.encode("utf-8")).hexdigest()
        db.session.commit()
        
        # Send an email notification after the password has been changed
        email_body = "Your password has been changed successfully. If you did not request this change, please contact support."
        send_email(user.email, email_body, "Password Change Notification")

        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        print(f"Token decryption failed: {str(e)}")
        return jsonify({"message": "Invalid or expired token"}), 400

@api.route("/reset_password", methods=["PUT"])
def reset_password():
    data = request.get_json()
    password = data.get("password")
    secret = data.get("secret")

    if not password:
        return jsonify({"message": "Please provide a new password."}), 400

    try:
        json_secret = json.loads(decrypt_string(secret, os.getenv('FLASK_APP_KEY')))
    except Exception as e:
        return jsonify({"message": "Invalid or expired token."}), 400

    email = json_secret.get('email')
    if not email:
        return jsonify({"message": "Invalid token data."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Email does not exist"}), 400

    user.password = hashlib.sha256(password.encode()).hexdigest()
    db.session.commit()

    send_email(email, "Your password has been changed successfully.", "Password Change Notification")

    return jsonify({"message": "Password successfully changed."}), 200

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
    favorite_beers=[]
    favorite_beersid = FavoriteBeers.query.filter_by(owner_id=current_user.id).all()
    for x in range(len(favorite_beersid)):
        favorite_beers.append(Beer.query.filter_by(id=favorite_beersid[x].favorited_beer_id).first().serialize())
    return jsonify(favorite_beers), 200

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
    # update to better resemble favorite beers
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    favorite_users = FavoriteUsers.query.filter_by(owner_id=current_user.id).all()
    return jsonify([favorite_user.serialize() for favorite_user in favorite_users]), 200

# Access user's points history log including authentication
@api.route('/point_history', methods=['GET'])
@jwt_required()
def handle_get_point_history():
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    transactions = PointTransaction.query.filter_by(owner_id=current_user.id).order_by(PointTransaction.timestamp.desc()).all()
    return jsonify([{
        'points': transaction.points,
        'action': transaction.action,
        'timestamp': transaction.timestamp.isoformat()
    } for transaction in transactions])

# Add a favorite beer for the current user with authentication
@api.route('/favorite_beers/<int:beer_id>', methods=['POST'])
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
@api.route('/favorite_breweries/<int:brewery_id>', methods=['POST'])
@jwt_required()
def add_favorite_brewery(brewery_id):
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    # Check if the brewery is already favorited
    existing_favorite = FavoriteBreweries.query.filter_by(owner_id=current_user.id, favorited_brewery_id=brewery_id).first()
    if existing_favorite:
        return jsonify({"error": "Brewery already favorited"}), 400

    new_favorite_brewery = FavoriteBreweries(owner_id=current_user.id, favorited_brewery_id=brewery_id)
    db.session.add(new_favorite_brewery)
    
    # Award points for favoriting a brewery
    points_earned = 5
    current_user.change_points(points_earned, "Favorited a brewery")

    db.session.commit()

    return jsonify({
        "message": "Brewery favorited successfully",
        "points_earned": points_earned,
        "total_points": current_user.points
    }), 201

# Add a favorite user for the current user with authentication
@api.route('/favorite_users/<int:user_id>', methods=['POST'])
@jwt_required()
def add_favorite_user(user_id):
    #return jsonify({"message": "Not implemented"}), 405
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    if current_user.id == user_id:
        return jsonify({"error": "You cannot favorite yourself"}), 400

    # Check if the user is already favorited
    existing_favorite = FavoriteUsers.query.filter_by(owner_id=current_user.id, favorited_user_id=user_id).first()
    if existing_favorite:
        return jsonify({"error": "User already favorited"}), 400

    new_favorite_user = FavoriteUsers(owner_id=current_user.id, favorited_user_id=user_id)
    db.session.add(new_favorite_user)
    
    # Award points for favoriting a user
    points_earned = 5
    current_user.change_points(points_earned, "Favorited a user")

    db.session.commit()

    return jsonify({
        "message": "User favorited successfully",
        "points_earned": points_earned,
        "total_points": current_user.points
    }), 201

# Delete a favorite beer with user authentication
@api.route('/favorite_beers/<int:beer_id>', methods=['DELETE'])
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
@api.route('/favorite_breweries/<int:brewery_id>', methods=['DELETE'])
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
@api.route('/favorite_users/<int:user_id>', methods=['DELETE'])
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
