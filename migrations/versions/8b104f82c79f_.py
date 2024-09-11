"""empty message

Revision ID: 8b104f82c79f
Revises: fadf5c6db6ab
Create Date: 2024-09-11 16:29:35.934092

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8b104f82c79f'
down_revision = 'fadf5c6db6ab'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('brewery', schema=None) as batch_op:
        batch_op.add_column(sa.Column('brewery_api_id', sa.String(length=250), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('brewery', schema=None) as batch_op:
        batch_op.drop_column('brewery_api_id')

    # ### end Alembic commands ###
