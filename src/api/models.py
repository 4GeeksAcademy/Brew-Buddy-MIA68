from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    favorite_users = db.relationship("FavoriteUsers", backref="owner", foreign_keys="FavoriteUsers.owner_id")
    favorited_by = db.relationship("FavoriteUsers", backref="favorited_user", foreign_keys="FavoriteUsers.favorited_user_id")

    def __init__(self, email, password, is_active):
        self.email = email
        self.password = password
        self.is_active = is_active

    def serialize(self):
        favorite_dictionaries = []
        for favorite in self.favorite_users:
            favorite_dictionaries.append(
                favorite.serialize()
            )
        return {
            "id": self.id,
            "email": self.email,
            "favorite_users": favorite_dictionaries
            # do not serialize the password, it's a security breach
        }

    
class FavoriteUsers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    favorited_user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    def __init__(self):
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            "id": self.id,
            "favorited_user_id": self.favorited_user_id
        }
    
class FavoriteBeers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    favorited_beer_id = db.Column(db.Integer, db.ForeignKey("beer.id"))

    def __init__(self):
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            "id": self.id,
            "favorites_beers": self.favorited_beer_id
        }

# PLACEHOLDER FOR FAVORITES BREWERIES LIST
# class FavoriteBreweries(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
#     favorited_brewery_id = db.Column(db.Integer, db.ForeignKey(""))

#     def __init__(self):
#         db.session.add(self)
#         db.session.commit()

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

    def __init__(self):
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            "id": self.id,
            "beer_name": self.beer_name,
            "type": self.type,
            "flavor": self.flavor,
            "ABV": self.ABV
        }