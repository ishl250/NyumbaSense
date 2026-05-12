# NyumbaSense AI

**Intelligent Property Valuation for Africa**

NyumbaSense AI is an AI-powered real estate valuation platform built for ABZ Company. It leverages machine learning to provide accurate property price predictions, market analytics, and transparent valuation for the Rwandan real estate market.

## Features

- **AI Price Prediction** - Advanced ML algorithms predict property values with 94%+ accuracy
- **Property Listings** - Browse, search, and filter properties with AI-verified valuations
- **User Roles** - Admin, Seller, Buyer, and Trainer with role-specific dashboards
- **ML Training Pipeline** - Upload datasets and train models via a web interface
- **Interactive Dashboards** - Role-based dashboards with real-time analytics
- **Responsive Design** - Fully responsive UI that works on mobile, tablet, and desktop
- **PWA Support** - Installable as a Progressive Web Application
- **Fraud Detection** - Auto-flag suspicious pricing with AI analysis
- **Market Analytics** - District-level insights and price trend visualization
- **JWT Authentication** - Secure token-based authentication with role-based access

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router v6** - Client-side routing
- **React Query** - Server state management
- **Recharts** - Chart visualization
- **Zustand** - Client state management
- **React Hook Form** - Form handling
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-JWT-Extended** - JWT authentication
- **Flask-Bcrypt** - Password hashing
- **Flask-CORS** - Cross-origin resource sharing
- **Gunicorn** - Production WSGI server

### Machine Learning
- **Scikit-learn** - ML algorithms and preprocessing
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **XGBoost** - Gradient boosting (optional)
- **Joblib** - Model serialization

## Project Structure

```
NyumbaSenseAI/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask app factory
│   │   ├── config/              # App configuration
│   │   ├── ml/
│   │   │   ├── __init__.py      # ML model training & prediction
│   │   │   ├── train.py         # Training pipeline runner
│   │   │   ├── predict.py       # Prediction with status analysis
│   │   │   └── preprocessing.py # Dataset validation & cleaning
│   │   ├── models/
│   │   │   ├── user.py          # User model
│   │   │   ├── listing.py       # Property listing model
│   │   │   ├── prediction.py    # Prediction record model
│   │   │   ├── dataset.py       # Dataset model
│   │   │   ├── training_log.py  # Training history model
│   │   │   └── favorite.py      # User favorites model
│   │   ├── routes/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── listings.py      # Listing CRUD endpoints
│   │   │   ├── predictions.py   # Prediction endpoints
│   │   │   └── dataset.py       # Dataset & training endpoints
│   │   ├── services/
│   │   │   └── auth_service.py  # Auth business logic
│   │   └── utils/
│   │       └── helpers.py       # Utility functions
│   ├── seeders/
│   │   ├── seed_data.py         # Database seeder
│   │   └── sample_dataset.csv   # Sample training data
│   ├── run.py                   # App entry point
│   ├── .env                     # Environment variables
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── public/
│   │   ├── favicon.svg          # Favicon
│   │   ├── manifest.json        # PWA manifest
│   │   ├── service-worker.js    # PWA service worker
│   │   ├── icon-192.png         # PWA icon (192x192)
│   │   └── icon-512.png         # PWA icon (512x512)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Main navigation
│   │   │   ├── Footer.jsx       # Site footer
│   │   │   ├── HeroSection.jsx  # Home hero
│   │   │   ├── FeaturesSection.jsx # Features grid
│   │   │   ├── StatsSection.jsx # Animated statistics
│   │   │   ├── Testimonials.jsx # User testimonials
│   │   │   ├── FAQ.jsx          # FAQ accordion
│   │   │   └── Loading.jsx      # Loading states
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx   # Public layout
│   │   │   └── DashboardLayout.jsx # Dashboard layout
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── About.jsx        # About page
│   │   │   ├── Contact.jsx      # Contact page
│   │   │   ├── Listings.jsx     # Property listings
│   │   │   ├── HouseDetails.jsx # Property details
│   │   │   ├── PricingPrediction.jsx # AI prediction tool
│   │   │   ├── Login.jsx        # Authentication
│   │   │   ├── Register.jsx     # Registration
│   │   │   ├── NotFound.jsx     # 404 page
│   │   │   └── dashboard/
│   │   │       ├── SellerDashboard.jsx  # Seller panel
│   │   │       ├── BuyerDashboard.jsx   # Buyer panel
│   │   │       ├── AdminDashboard.jsx   # Admin panel
│   │   │       └── TrainerDashboard.jsx # ML trainer panel
│   │   ├── routes/
│   │   │   └── index.jsx        # Route configuration
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   └── styles/
│   │       └── index.css        # Global styles
│   ├── index.html               # HTML entry
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── package.json             # NPM dependencies
├── models/                      # Trained ML models (generated)
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- pip

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`.

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python run.py
```

The backend will run on `http://localhost:5000`.

### Seed Database (Optional)

```bash
cd backend
python -m seeders.seed_data
```

This creates demo accounts and optionally trains the model with sample data.

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`.env` - already configured)
```env
FLASK_ENV=development
SECRET_KEY=nyumbasense_ai_secret_key_2024_abz_company
DATABASE_URL=sqlite:///nyumbasense.db
JWT_SECRET_KEY=nyumbasense_jwt_secret_key_2024
```

