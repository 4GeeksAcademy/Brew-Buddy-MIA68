"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, session
from api.models import db, User, Beer, Brewery, FavoriteUsers, FavoriteBeers, FavoriteBreweries, PointTransaction, UserImage, BreweryReview, BeerReview, UserRewards
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import hashlib
from datetime import datetime, timedelta
from sqlalchemy import select
from pyeasyencrypt.pyeasyencrypt import encrypt_string, decrypt_string
from api.send_email import send_email
import json, os
from dotenv import load_dotenv
load_dotenv()
# added line 18 my lines 15 & 16
from cloudinary.uploader import upload, destroy

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Configuration for Cloudinary
CLOUDINARY_URL = os.environ.get("CLOUDINARY_URL")

# Only create UPLOAD_FOLDER if it's defined in environment variables
UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER')
if UPLOAD_FOLDER:
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# EJQ-updated the signup function to have users have a default profile pic
@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    email = body["email"]
    # name = body["name"]
    password = hashlib.sha256(body["password"].encode("utf-8")).hexdigest()
    
    user = User(
        email=email,
        # name=name,
        password=password,
        is_active=True
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Create a UserImage instance for the default profile picture
    default_profile_image = UserImage(
        public_id='samples/man-portrait',
        image_url='https://res.cloudinary.com/demo/image/upload/samples/man-portrait',
        owner_id=user.id,
        is_profile_image=True
    )
    
    db.session.add(default_profile_image)
    db.session.commit()
    
    response_body = {
        "message": "User successfully created"
    }
    return jsonify(response_body), 200

# User log in route with password hashing - for active users only & no points
# @api.route('/login', methods=['POST'])
# def handle_login():
#     body = request.get_json()
#     email = body["email"]
#     password = hashlib.sha256(body["password"].encode("utf-8")).hexdigest()
#     user = User.query.filter_by(email = email).first()
#     if user and user.password == password:
#         if user.is_active:
#             access_token = create_access_token(identity=user.id)
#             return jsonify(access_token=access_token)
#         else:
#             return jsonify({"error": "User is not active"}), 403
#     else:
#         return jsonify({"error": "Invalid email or password"}), 401

# User log in route with password hashing and awarding points - for active users only
@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    email = body["email"]
    password = hashlib.sha256(body["password"].encode("utf-8")).hexdigest()
    user = User.query.filter_by(email = email).first()
    if user and user.password == password:
        if user.is_active:
            # Check if the user has already logged in today
            last_login = PointTransaction.query.filter_by(owner_id=user.id, action="Daily login").order_by(PointTransaction.timestamp.desc()).first()
            
            if not last_login or (datetime.utcnow() - last_login.timestamp) > timedelta(days=1):
                # Award points for daily login
                points_earned = 1
                user.change_points(points_earned, "Daily login")
                db.session.commit()
            else:
                points_earned = 0

            # Check if the user has already logged in today
            last_login = PointTransaction.query.filter_by(owner_id=user.id, action="Daily login").order_by(PointTransaction.timestamp.desc()).first()
            
            if not last_login or (datetime.utcnow() - last_login.timestamp) > timedelta(days=1):
                # Award points for daily login
                points_earned = 1
                user.change_points(points_earned, "Daily login")
                db.session.commit()
            else:
                points_earned = 0

            access_token = create_access_token(identity=user.id)
            return jsonify({
                "access_token": access_token,
                "points_earned": points_earned,
                "total_points": user.points
            })
        else:
            return jsonify({"error": "User is not active"}), 403
    else:
        return jsonify({"error": "Invalid email or password"}), 401


@api.route("/profile/change_password", methods=["PUT"])
@jwt_required()  # Ensures JWT token is valid
def profile_change_password():
    data = request.get_json()
    new_password = data.get("password")

    if not new_password:
        return jsonify({"message": "Please provide a new password."}), 400

   
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found."}), 404

   
    user.password = hashlib.sha256(new_password.encode()).hexdigest()
    db.session.commit()

    return jsonify({"message": "Password changed successfully."}), 200        

@api.route("/forgot_password", methods=["POST"])
def forgot_password():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"message": "email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"message": "email does not exist"}), 400

    expiration_time = (datetime.utcnow() + timedelta(hours=2)).isoformat()

    token = encrypt_string(json.dumps({
        "email": email,
        "exp": expiration_time,
        "current_time": datetime.now().isoformat()  
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
    new_password = data.get("password")
    secret = data.get("secret")

    if not new_password or not secret:
        return jsonify({"message": "Invalid request."}), 400

    try:
        
        decrypted_token = decrypt_string(secret, os.getenv('FLASK_APP_KEY'))
        json_secret = json.loads(decrypted_token)

   
        expiration_time = datetime.fromisoformat(json_secret.get("exp"))
        if datetime.utcnow() > expiration_time:
            return jsonify({"message": "Token has expired."}), 400

        
        email = json_secret.get("email")
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"message": "User not found."}), 404

       
        user.password = hashlib.sha256(new_password.encode()).hexdigest()
        db.session.commit()

        return jsonify({"message": "Password reset successfully."}), 200

    except Exception as e:
        print(f"Decryption failed: {str(e)}")
        return jsonify({"message": "Invalid or expired token."}), 400

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

# Get user route to grab the info on the current user including authentication; updated to include ability to change profile pic
@api.route('/user', methods=['GET', 'PUT'])
@jwt_required()
def handle_user_info():
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    if request.method == 'GET':
        user_data = current_user.serialize()
        return jsonify(user_data), 200
    
    elif request.method == 'PUT':
        body = request.get_json()
        if 'profile_image_id' in body:
            current_user.profile_image_id = body['profile_image_id']
        # EJQ do not update profile imade ID directly
        # You can add more fields to update here if needed
        db.session.commit()
        return jsonify({"message": "User info updated successfully"}), 200

# Get all beers route
@api.route('/beers', methods=['GET'])
def get_all_beers():
    beers = Beer.query.all()
    return jsonify([beer.serialize() for beer in beers]), 200

# Get all brewery beers route
@api.route('/brewery/beers/<string:uid>', methods=['GET'])
def get_brewery_beers(uid):
    brewery_id = uid
    beers = Beer.query.filter(Beer.brewery_Id == brewery_id )
    return jsonify([beer.serialize() for beer in beers]), 200

# Post a new brewery
@api.route('/breweries', methods=['POST'])
def post_new_brewery():
    body = request.get_json()
    new_brewery_name = body["brewery_name"]
    new_brewery_type = body["brewery_type"]
    new_address = body["address"]
    new_city = body["city"]
    new_state_province = body["state_province"]
    new_postal_code = body["postal_code"]
    new_longitude = body["longitude"]
    new_latitude = body["latitude"]
    new_phone = body["phone"]
    new_website_url = body["website_url"]
    brewery = Brewery(brewery_name = new_brewery_name, brewery_type= new_brewery_type, address= new_address, city= new_city, state_province= new_state_province, postal_code= new_postal_code, longitude= new_longitude, latitude= new_latitude, phone= new_phone, website_url= new_website_url)
    db.session.add(brewery)
    db.session.commit()
    return "msg: brewery added:", 200

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
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401

    # Fetch the favorite brewery records
    favorite_breweries = FavoriteBreweries.query.filter_by(owner_id=current_user.id).all()

    # Prepare a list to store detailed brewery information
    detailed_breweries = []

    # Loop through each favorite brewery and fetch full brewery details
    for favorite in favorite_breweries:
        brewery = Brewery.query.get(favorite.favorited_brewery_id)  # Get the full brewery details
        if brewery:
            detailed_breweries.append(brewery.serialize())  # Add the serialized brewery to the list

    return jsonify(detailed_breweries), 200  # Return the detailed breweries as JSON

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
    beer_exists=FavoriteBeers.query.filter_by(favorited_beer_id=beer_id).first()
    if beer_exists: 
        db.session.delete(beer_exists)
        db.session.commit()
        return jsonify(message="beer has been removed from favorites")

    new_favorite_beer = FavoriteBeers(owner_id=current_user.id, favorited_beer_id=beer_id)
    db.session.add(new_favorite_beer)
    db.session.commit()
    return jsonify({"done": True, "message": "beer has been added to favorites"}), 201

# Add a favorite brewery for the current user with authentication
@api.route('/favorite_breweries', methods=['POST'])
@jwt_required()
def add_favorite_brewery():
    current_user = get_current_user()
    data=request.get_json()
    
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    existing_brewery=Brewery.query.filter_by(brewery_api_id = data.get("id")).first()
    new_brewery=None 
    if not existing_brewery:
        new_brewery=Brewery(brewery_name=data.get("name"), 
                            brewery_type=data.get("brewery_type"), 
                            brewery_api_id=data.get("id"), address=data.get("address_1"), 
                            city=data.get("city"), state_province=data.get("state_province"), 
                            longitude=data.get("longitude"),
                            latitude=data.get("latitude"),
                            phone=data.get("phone"),
                            website_url=data.get("website_url")  )
        db.session.add(new_brewery)
        db.session.commit()
        db.session.refresh(new_brewery)
    # Check if the brewery is already favorite
    new_favorite_brewery=None 
    if new_brewery:
        existing_favorite = FavoriteBreweries.query.filter_by(owner_id=current_user.id, favorited_brewery_id=new_brewery.id).first()
        if existing_favorite:
            return jsonify({"error": "Brewery already favorited by this user"}), 400
        new_favorite_brewery = FavoriteBreweries(owner_id=current_user.id, favorited_brewery_id=new_brewery.id)
    if existing_brewery:
        existing_favorite = FavoriteBreweries.query.filter_by(owner_id=current_user.id, favorited_brewery_id=existing_brewery.id).first()
        if existing_favorite:
            return jsonify({"error": "Brewery already favorited by this user"}), 400
        new_favorite_brewery = FavoriteBreweries(owner_id=current_user.id, favorited_brewery_id=existing_brewery.id)
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
    
# user images endpoint
@api.route('/images', methods=['GET', 'POST'])
@api.route('/images/<int:id>', methods=['DELETE'])
@jwt_required()
def handle_user_images(id=0):
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401

    if request.method == "POST":
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file and allowed_file(file.filename):
            try:
                # Upload to Cloudinary
                result = upload(file)
                
                # Check if this should be the profile image
                is_profile_image = request.form.get("mode") == "profile"
                review_id = request.form.get("review_id", None)
                
                # If it's a profile image, set all other images to not be profile images
                if is_profile_image:
                    UserImage.query.filter_by(owner_id=current_user.id, is_profile_image=True).update({UserImage.is_profile_image: False})
                
                # Create new UserImage object
                new_image = UserImage(
                    public_id=result['public_id'],
                    image_url=result['secure_url'],
                    owner_id=current_user.id,
                    is_profile_image=is_profile_image,
                    review_id = review_id
                )
                
                db.session.add(new_image)
                db.session.commit()
                
                return jsonify({"message": "Image uploaded successfully", "image": new_image.serialize()}), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({"error": str(e)}), 400

        return jsonify({"error": "File type not allowed"}), 400

    elif request.method == "DELETE":
        if id == 0:
            return jsonify({"error": "Invalid image ID"}), 400

        image = UserImage.query.filter_by(id=id, owner_id=current_user.id).first()
        if not image:
            return jsonify({"error": "Image not found"}), 404

        try:
            # Delete from Cloudinary
            result = destroy(image.public_id)
            if result.get('result') == 'ok':
                # Delete from database
                db.session.delete(image)
                db.session.commit()
                return jsonify({"message": "Image deleted successfully"}), 200
            else:
                return jsonify({"error": "Failed to delete image from Cloudinary"}), 500
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

    else:
        return jsonify({"error": "Method not allowed"}), 405

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route('/add_brewery_review', methods=['Post'])
@jwt_required()
def add_brewery_review():
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401
    
    data = request.json
    brewery_review = BreweryReview(
        brewery_name=data.get('brewery_name'),
        brewery_id=data.get('brewery_id'),
        overall_rating=data['overall_rating'],
        review_text=data.get('review_text', ""),
        is_favorite_brewery=data.get('is_favorite_brewery', False),
        owner_id=current_user.id
    )
    db.session.add(brewery_review)
    db.session.commit()
    for beer_review_data in data['beer_reviews']:
        beer_review = BeerReview(
            #add review id
            brewery_review_id=brewery_review.id,
            beer_name=beer_review_data.get('beer_name'),
            rating=beer_review_data['rating'],
            notes=beer_review_data.get('notes', ""),
            is_favorite=beer_review_data.get('is_favorite', False)
        )
        db.session.add(beer_review)
    
    db.session.commit()

    # EJQ - to award points for submitting a brewery review
    # points_earned = 10
    # current_user.change_points(points_earned, "Submitted a brewery review")

    return jsonify(
        brewery_review.serialize()
    ), 201

@api.route('/get_brewery_reviews', methods=['GET'])
def get_brewery_reviews():
    # Optional query parameters to filter results
    brewery_name = request.args.get('brewery_name')
    
    # Query the database for brewery reviews
    if brewery_name:
        brewery_reviews = BreweryReview.query.filter_by(brewery_name=brewery_name).all()
    else:
        brewery_reviews = BreweryReview.query.all()

    # Prepare the data to return
    result = []
    for review in brewery_reviews:
        print(review,"in for loop")
        beer_reviews = BeerReview.query.filter_by(brewery_review_id=review.id).all()
        print(beer_reviews)
        beer_reviews_data = [{
            'beer_name': beer_review.beer_name,
            'rating': beer_review.rating,
            'notes': beer_review.notes,
            'is_favorite': beer_review.is_favorite
        } for beer_review in beer_reviews]
        
        result.append({
            'brewery_name': review.brewery_name,
            'brewery_id': review.brewery_id,
            'overall_rating': review.overall_rating,
            'review_text': review.review_text,
            'is_favorite_brewery': review.is_favorite_brewery,
            'beer_reviews': beer_reviews_data,
            'review_images': [image.serialize() for image in review.review_images]
        })
    return jsonify(result), 200

@api.route('/delete_brewery_review/<int:brewery_review_id>', methods=['DELETE'])
def delete_brewery_review(brewery_review_id):
    # Find the brewery review by ID
    brewery_review = BreweryReview.query.get(brewery_review_id)
    
    if not brewery_review:
        return jsonify({"message": "Brewery review not found"}), 404
    
    # Find and delete all associated beer reviews
    beer_reviews = BeerReview.query.filter_by(brewery_review_id=brewery_review.id).all()
    for beer_review in beer_reviews:
        db.session.delete(beer_review)
    
    # Delete the brewery review
    db.session.delete(brewery_review)
    db.session.commit()
    
    return jsonify({"message": "Brewery review and associated beer reviews deleted successfully"}), 200

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/beers/add', methods=['POST'])
def add_beer():
    body = request.get_json()
    new_Beer_Name = body["beer_name"]
    new_Flavor = body["flavor"]
    new_Type = body["type"]
    new_ABV = body["ABV"]
    new_Brewery_Id = body["brewery_Id"]
    beer = Beer(beer_name= new_Beer_Name, flavor= new_Flavor, type= new_Type, ABV= new_ABV, brewery_Id= new_Brewery_Id)
    db.session.add(beer)
    db.session.commit()
    return jsonify({"msg": "beer added"}), 200

#Redeem Points for Rewards
@api.route('/add_user_reward', methods=['POST'])
@jwt_required()
def redeem_award():
    owner_id = get_jwt_identity()
    reward_name = request.json.get('reward_name')
    reward_value = request.json.get('reward_value')
    reward_type = request.json.get('reward_type')
    point_cost = request.json.get('reward_cost')

    total_points = db.session.query(db.func.sum(PointTransaction.points)).filter_by(owner_id=owner_id).scalar() or 0

    if total_points < point_cost:
        return jsonify({'error': 'Not enough points.'}), 400

    reward = UserRewards(
        reward_name,
        reward_value,
        reward_type,
        point_cost,
        owner_id,
    )
    db.session.add(reward)
    db.session.commit()

    new_transaction = PointTransaction(
        owner_id=owner_id,
        points=-reward.point_cost,
        action=f'Redeemed reward: {reward.reward_name}'
    )
    db.session.add(new_transaction)

    db.session.commit()

    return jsonify({
        'message': 'Reward redeemed successfully!',
        'reward': reward.serialize()
    }), 200

@api.route('/get_user_rewards', methods=['GET'])
@jwt_required()
def get_user_rewards():
    owner_id = get_jwt_identity()

    try:
        # Fetch all rewards for the user
        user_rewards = UserRewards.query.filter_by(owner_id=owner_id).all()

        # Serialize each reward object
        rewards_list = [reward.serialize() for reward in user_rewards]

        return jsonify({
            'rewards': rewards_list,
            'totalRewards': len(rewards_list)
        }), 200

    except Exception as e:
        return jsonify({'error': 'Error retrieving rewards', 'details': str(e)}), 500

