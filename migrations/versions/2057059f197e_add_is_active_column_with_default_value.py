"""Add is_active column with default value

Revision ID: 2057059f197e
Revises: 75787a03be0f
Create Date: 2024-08-25 00:19:44.761269

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '2057059f197e'
down_revision = '75787a03be0f'
branch_labels = None
depends_on = None

def upgrade():
    # Step 1: Add the column as nullable
    op.add_column('user', sa.Column('is_active', sa.Boolean(), nullable=True))

    # Step 2: Update existing records to set a default value
    conn = op.get_bind()
    conn.execute('UPDATE "user" SET is_active = TRUE WHERE is_active IS NULL')

    # Step 3: Alter the column to be not nullable with a default value
    op.alter_column('user', 'is_active',
                    existing_type=sa.Boolean(),
                    nullable=False,
                    server_default=sa.true())

def downgrade():
    # Remove the column in case of a downgrade
    op.drop_column('user', 'is_active')
