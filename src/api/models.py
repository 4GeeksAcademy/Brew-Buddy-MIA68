from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)

    favorite_users = db.relationship("FavoriteUsers", back_populates="owner", foreign_keys="FavoriteUsers.owner_id")
    favorited_by = db.relationship("FavoriteUsers", back_populates="favorited_user", foreign_keys="FavoriteUsers.favorited_user_id")
    favorite_beers = db.relationship("FavoriteBeers", back_populates="owner", foreign_keys="FavoriteBeers.owner_id")

    def __init__(self, email, password, is_active=True):
        self.email = email
        self.password = password
        self.is_active = is_active

    # added repr to help with debugging by providing a readable string representation of the model instances
    def __repr__(self):
            return f'<User {self.email}>'

    def serialize(self):
        favorite_users_dictionaries = [favorite.serialize() for favorite in self.favorite_users]
        favorite_beers_dictionaries = [favorite.serialize() for favorite in self.favorite_beers]
        return {
            "id": self.id,
            "email": self.email,
            "favorite_users": favorite_users_dictionaries,
            "favorite_beers": favorite_beers_dictionaries
            # do not serialize the password, it's a security breach
        }
    
    # checks if used is active
    def is_active_status(self):
        return self.is_active

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

# PLACEHOLDER FOR USER'S FAVORITE BREWERIES LIST
# class FavoriteBreweries(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
#     favorited_brewery_id = db.Column(db.Integer, db.ForeignKey("brewery.id"))

#     owner = db.relationship("User", back_populates="favorite_breweries", foreign_keys=[owner_id])
#     brewery = db.relationship("Brewery", back_populates="favorited_by_users", foreign_keys=[favorited_brewery_id])

#     def serialize(self):
#         return {
#             "id": self.id,
#             "favorite_breweries": self.favorited_brewery_id
#        }

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