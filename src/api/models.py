from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # name = db.Column(db.String(120), nullable=True)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    favorite_users = db.relationship("FavoriteUsers", back_populates="owner", foreign_keys="FavoriteUsers.owner_id")
    favorited_by = db.relationship("FavoriteUsers", back_populates="favorited_user", foreign_keys="FavoriteUsers.favorited_user_id")
    favorite_beers = db.relationship("FavoriteBeers", back_populates="owner", foreign_keys="FavoriteBeers.owner_id")
    favorite_breweries = db.relationship("FavoriteBreweries", back_populates="owner", foreign_keys="FavoriteBreweries.owner_id")
    point_transactions = db.relationship("PointTransaction", back_populates="owner")
    user_images = db.relationship("UserImage", back_populates="owner", foreign_keys="UserImage.owner_id")
    brewery_reviews = db.relationship("BreweryReview", back_populates="owner", foreign_keys="BreweryReview.owner_id")
    user_rewards = db.relationship("UserRewards", back_populates="owner")

    def __init__(self, email, password, is_active=True):
        # self.name = name
        self.email = email
        self.password = password
        self.is_active = is_active
    
    # added repr to help with debugging by providing a readable string representation of the model instances
    def __repr__(self):
            return f'<User {self.email}>'
    @property
    def profile_image(self):
        image = list(filter(
            lambda user_image: user_image.is_profile_image == True,
            self.user_images
        ))
        if len(image) == 0: 
            return None
        return image[0]

    @property
    def points(self):
        total = 0
        for transaction in self.point_transactions:
            total += transaction.points
        return total

    def change_points(self, points, action):
        transaction = PointTransaction(owner_id=self.id, points=points, action=action)
        db.session.add(transaction)
        db.session.commit()

    def set_profile_image(self, image):
        if self.profile_image:
            old_profile_image = self.profile_image
            self.profile_image = image
            db.session.delete(old_profile_image)
        else:
            self.profile_image = image
        db.session.commit()
    
    def serialize(self):
        favorite_users_dictionaries = [favorite.serialize() for favorite in self.favorite_users]
        favorite_beers_dictionaries = [favorite.serialize() for favorite in self.favorite_beers]
        favorite_breweries_dictionaries = [favorite.serialize() for favorite in self.favorite_breweries]
        return {
            "id": self.id,
            "email": self.email,
            # "name" : self.name,
            "favorite_users": favorite_users_dictionaries,
            "favorite_beers": favorite_beers_dictionaries,
            "favorite_breweries": favorite_breweries_dictionaries,
            "points": self.points,
            "profile_image": self.profile_image.serialize() if self.profile_image else {"image_url": "samples/man-portrait"},
            "user_images": [image.serialize() for image in self.user_images],
            "user_rewards": [reward.serialize() for reward in self.user_rewards]
            # do not serialize the password, it's a security breach
        }
    
class FavoriteUsers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    favorited_user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    owner = db.relationship("User", back_populates="favorite_users", foreign_keys=[owner_id])
    favorited_user = db.relationship("User", back_populates="favorited_by", foreign_keys=[favorited_user_id])

    # added repr to help with debugging by providing a readable string representation of the model instances
    def __repr__(self):
        return f'<FavoriteUsers owner_id={self.owner_id} favorited_user_id={self.favorited_user_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "favorited_user_id": self.favorited_user_id
        }
    
class FavoriteBeers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    favorited_beer_id = db.Column(db.Integer, db.ForeignKey("beer.id"))

    owner = db.relationship("User", back_populates="favorite_beers", foreign_keys=[owner_id])
    beer = db.relationship("Beer", back_populates="favorited_by_users", foreign_keys=[favorited_beer_id])

    # added repr to help with debugging by providing a readable string representation of the model instances
    def __repr__(self):
        return f'<FavoriteBeers owner_id={self.owner_id} favorited_beer_id={self.favorited_beer_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "favorited_beer_id": self.favorited_beer_id
        }

class FavoriteBreweries(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    favorited_brewery_id = db.Column(db.Integer, db.ForeignKey("brewery.id"))

    owner = db.relationship("User", back_populates="favorite_breweries", foreign_keys=[owner_id])
    brewery = db.relationship("Brewery", back_populates="favorited_by_users", foreign_keys=[favorited_brewery_id])

    # added repr to help with debugging by providing a readable string representation of the model instances
    def __repr__(self):
        return f'<FavoriteBreweries owner_id={self.owner_id} favorited_brewery_id={self.favorited_brewery_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "favorited_brewery_id": self.favorited_brewery_id
       }

