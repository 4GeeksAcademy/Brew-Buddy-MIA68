from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    favorite_breweries = db.relationship("Favorite_Breweries", backref="user")
    favorite_beers = db.relationship("Favorite_Beers", backref="user")
    favorite_users = db.relationship("Favorite_Users", backref="user")

    def __init__(self):
        db.session.add(self)
        try:
            db.session.commit()
        except Exception as error:
            db.session.rollback()
            raise Exception(error.args)

    def serialize(self):
        bond_dictionaries = []
        for bond in self.favorites:
            bond_dictionaries.append(
                bond.serialize()
            )
        return {
            "id": self.id,
            "email": self.email,
            "favorites": bond_dictionaries
            # do not serialize the password, its a security breach
        }
    
class FavoriteBreweries(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    led_favorite_breweries = db.Column(db.Integer, db.ForeignKey("planetbreweries.id"))

    def __init__(self):
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            "id": self.id,
            "favorite_breweries": self.led_favorite_breweries
        }