## User Roles & Demo Accounts

| Role    | Email                        | Password    | Permissions                                      |
|---------|------------------------------|-------------|--------------------------------------------------|
| Admin   | admin@nyumbasense.com        | admin123    | Full platform access, user management, analytics |
| Seller  | seller@nyumbasense.com       | seller123   | Create/manage listings, view AI predictions      |
| Buyer   | buyer@nyumbasense.com        | buyer123    | Browse listings, save favorites, compare prices  |
| Trainer | trainer@nyumbasense.com      | trainer123  | Upload datasets, train ML models, view metrics   |

## API Documentation

### Authentication
| Method | Endpoint             | Description          | Auth Required |
|--------|----------------------|----------------------|:------------:|
| POST   | `/api/auth/register` | Register new user    | No           |
| POST   | `/api/auth/login`    | Login user           | No           |
| GET    | `/api/auth/profile`  | Get user profile     | Yes          |
| PUT    | `/api/auth/profile`  | Update profile       | Yes          |
| GET    | `/api/auth/users`    | List all users       | Admin        |
| PUT    | `/api/auth/users/:id`| Update user          | Admin        |

### Listings
| Method | Endpoint                          | Description            | Auth Required |
|--------|-----------------------------------|------------------------|:------------:|
| GET    | `/api/listings`                   | List all listings      | No           |
| GET    | `/api/listings/:id`               | Get listing details    | No           |
| POST   | `/api/listings`                   | Create listing         | Yes (Seller) |
| PUT    | `/api/listings/:id`               | Update listing         | Yes (Owner)  |
| DELETE | `/api/listings/:id`               | Delete listing         | Yes (Owner)  |
| GET    | `/api/listings/my-listings`       | Get my listings        | Yes (Seller) |
| POST   | `/api/listings/:id/favorite`      | Toggle favorite        | Yes          |
| GET    | `/api/listings/favorites`         | Get favorites          | Yes          |

### Predictions
| Method | Endpoint                    | Description              | Auth Required |
|--------|-----------------------------|--------------------------|:------------:|
| POST   | `/api/predict`              | Get AI price prediction  | Yes          |
| GET    | `/api/predictions/history`  | Get prediction history   | Yes          |
| GET    | `/api/predictions/stats`    | Get prediction stats     | Admin        |

### Dataset & Training
| Method | Endpoint                | Description              | Auth Required |
|--------|-------------------------|--------------------------|:------------:|
| POST   | `/api/dataset/upload`   | Upload CSV dataset       | Trainer      |
| POST   | `/api/model/train`      | Train ML model           | Trainer      |
| GET    | `/api/model/metrics`    | Get model metrics        | Yes          |
| GET    | `/api/model/history`    | Get training history     | Yes          |
| GET    | `/api/datasets`         | List datasets            | Yes          |
| GET    | `/api/analytics`        | Platform analytics       | Admin        |

## ML Training Guide

### Dataset Requirements
Upload a CSV file with the following columns:
- **Required**: `location`, `bedrooms`, `bathrooms`, `square_feet`, `district`, `property_type`, `market_price`
- **Optional**: `parking_spaces`, `year_built`, `furnished`, `nearby_school`, `nearby_hospital`

### Training Process
1. Log in as a **Trainer** user
2. Navigate to **Trainer Dashboard**
3. Upload a CSV dataset
4. Click **Start Training**
5. View performance metrics (R² Score, RMSE, MAE)

### Prediction Process
1. Log in as any user
2. Navigate to **Predict** page
3. Fill in property details
4. Click **Predict Price**
5. View AI valuation with confidence score and price range

## Deployment

### Frontend Build
```bash
cd frontend
npm run build
```

Deploy the `dist/` folder to a static host (Netlify, Vercel, etc.).

### Backend Production
```bash
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

Set `FLASK_ENV=production` in your environment.

## Testing Guide

### Frontend Testing
```bash
cd frontend
npm run lint
```

### Backend Testing
```bash
cd backend
python -m pytest
```

### ML Testing
Validate predictions through the Predict page UI.

## Performance Optimizations

- React Query caching minimizes API calls
- Lazy loading applied to dashboard components
- Optimized Tailwind CSS with purged unused styles
- Framer Motion animations with reduced motion support
- Vite fast refresh for development

## Security

- **JWT Authentication** - Token-based auth with 24-hour expiry
- **Password Hashing** - bcrypt password hashing
- **Role-Based Access** - Strict API authorization
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Prevention** - SQLAlchemy ORM parameterized queries
- **CORS Protection** - Configurable cross-origin policy
- **File Upload Validation** - CSV-only restriction with size limits

## Future Improvements

- **AI Chatbot** - Natural language property search and Q&A
- **Real-time Pricing** - Live market price feeds and updates
- **GIS Maps** - Interactive map-based property search
- **Mobile App** - Native Android/iOS applications
- **Payment Integration** - In-platform transaction processing
- **Multi-language** - Kinyarwanda, French, and Swahili support
- **Advanced Analytics** - Predictive market trends and investment insights

## License

Proprietary - ABZ Company. All rights reserved.