class Brewery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brewery_api_id= db.Column(db.String(250), nullable = True)
    brewery_name = db.Column(db.String(250))
    brewery_type = db.Column(db.String(250))
    address = db.Column(db.String(250))
    city = db.Column(db.String(250))
    state_province = db.Column(db.String(250))
    longitude = db.Column(db.String(250))
    latitude = db.Column(db.String(250))
    phone = db.Column(db.String(250))
    website_url = db.Column(db.String(250))

    favorited_by_users = db.relationship("FavoriteBreweries", back_populates="brewery", foreign_keys="FavoriteBreweries.favorited_brewery_id")

    def __init__(self, brewery_name, brewery_type, brewery_api_id, address, city, state_province, longitude, latitude, phone, website_url):
        self.brewery_name = brewery_name
        self.brewery_type = brewery_type
        self.brewery_api_id = brewery_api_id
        self.address = address
        self.city = city
        self.state_province = state_province
        self.longitude = longitude
        self.latitude = latitude
        self.phone = phone
        self.website_url = website_url

    # added repr to help with debugging by providing a readable string representation of the model instances
    def __repr__(self):
        return f'<Brewery {self.brewery_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "brewery_name": self.brewery_name,
            "brewery_type": self.brewery_type,
            "address": self.address,
            "city": self.city,
            "state_province": self.state_province,
            "longitude": self.longitude,
            "latitude": self.latitude,
            "phone": self.phone,
            "website_url": self.website_url
        }

class Beer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    beer_name = db.Column(db.String(250))
    type = db.Column(db.String(250))
    flavor = db.Column(db.String(250))
    ABV = db.Column(db.String(250))
    brewery_Id = db.Column(db.String(250))

    favorited_by_users = db.relationship("FavoriteBeers", back_populates="beer", foreign_keys="FavoriteBeers.favorited_beer_id")

    def __init__(self, beer_name, type, flavor, ABV, brewery_Id):
        self.beer_name = beer_name
        self.type = type
        self.flavor = flavor
        self.ABV = ABV
        self.brewery_Id = brewery_Id

    # added repr to help with debugging by providing a readable string representation of the model instances
    #def __repr__(self):
     #   return f'<Beer {self.beer_name}>'
     # commit for funsies

    def serialize(self):
        return {
            "id": self.id,
            "beer_name": self.beer_name,
            "type": self.type,
            "flavor": self.flavor,
            "ABV": self.ABV,
            "brewery_Id": self.brewery_Id
        }
    
class PointTransaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    action = db.Column(db.String(250), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    # will need to revisit at a later time to see if the below needs to be owner = db.relationship("User", back_populates="point_transactions")
    owner = db.relationship('User', )

    def __repr__(self):
        return f'<PointTransaction owner_id={self.owner_id} points={self.points} action={self.action}>'

    def serialize(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "points": self.points,
            "action": self.action,
            "timestamp": self.timestamp.isoformat()
        }
class UserRewards(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reward_name = db.Column(db.String(250))
    reward_value = db.Column(db.Integer)
    reward_type = db.Column(db.String(250))
    point_cost = db.Column(db.Integer)
    
     # will need to revisit at a later time to see if the below needs to be owner = db.relationship("User", back_populates="point_transactions")
    owner = db.relationship('User', )

    def __init__(self, reward_name, reward_value, reward_type, point_cost, owner_id):
        self.owner_id = owner_id
        self.reward_name = reward_name
        self.reward_value = reward_value
        self.reward_type = reward_type
        self.point_cost = point_cost

    # added repr to help with debugging by providing a readable string representation of the model instances
    #def __repr__(self):
     #   return f'<Beer {self.reward_name}>'
     # commit for funsies

    def serialize(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "reward_name": self.reward_name,
            "reward_value": self.reward_value,
            "reward_type": self.reward_type,
            "point_cost": self.point_cost,
        }
    

# model for user uploaded images
class UserImage(db.Model):
    # __table_args__ = (db.UniqueConstraint('owner_id', 'is_profile_image', name='unique_profile_image_per_user'),)
    id = db.Column(db.Integer, primary_key=True)
    is_profile_image = db.Column(db.Boolean(), nullable=False, default=False)
    public_id = db.Column(db.String(500), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    review_id = db.Column(db.Integer, db.ForeignKey('brewery_review.id'))
    owner = db.relationship("User", back_populates="user_images", foreign_keys=[owner_id])
    review = db.relationship("BreweryReview", back_populates="review_images", foreign_keys=[review_id])

    def __init__(self, public_id, image_url, owner_id, is_profile_image=False, review_id=None):
        self.public_id = public_id
        self.image_url = image_url
        self.owner_id = owner_id
        self.is_profile_image = is_profile_image
        self.review_id = review_id

    def serialize(self):
        return {
            "id": self.id,
            "public_id": self.public_id,
            "image_url": self.image_url,
            "is_profile_image": self.is_profile_image
        }
    
journey_reviews = db.Table('journey_reviews',
    db.Column('journey_id', db.Integer, db.ForeignKey('journey.id'), primary_key=True),
    db.Column('brewery_review_id', db.Integer, db.ForeignKey('brewery_review.id'), primary_key=True)
)

class BreweryReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brewery_id = db.Column(db.String(250))
    brewery_name = db.Column(db.String, nullable=False)
    overall_rating = db.Column(db.Float, nullable=False)
    review_text = db.Column(db.String(500), nullable=True)
    is_favorite_brewery = db.Column(db.Boolean, default=False)
    review_images = db.relationship("UserImage", back_populates="review", foreign_keys="UserImage.review_id")
    visit_date = db.Column(db.DateTime, default=datetime.utcnow)

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    owner = db.relationship('User', back_populates='brewery_reviews')

    beer_reviews = db.relationship('BeerReview', backref='brewery_review', lazy=True)

    def __init__(self, brewery_name, brewery_id, overall_rating, review_text="", is_favorite_brewery=False, owner_id=None):
        self.brewery_name = brewery_name
        self.brewery_id = brewery_id
        self.overall_rating = overall_rating
        self.review_text = review_text
        self.is_favorite_brewery = is_favorite_brewery
        self.owner_id = owner_id

    # Method to add a beer review
    # def add_beer_review(self, beer_review):
    #     self.beer_reviews.append(beer_review)

    def serialize(self):
        return {
            "id": self.id,
            "brewery_name": self.brewery_name,
            "brewery_id": self.brewery_id,
            "overall_rating": self.overall_rating,
            "review_text": self.review_text,
            "is_favorite_brewery": self.is_favorite_brewery,
            "review_images": [image.serialize() for image in self.review_images],
            "visit_date": self.visit_date.isoformat(),
            "owner_id": self.owner_id,
        }

# EJQ association table for brewery review images
# brewery_review_images = db.Table('brewery_review_images',
#     db.Column('brewery_review_id', db.Integer, db.ForeignKey('brewery_review.id'), primary_key=True),
#     db.Column('user_image_id', db.Integer, db.ForeignKey('user_image.id'), primary_key=True)
# )

class BeerReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brewery_review_id = db.Column(db.Integer, db.ForeignKey('brewery_review.id'), nullable=True)
    beer_name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    notes = db.Column(db.String(500), nullable=True)
    is_favorite = db.Column(db.Boolean, default=False)
    date_tried = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, brewery_review_id, beer_name, rating, notes="", is_favorite=False):
        self.brewery_review_id = brewery_review_id
        self.beer_name = beer_name
        self.rating = rating
        self.notes = notes
        self.is_favorite = is_favorite
        self.date_tried = datetime.now()

    def serialize(self):
        return{
            "id": self.id,
            "brewery_review_id": self.brewery_review_id,
            "beer_name": self.beer_name,
            "rating": self.rating,
            "notes": self.notes,
            "is_favorite": self.is_favorite,
            "date_tried": self.date_tried,
        } 

class Journey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    active_route_index = db.Column(db.Integer, default=-1)

    routes = db.relationship('Route', backref='journey', lazy=True)
    brewery_reviews = db.relationship('BreweryReview', secondary=journey_reviews, backref='journeys', lazy=True)

    user = db.relationship('User', backref="journeys")
    def __init__(self, user_id):
        self.user_id = user_id

    # def add_route(self, route):
    #     self.routes.append(route)

    # def set_active_route(self, index):
    #     if 0 <= index < len(self.routes):
    #         self.active_route_index = index
    #     else:
    #         raise ValueError("Invalid route index.")

    # def add_brewery_review(self, brewery_review):
    #     self.brewery_reviews.append(brewery_review)

class Route(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    journey_id = db.Column(db.Integer, db.ForeignKey('journey.id'), nullable=False)
    brewery_destination = db.Column(db.String(100), nullable=False)
    travel_time = db.Column(db.Float, nullable=False)  # In minutes
    miles = db.Column(db.Float, nullable=False)  # In miles

    def __init__(self, journey_id, brewery_destination, travel_time, miles):
        self.journey_id = journey_id
        self.brewery_destination = brewery_destination
        self.travel_time = travel_time
        self.miles = miles