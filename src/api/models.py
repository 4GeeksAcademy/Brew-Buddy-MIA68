from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    favorite_users = db.relationship("FavoriteUsers", back_populates="owner", foreign_keys="FavoriteUsers.owner_id")
    favorited_by = db.relationship("FavoriteUsers", back_populates="favorited_user", foreign_keys="FavoriteUsers.favorited_user_id")
    favorite_beers = db.relationship("FavoriteBeers", back_populates="owner", foreign_keys="FavoriteBeers.owner_id")
    favorite_breweries = db.relationship("FavoriteBreweries", back_populates="owner", foreign_keys="FavoriteBreweries.owner_id")
    points = db.Column(db.Integer, default=0)

    def __init__(self, email, password, is_active=True):
        self.email = email
        self.password = password
        self.is_active = is_active
    
    # added repr to help with debugging by providing a readable string representation of the model instances
    def __repr__(self):
            return f'<User {self.email}>'
    
    def add_points(self, points):
        self.points += points
        db.session.commit()

    def change_points(self, points, action):
        self.points += points
        transaction = PointTransaction(owner_id=self.id, points=points, action=action)
        db.session.add(transaction)
        db.session.commit()
    
    def serialize(self):
        favorite_users_dictionaries = [favorite.serialize() for favorite in self.favorite_users]
        favorite_beers_dictionaries = [favorite.serialize() for favorite in self.favorite_beers]
        favorite_breweries_dictionaries = [favorite.serialize() for favorite in self.favorite_breweries]
        return {
            "id": self.id,
            "email": self.email,
            "favorite_users": favorite_users_dictionaries,
            "favorite_beers": favorite_beers_dictionaries,
            "favorite_breweries": favorite_breweries_dictionaries,
            "points": self.points
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

    def __init__(self, brewery_name, brewery_type, address, city, state_province, longitude, latitude, phone, website_url):
        self.brewery_name = brewery_name
        self.brewery_type = brewery_type
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

    favorited_by_users = db.relationship("FavoriteBeers", back_populates="beer", foreign_keys="FavoriteBeers.favorited_beer_id")

    def __init__(self, beer_name, type, flavor, ABV):
        self.beer_name = beer_name
        self.type = type
        self.flavor = flavor
        self.ABV = ABV

    # added repr to help with debugging by providing a readable string representation of the model instances
    def __repr__(self):
        return f'<Beer {self.beer_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "beer_name": self.beer_name,
            "type": self.type,
            "flavor": self.flavor,
            "ABV": self.ABV
        }
    
class PointTransaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    action = db.Column(db.String(250), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    owner = db.relationship('User', backref=db.backref('point_transactions', lazy=True))

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