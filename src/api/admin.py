  
import os
from flask_admin import Admin
from .models import db, User, Beer, Brewery, FavoriteBeers, FavoriteUsers, FavoriteBreweries, PointTransaction, UserImage, BreweryReview, BeerReview, Journey, Route, UserRewards
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Beer, db.session))
    admin.add_view(ModelView(Brewery, db.session))
    admin.add_view(ModelView(FavoriteBeers, db.session))
    admin.add_view(ModelView(FavoriteUsers, db.session))
    admin.add_view(ModelView(FavoriteBreweries, db.session))
    admin.add_view(ModelView(PointTransaction, db.session))
    admin.add_view(ModelView(UserImage, db.session))
    admin.add_view(ModelView(BreweryReview, db.session))
    admin.add_view(ModelView(BeerReview, db.session))
    admin.add_view(ModelView(Journey, db.session))
    admin.add_view(ModelView(Route, db.session))
    admin.add_view(ModelView(UserRewards, db.session))


    # You can duplicate that line to add new models
    # admin.add_view(ModelView(YourModelName, db.session))