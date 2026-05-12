import os, re, json, csv
from datetime import datetime, timedelta
from io import StringIO
from functools import wraps

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv

import pandas as pd
import numpy as np
from ml_engine import train as ml_train, predict as ml_predict

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'nyumbasense_ai_secret_key_2024_abz_company')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///nyumbasense.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', os.urandom(32).hex())
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

CORS(app, resources={r"/api/*": {"origins": "*"}})
db = SQLAlchemy(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# -------------------- MODELS --------------------
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='buyer')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_password(self, pw): self.password_hash = bcrypt.generate_password_hash(pw).decode('utf-8')
    def check_password(self, pw): return bcrypt.check_password_hash(self.password_hash, pw)
    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'email': self.email, 'phone': self.phone,
                'role': self.role, 'is_active': self.is_active,
                'created_at': self.created_at.isoformat() if self.created_at else None}


class Listing(db.Model):
    __tablename__ = 'listings'
    id = db.Column(db.Integer, primary_key=True)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(200), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    bedrooms = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=False)
    square_feet = db.Column(db.Float, nullable=False)
    parking_spaces = db.Column(db.Integer, default=0)
    year_built = db.Column(db.Integer)
    property_type = db.Column(db.String(50), nullable=False)
    furnished = db.Column(db.Boolean, default=False)
    nearby_school = db.Column(db.Boolean, default=False)
    nearby_hospital = db.Column(db.Boolean, default=False)
    seller_price = db.Column(db.Float, nullable=False)
    estimated_price = db.Column(db.Float)
    price_range_min = db.Column(db.Float)
    price_range_max = db.Column(db.Float)
    confidence_score = db.Column(db.Float)
    price_status = db.Column(db.String(50), default='pending')
    images = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    is_flagged = db.Column(db.Boolean, default=False)
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    seller = db.relationship('User', backref='listings', lazy=True)

    def to_dict(self):
        return {'id': self.id, 'seller_id': self.seller_id,
                'seller_name': self.seller.name if self.seller else None,
                'title': self.title, 'description': self.description,
                'location': self.location, 'district': self.district,
                'bedrooms': self.bedrooms, 'bathrooms': self.bathrooms,
                'square_feet': self.square_feet, 'parking_spaces': self.parking_spaces,
                'year_built': self.year_built, 'property_type': self.property_type,
                'furnished': self.furnished, 'nearby_school': self.nearby_school,
                'nearby_hospital': self.nearby_hospital,
                'seller_price': self.seller_price, 'estimated_price': self.estimated_price,
                'price_range_min': self.price_range_min, 'price_range_max': self.price_range_max,
                'confidence_score': self.confidence_score, 'price_status': self.price_status,
                'images': self.images.split(',') if self.images else [],
                'status': self.status, 'is_flagged': self.is_flagged, 'views': self.views,
                'created_at': self.created_at.isoformat() if self.created_at else None}


class Prediction(db.Model):
    __tablename__ = 'predictions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=True)
    predicted_price = db.Column(db.Float, nullable=False)
    min_range = db.Column(db.Float, nullable=False)
    max_range = db.Column(db.Float, nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    seller_price = db.Column(db.Float)
    price_difference = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'user_id': self.user_id, 'listing_id': self.listing_id,
                'predicted_price': self.predicted_price, 'min_range': self.min_range,
                'max_range': self.max_range, 'confidence': self.confidence,
                'status': self.status, 'seller_price': self.seller_price,
                'price_difference': self.price_difference,
                'created_at': self.created_at.isoformat() if self.created_at else None}


class Dataset(db.Model):
    __tablename__ = 'datasets'
    id = db.Column(db.Integer, primary_key=True)
    trainer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    row_count = db.Column(db.Integer, default=0)
    columns = db.Column(db.Text)
    status = db.Column(db.String(20), default='uploaded')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'trainer_id': self.trainer_id, 'filename': self.filename,
                'original_filename': self.original_filename, 'row_count': self.row_count,
                'columns': self.columns.split(',') if self.columns else [],
                'status': self.status,
                'created_at': self.created_at.isoformat() if self.created_at else None}


