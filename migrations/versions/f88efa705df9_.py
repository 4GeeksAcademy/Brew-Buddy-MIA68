"""empty message

Revision ID: f88efa705df9
Revises: 
Create Date: 2024-09-17 21:44:11.846235

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f88efa705df9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('beer',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('beer_name', sa.String(length=250), nullable=True),
    sa.Column('type', sa.String(length=250), nullable=True),
    sa.Column('flavor', sa.String(length=250), nullable=True),
    sa.Column('ABV', sa.String(length=250), nullable=True),
    sa.Column('brewery_Id', sa.String(length=250), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('brewery',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('brewery_api_id', sa.String(length=250), nullable=True),
    sa.Column('brewery_name', sa.String(length=250), nullable=True),
    sa.Column('brewery_type', sa.String(length=250), nullable=True),
    sa.Column('address', sa.String(length=250), nullable=True),
    sa.Column('city', sa.String(length=250), nullable=True),
    sa.Column('state_province', sa.String(length=250), nullable=True),
    sa.Column('longitude', sa.String(length=250), nullable=True),
    sa.Column('latitude', sa.String(length=250), nullable=True),
    sa.Column('phone', sa.String(length=250), nullable=True),
    sa.Column('website_url', sa.String(length=250), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('brewery_review',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('brewery_name', sa.String(), nullable=False),
    sa.Column('overall_rating', sa.Float(), nullable=False),
    sa.Column('review_text', sa.String(length=500), nullable=True),
    sa.Column('is_favorite_brewery', sa.Boolean(), nullable=True),
    sa.Column('visit_date', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('beer_review',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('brewery_review_id', sa.Integer(), nullable=True),
    sa.Column('beer_name', sa.String(length=100), nullable=False),
    sa.Column('rating', sa.Float(), nullable=False),
    sa.Column('notes', sa.String(length=500), nullable=True),
    sa.Column('is_favorite', sa.Boolean(), nullable=True),
    sa.Column('date_tried', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['brewery_review_id'], ['brewery_review.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('favorite_beers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('favorited_beer_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['favorited_beer_id'], ['beer.id'], ),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('favorite_breweries',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('favorited_brewery_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['favorited_brewery_id'], ['brewery.id'], ),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('favorite_users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('favorited_user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['favorited_user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('journey',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('active_route_index', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('point_transaction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=False),
    sa.Column('points', sa.Integer(), nullable=False),
    sa.Column('action', sa.String(length=250), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_image',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('is_profile_image', sa.Boolean(), nullable=False),
    sa.Column('public_id', sa.String(length=500), nullable=False),
    sa.Column('image_url', sa.String(length=500), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('owner_id', 'is_profile_image', name='unique_profile_image_per_user')
    )
    op.create_table('journey_reviews',
    sa.Column('journey_id', sa.Integer(), nullable=False),
    sa.Column('brewery_review_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['brewery_review_id'], ['brewery_review.id'], ),
    sa.ForeignKeyConstraint(['journey_id'], ['journey.id'], ),
    sa.PrimaryKeyConstraint('journey_id', 'brewery_review_id')
    )
    op.create_table('route',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('journey_id', sa.Integer(), nullable=False),
    sa.Column('brewery_destination', sa.String(length=100), nullable=False),
    sa.Column('travel_time', sa.Float(), nullable=False),
    sa.Column('miles', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['journey_id'], ['journey.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('route')
    op.drop_table('journey_reviews')
    op.drop_table('user_image')
    op.drop_table('point_transaction')
    op.drop_table('journey')
    op.drop_table('favorite_users')
    op.drop_table('favorite_breweries')
    op.drop_table('favorite_beers')
    op.drop_table('beer_review')
    op.drop_table('user')
    op.drop_table('brewery_review')
    op.drop_table('brewery')
    op.drop_table('beer')
    # ### end Alembic commands ###