class TrainingLog(db.Model):
    __tablename__ = 'training_logs'
    id = db.Column(db.Integer, primary_key=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'), nullable=False)
    model_type = db.Column(db.String(50), default='random_forest')
    accuracy_score = db.Column(db.Float)
    mae = db.Column(db.Float)
    rmse = db.Column(db.Float)
    r2_score = db.Column(db.Float)
    status = db.Column(db.String(20), default='pending')
    metrics = db.Column(db.Text)
    logs = db.Column(db.Text)
    model_path = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'dataset_id': self.dataset_id, 'model_type': self.model_type,
                'accuracy_score': self.accuracy_score, 'mae': self.mae, 'rmse': self.rmse,
                'r2_score': self.r2_score, 'status': self.status, 'metrics': self.metrics,
                'logs': self.logs, 'model_path': self.model_path,
                'created_at': self.created_at.isoformat() if self.created_at else None}


class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    __table_args__ = (db.UniqueConstraint('user_id', 'listing_id', name='unique_user_listing'),)
    user = db.relationship('User', backref='favorites', lazy=True)

    def to_dict(self):
        return {'id': self.id, 'user_id': self.user_id, 'listing_id': self.listing_id,
                'created_at': self.created_at.isoformat() if self.created_at else None}


with app.app_context():
    db.create_all()

# -------------------- HELPERS --------------------
def validate_email(email):
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email) is not None

def format_price(p):
    if not p: return 'N/A'
    if p >= 1000000: return f"{p / 1000000:.1f}M RWF"
    if p >= 1000: return f"{p / 1000:.0f}K RWF"
    return f"{p:,.0f} RWF"

def estimate_price(features):
    result = ml_predict(features)
    if result is None: return None

    seller_price = features.get('seller_price', 0)
    predicted_price = result['predicted_price']

    if seller_price > 0 and predicted_price > 0:
        diff_ratio = (seller_price - predicted_price) / predicted_price
        if diff_ratio > 0.3: status = 'Overpriced'
        elif diff_ratio < -0.3: status = 'Suspicious Undervaluation'
        elif abs(diff_ratio) <= 0.05: status = 'Fair Market Price'
        elif diff_ratio > 0: status = 'Slightly Overpriced'
        else: status = 'Slightly Underpriced'
    else:
        status = 'Fair Market Price'
        seller_price = predicted_price

    result['seller_price'] = seller_price
    result['status'] = status
    result['price_difference'] = seller_price - predicted_price
    return result

# -------------------- SEED DATA --------------------
def seed_database():
    if User.query.first():
        print('Database already seeded.')
        return

    users_data = [
        ('Admin User', 'admin@nyumbasense.com', 'admin123', 'admin'),
        ('Jean Pierre', 'seller@nyumbasense.com', 'seller123', 'seller'),
        ('Alice Mugisha', 'buyer@nyumbasense.com', 'buyer123', 'buyer'),
        ('Trainer User', 'trainer@nyumbasense.com', 'trainer123', 'trainer'),
    ]
    for name, email, pw, role in users_data:
        u = User(name=name, email=email, role=role)
        u.set_password(pw)
        db.session.add(u)
    db.session.commit()
    print('Users created')

    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rwanda_housing_2026.csv')
    if not os.path.exists(csv_path):
        from generate_data import generate
    if os.path.exists(csv_path):
        trainer = User.query.filter_by(email='trainer@nyumbasense.com').first()
        df = pd.read_csv(csv_path)
        ds = Dataset(trainer_id=trainer.id, filename='rwanda_housing_2026.csv',
                     original_filename='rwanda_housing_2026.csv', file_path=csv_path,
                     row_count=len(df), columns=','.join(df.columns), status='validated')
        db.session.add(ds)
        db.session.commit()

        result = ml_train()
        if result:
            ds.status = 'trained'
            log = TrainingLog(dataset_id=ds.id, model_type=result.get('model', 'xgboost'),
                             accuracy_score=result.get('r2', 0) * 100,
                             mae=result.get('mae'), rmse=result.get('rmse'),
                             r2_score=result.get('r2'), status='completed',
                             metrics=json.dumps(result),
                             logs=f"Training completed. R²={result['r2']:.4f}",
                             model_path='models/best_model.pkl')
            db.session.add(log)
            db.session.commit()
            print(f'Model trained: R² = {result["r2"]:.4f}')

    print('\nSeed Data Summary:')
    print('  Admin:   admin@nyumbasense.com / admin123')
    print('  Seller:  seller@nyumbasense.com / seller123')
    print('  Buyer:   buyer@nyumbasense.com / buyer123')
    print('  Trainer: trainer@nyumbasense.com / trainer123')

# -------------------- AUTH ROUTES --------------------
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data: return jsonify({'error': 'No data provided'}), 400
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'buyer')
    phone = data.get('phone', '')
    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400
    if not validate_email(email): return jsonify({'error': 'Invalid email format'}), 400
    if len(password) < 6: return jsonify({'error': 'Password must be at least 6 characters'}), 400
    if role not in ['admin', 'seller', 'buyer', 'trainer']: role = 'buyer'
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409
    user = User(name=name, email=email, role=role, phone=phone)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify({'message': 'User registered successfully', 'token': token, 'user': user.to_dict()}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data: return jsonify({'error': 'No data provided'}), 400
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    if not email or not password: return jsonify({'error': 'Email and password are required'}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
    if not user.is_active: return jsonify({'error': 'Account is deactivated'}), 403
    token = create_access_token(identity=str(user.id))
    return jsonify({'message': 'Login successful', 'token': token, 'user': user.to_dict()}), 200

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user = User.query.get(int(get_jwt_identity()))
    if not user: return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()}), 200

@app.route('/api/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user = User.query.get(int(get_jwt_identity()))
    if not user: return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    if 'name' in data: user.name = data['name'].strip()
    if 'phone' in data: user.phone = data['phone']
    db.session.commit()
    return jsonify({'message': 'Profile updated', 'user': user.to_dict()}), 200

@app.route('/api/auth/users', methods=['GET'])
@jwt_required()
def get_users():
    current = User.query.get(int(get_jwt_identity()))
    if not current or current.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    users = User.query.all()
    return jsonify({'users': [u.to_dict() for u in users]}), 200

@app.route('/api/auth/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current = User.query.get(int(get_jwt_identity()))
    if not current or current.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    user = User.query.get(user_id)
    if not user: return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    if 'role' in data: user.role = data['role']
    if 'is_active' in data: user.is_active = data['is_active']
    db.session.commit()
    return jsonify({'message': 'User updated', 'user': user.to_dict()}), 200

# -------------------- LISTINGS ROUTES --------------------
@app.route('/api/listings', methods=['GET'])
def get_listings():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    status = request.args.get('status')
    district = request.args.get('district')
    property_type = request.args.get('property_type')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    bedrooms = request.args.get('bedrooms', type=int)
    search = request.args.get('search')

    query = Listing.query
    if status: query = query.filter_by(status=status)
    else: query = query.filter_by(status='approved')
    if district: query = query.filter_by(district=district)
    if property_type: query = query.filter_by(property_type=property_type)
    if min_price is not None: query = query.filter(Listing.seller_price >= min_price)
    if max_price is not None: query = query.filter(Listing.seller_price <= max_price)
    if bedrooms: query = query.filter_by(bedrooms=bedrooms)
    if search:
        query = query.filter(Listing.title.ilike(f'%{search}%') |
                            Listing.location.ilike(f'%{search}%') |
                            Listing.description.ilike(f'%{search}%'))
    query = query.order_by(Listing.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({'listings': [l.to_dict() for l in pagination.items],
                    'total': pagination.total, 'pages': pagination.pages,
                    'current_page': page}), 200

@app.route('/api/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing: return jsonify({'error': 'Listing not found'}), 404
    listing.views = (listing.views or 0) + 1
    db.session.commit()
    return jsonify({'listing': listing.to_dict()}), 200

@app.route('/api/listings', methods=['POST'])
@jwt_required()
def create_listing():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data: return jsonify({'error': 'No data provided'}), 400
    required = ['title', 'location', 'district', 'bedrooms', 'bathrooms', 'square_feet', 'property_type', 'seller_price']
    missing = [f for f in required if f not in data]
    if missing: return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    listing = Listing(seller_id=user_id, title=data['title'],
        description=data.get('description', ''), location=data['location'],
        district=data['district'], bedrooms=int(data['bedrooms']),
        bathrooms=int(data['bathrooms']), square_feet=float(data['square_feet']),
        parking_spaces=int(data.get('parking_spaces', 0)),
        year_built=int(data.get('year_built', datetime.now().year)),
        property_type=data['property_type'],
        furnished=bool(data.get('furnished', False)),
        nearby_school=bool(data.get('nearby_school', False)),
        nearby_hospital=bool(data.get('nearby_hospital', False)),
        seller_price=float(data['seller_price']), images=data.get('images', ''),
        status='pending')

    pred_features = {'province': 'Kigali City', 'district': listing.district,
        'sector': listing.location, 'property_type': listing.property_type,
        'bedrooms': listing.bedrooms, 'bathrooms': listing.bathrooms,
        'square_meters': listing.square_feet / 10.764,
        'parking_spaces': listing.parking_spaces, 'year_built': listing.year_built,
        'furnished': 1 if listing.furnished else 0,
        'nearby_school': 1 if listing.nearby_school else 0,
        'nearby_hospital': 1 if listing.nearby_hospital else 0,
        'nearby_road': 1, 'security_level': 1, 'internet_access': 1,
        'market_demand': 1, 'house_condition': 1, 'land_size': listing.square_feet / 10.764 * 3,
        'seller_price': listing.seller_price}

    prediction = estimate_price(pred_features)
    if prediction:
        listing.estimated_price = prediction['predicted_price']
        listing.price_range_min = prediction['min_range']
        listing.price_range_max = prediction['max_range']
        listing.confidence_score = prediction['confidence']
        listing.price_status = prediction['status']
        if prediction['status'] in ['Overpriced', 'Suspicious Undervaluation']:
            listing.is_flagged = True

    db.session.add(listing)
    db.session.flush()

    if prediction:
        pred_rec = Prediction(user_id=user_id, listing_id=listing.id,
            predicted_price=prediction['predicted_price'], min_range=prediction['min_range'],
            max_range=prediction['max_range'], confidence=prediction['confidence'],
            status=prediction['status'], seller_price=listing.seller_price,
            price_difference=prediction.get('price_difference', 0))
        db.session.add(pred_rec)

    db.session.commit()
    return jsonify({'message': 'Listing created successfully', 'listing': listing.to_dict(),
                    'prediction': prediction}), 201

@app.route('/api/listings/<int:listing_id>', methods=['PUT'])
@jwt_required()
def update_listing(listing_id):
    user_id = int(get_jwt_identity())
    listing = Listing.query.get(listing_id)
    if not listing: return jsonify({'error': 'Listing not found'}), 404
    user = User.query.get(user_id)
    if listing.seller_id != user_id and user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    updatable = ['title', 'description', 'location', 'district', 'bedrooms', 'bathrooms',
                 'square_feet', 'parking_spaces', 'year_built', 'property_type', 'furnished',
                 'nearby_school', 'nearby_hospital', 'seller_price', 'status', 'images']
    for field in updatable:
        if field in data: setattr(listing, field, data[field])
    listing.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Listing updated', 'listing': listing.to_dict()}), 200

@app.route('/api/listings/<int:listing_id>', methods=['DELETE'])
@jwt_required()
def delete_listing(listing_id):
    user_id = int(get_jwt_identity())
    listing = Listing.query.get(listing_id)
    if not listing: return jsonify({'error': 'Listing not found'}), 404
    user = User.query.get(user_id)
    if listing.seller_id != user_id and user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    Favorite.query.filter_by(listing_id=listing_id).delete()
    Prediction.query.filter_by(listing_id=listing_id).delete()
    db.session.delete(listing)
    db.session.commit()
    return jsonify({'message': 'Listing deleted'}), 200

@app.route('/api/listings/<int:listing_id>/favorite', methods=['POST'])
@jwt_required()
def toggle_favorite(listing_id):
    user_id = int(get_jwt_identity())
    if not Listing.query.get(listing_id):
        return jsonify({'error': 'Listing not found'}), 404
    existing = Favorite.query.filter_by(user_id=user_id, listing_id=listing_id).first()
    if existing:
        db.session.delete(existing); db.session.commit()
        return jsonify({'message': 'Removed from favorites', 'favorited': False}), 200
    else:
        fav = Favorite(user_id=user_id, listing_id=listing_id)
        db.session.add(fav); db.session.commit()
        return jsonify({'message': 'Added to favorites', 'favorited': True}), 201

@app.route('/api/listings/my-listings', methods=['GET'])
@jwt_required()
def get_my_listings():
    user_id = int(get_jwt_identity())
    listings = Listing.query.filter_by(seller_id=user_id).order_by(Listing.created_at.desc()).all()
    return jsonify({'listings': [l.to_dict() for l in listings]}), 200

@app.route('/api/listings/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = int(get_jwt_identity())
    favs = Favorite.query.filter_by(user_id=user_id).all()
    ids = [f.listing_id for f in favs]
    listings = Listing.query.filter(Listing.id.in_(ids)).all() if ids else []
    return jsonify({'listings': [l.to_dict() for l in listings]}), 200

# -------------------- PREDICTION ROUTES --------------------
@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data: return jsonify({'error': 'No data provided'}), 400
    required = ['location', 'district', 'bedrooms', 'bathrooms', 'square_feet', 'property_type']
    missing = [f for f in required if f not in data]
    if missing: return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    features = {
        'province': data.get('province', 'Kigali City'),
        'district': data['district'], 'sector': data['location'],
        'property_type': data['property_type'],
        'bedrooms': int(data['bedrooms']), 'bathrooms': int(data['bathrooms']),
        'square_meters': float(data['square_feet']) / 10.764,
        'parking_spaces': int(data.get('parking_spaces', 0)),
        'year_built': int(data.get('year_built', 2020)),
        'furnished': 1 if data.get('furnished') else 0,
        'nearby_school': 1 if data.get('nearby_school') else 0,
        'nearby_hospital': 1 if data.get('nearby_hospital') else 0,
        'nearby_road': int(data.get('nearby_road', 1)),
        'security_level': int(data.get('security_level', 1)),
        'internet_access': int(data.get('internet_access', 1)),
        'market_demand': int(data.get('market_demand', 1)),
        'house_condition': int(data.get('house_condition', 1)),
        'land_size': float(data.get('land_size', float(data.get('square_feet', 1200)) / 10.764 * 3)),
        'seller_price': float(data.get('seller_price', 0)),
    }

    result = estimate_price(features)
    if result is None:
        return jsonify({'error': 'Model not trained yet. Please upload a dataset and train the model first.'}), 503

    listing_id = data.get('listing_id')
    if listing_id:
        pred = Prediction(user_id=user_id, listing_id=listing_id,
            predicted_price=result['predicted_price'], min_range=result['min_range'],
            max_range=result['max_range'], confidence=result['confidence'],
            status=result['status'], seller_price=result['seller_price'],
            price_difference=result.get('price_difference', 0))
        db.session.add(pred)
        db.session.commit()

    return jsonify(result), 200

@app.route('/api/predictions/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    user_id = int(get_jwt_identity())
    preds = Prediction.query.filter_by(user_id=user_id).order_by(Prediction.created_at.desc()).limit(50).all()
    return jsonify({'predictions': [p.to_dict() for p in preds]}), 200

@app.route('/api/predictions/stats', methods=['GET'])
@jwt_required()
def get_prediction_stats():
    current = User.query.get(int(get_jwt_identity()))
    if not current or current.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    total = Prediction.query.count()
    avg_conf = db.session.query(db.func.avg(Prediction.confidence)).scalar() or 0
    fair = Prediction.query.filter_by(status='Fair Market Price').count()
    over = Prediction.query.filter(Prediction.status.in_(['Overpriced', 'Slightly Overpriced'])).count()
    under = Prediction.query.filter_by(status='Suspicious Undervaluation').count()
    return jsonify({'total_predictions': total, 'avg_confidence': round(float(avg_conf), 2),
                    'fair_market': fair, 'overpriced': over, 'underpriced': under}), 200

# -------------------- DATASET & TRAINING ROUTES --------------------
@app.route('/api/dataset/upload', methods=['POST'])
@jwt_required()
def upload_dataset():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'trainer': return jsonify({'error': 'Only trainers can upload datasets'}), 403
    if 'file' not in request.files: return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    if file.filename == '': return jsonify({'error': 'No file selected'}), 400
    if not file.filename.endswith('.csv'): return jsonify({'error': 'Only CSV files are allowed'}), 400

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        os.remove(file_path)
        return jsonify({'error': f'Invalid CSV: {str(e)}'}), 400

    if len(df) < 50:
        os.remove(file_path)
        return jsonify({'error': f'Dataset too small. Need at least 50 rows, got {len(df)}'}), 400

    ds = Dataset(trainer_id=user_id, filename=filename, original_filename=file.filename,
                 file_path=file_path, row_count=len(df), columns=','.join(df.columns),
                 status='validated')
    db.session.add(ds)
    db.session.commit()

    return jsonify({'message': 'Dataset uploaded and validated successfully',
                    'dataset': ds.to_dict(), 'stats': {'rows': len(df), 'columns': list(df.columns)}}), 201

@app.route('/api/model/train', methods=['POST'])
@jwt_required()
def train_model():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'trainer': return jsonify({'error': 'Only trainers can train models'}), 403

    datasets = Dataset.query.filter_by(status='validated').order_by(Dataset.created_at.desc()).all()
    if not datasets: return jsonify({'error': 'No validated dataset found. Upload a dataset first.'}), 404

    ds = datasets[0]
    if not os.path.exists(ds.file_path):
        return jsonify({'error': 'Dataset file not found on disk'}), 404

    ds.status = 'training'
    db.session.commit()

    try:
        result = ml_train()
        log = TrainingLog(dataset_id=ds.id, model_type=result.get('model', 'xgboost'),
                         accuracy_score=result.get('r2', 0) * 100,
                         mae=result.get('mae'), rmse=result.get('rmse'),
                         r2_score=result.get('r2'), status='completed',
                         metrics=json.dumps(result),
                         logs=f"Training completed. R²={result.get('r2', 0):.4f}",
                         model_path='models/best_model.pkl')
        db.session.add(log)
        ds.status = 'trained'
        db.session.commit()
        return jsonify({'message': 'Model trained successfully', 'result': result, 'log': log.to_dict()}), 200
    except Exception as e:
        log = TrainingLog(dataset_id=ds.id, status='failed', logs=f"Training failed: {str(e)}")
        db.session.add(log)
        ds.status = 'failed'
        db.session.commit()
        return jsonify({'error': f'Training failed: {str(e)}'}), 500

@app.route('/api/model/metrics', methods=['GET'])
@jwt_required()
def get_model_metrics():
    log = TrainingLog.query.filter_by(status='completed').order_by(TrainingLog.created_at.desc()).first()
    if not log: return jsonify({'error': 'No trained model found'}), 404
    return jsonify({'metrics': log.to_dict()}), 200

@app.route('/api/model/history', methods=['GET'])
@jwt_required()
def get_training_history():
    logs = TrainingLog.query.order_by(TrainingLog.created_at.desc()).limit(20).all()
    return jsonify({'logs': [l.to_dict() for l in logs]}), 200

@app.route('/api/datasets', methods=['GET'])
@jwt_required()
def get_datasets():
    datasets = Dataset.query.order_by(Dataset.created_at.desc()).all()
    return jsonify({'datasets': [d.to_dict() for d in datasets]}), 200

@app.route('/api/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    current = User.query.get(int(get_jwt_identity()))
    if not current or current.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403

    total_listings = Listing.query.count()
    total_users = User.query.count()
    total_predictions = Prediction.query.count()
    pending_listings = Listing.query.filter_by(status='pending').count()
    flagged_listings = Listing.query.filter_by(is_flagged=True).count()
    avg_price = db.session.query(db.func.avg(Listing.seller_price)).scalar() or 0
    avg_confidence = db.session.query(db.func.avg(Prediction.confidence)).scalar() or 0
    by_type = db.session.query(Listing.property_type, db.func.count(Listing.id)).group_by(Listing.property_type).all()
    by_district = db.session.query(Listing.district, db.func.count(Listing.id), db.func.avg(Listing.seller_price)).group_by(Listing.district).all()

    return jsonify({'total_listings': total_listings, 'total_users': total_users,
        'total_predictions': total_predictions, 'pending_listings': pending_listings,
        'flagged_listings': flagged_listings, 'avg_price': float(avg_price),
        'avg_confidence': float(avg_confidence),
        'listings_by_type': [{'type': t, 'count': c} for t, c in by_type],
        'listings_by_district': [{'district': d, 'count': c, 'avg_price': float(p or 0)} for d, c, p in by_district]}), 200

if __name__ == '__main__':
    with app.app_context():
        seed_database()
    app.run(debug=True, host='0.0.0.0', port=5000)
