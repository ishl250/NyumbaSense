import os, sys, json, joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder, StandardScaler

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "best_model.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "encoders.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
COLS_PATH = os.path.join(MODEL_DIR, "feature_cols.pkl")
EXTRA_PATH = os.path.join(MODEL_DIR, "extra_cols.pkl")
SCALER2_PATH = os.path.join(MODEL_DIR, "scaler_extra.pkl")

FEATURE_COLS = [
    "province", "district", "sector", "property_type",
    "bedrooms", "bathrooms", "square_meters", "parking_spaces",
    "year_built", "furnished", "nearby_school", "nearby_hospital",
    "nearby_road", "security_level", "internet_access",
    "market_demand", "house_condition", "land_size",
]

CAT_COLS = ["province", "district", "sector", "property_type"]

def add_features(df):
    df = df.copy()
    df["room_total"] = df["bedrooms"] + df["bathrooms"]
    df["sqm_per_bed"] = df["square_meters"] / (df["bedrooms"] + 1)
    df["amenities"] = df["furnished"] + df["nearby_school"] + df["nearby_hospital"] + df["nearby_road"] + (df["parking_spaces"] > 0).astype(int)
    df["quality_score"] = df["security_level"] + df["internet_access"] + df["market_demand"] + df["house_condition"]
    df["property_age"] = 2026 - df["year_built"]
    df["modern"] = (df["year_built"] >= 2018).astype(int)
    df["density"] = df["square_meters"] / (df["land_size"] + 1) * 100
    df["large_property"] = (df["square_meters"] > 150).astype(int)
    return df

EXTRA_COLS = ["room_total", "sqm_per_bed", "amenities", "quality_score", "property_age", "modern", "density", "large_property"]

def preprocess(df, fit=False, encoders=None, scaler=None, scaler2=None):
    df = add_features(df)
    df[CAT_COLS] = df[CAT_COLS].astype(str)
    for c in ["bedrooms","bathrooms","square_meters","parking_spaces","year_built",
              "furnished","nearby_school","nearby_hospital","nearby_road",
              "security_level","internet_access","market_demand","house_condition","land_size"]:
        df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0)

    if fit:
        encoders = {}
        for c in CAT_COLS:
            le = LabelEncoder()
            df[c] = le.fit_transform(df[c])
            encoders[c] = le
        X1 = df[FEATURE_COLS].values
        scaler = StandardScaler().fit(X1)
        X1 = scaler.transform(X1)
        X2 = df[EXTRA_COLS].values
        scaler2 = StandardScaler().fit(X2)
        X2 = scaler2.transform(X2)
        return np.hstack([X1, X2]), encoders, scaler, scaler2
    else:
        for c in CAT_COLS:
            known = set(encoders[c].classes_)
            df[c] = df[c].apply(lambda x: x if x in known else "unknown")
            if "unknown" not in encoders[c].classes_:
                encoders[c].classes_ = list(encoders[c].classes_) + ["unknown"]
            df[c] = encoders[c].transform(df[c])
        X1 = df[FEATURE_COLS].values
        X1 = scaler.transform(X1)
        X2 = df[EXTRA_COLS].values
        X2 = scaler2.transform(X2)
        return np.hstack([X1, X2])


def train():
    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rwanda_housing_2026.csv")
    if not os.path.exists(csv_path):
        print("Generating dataset first...")
        from generate_data import generate
        generate()

    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} rows")

    X, encoders, scaler, scaler2 = preprocess(df, fit=True)
    y = np.log1p(df["predicted_market_value"].values)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    from xgboost import XGBRegressor
    model_xgb = XGBRegressor(n_estimators=600, max_depth=10, learning_rate=0.06, subsample=0.8, colsample_bytree=0.8, random_state=42, n_jobs=-1)
    model_xgb.fit(X_train, y_train)
    y_pred_xgb = np.expm1(model_xgb.predict(X_test))
    y_act = np.expm1(y_test)
    r2_xgb = r2_score(y_act, y_pred_xgb)

    model_rf = RandomForestRegressor(n_estimators=500, max_depth=35, min_samples_split=3, min_samples_leaf=1, max_features="sqrt", random_state=42, n_jobs=-1)
    model_rf.fit(X_train, y_train)
    y_pred_rf = np.expm1(model_rf.predict(X_test))
    r2_rf = r2_score(y_act, y_pred_rf)

    print(f"XGBoost  R²: {r2_xgb:.4f}")
    print(f"RF       R²: {r2_rf:.4f}")

    if r2_xgb >= r2_rf:
        model = model_xgb
        best_name = "XGBoost"
        best_r2 = r2_xgb
        y_pred = y_pred_xgb
    else:
        model = model_rf
        best_name = "RandomForest"
        best_r2 = r2_rf
        y_pred = y_pred_rf

    mae = mean_absolute_error(y_act, y_pred)
    rmse = np.sqrt(mean_squared_error(y_act, y_pred))

    joblib.dump(model, MODEL_PATH)
    joblib.dump(encoders, ENCODER_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(scaler2, SCALER2_PATH)
    joblib.dump(FEATURE_COLS, COLS_PATH)
    joblib.dump(EXTRA_COLS, EXTRA_PATH)

    print(f"\nBest model: {best_name}")
    print(f"R² Score:   {best_r2:.4f}")
    print(f"Accuracy:   {best_r2 * 100:.2f}%")
    print(f"MAE:        {mae:,.0f} RWF")
    print(f"RMSE:       {rmse:,.0f} RWF")
    print(f"Saved to:   {MODEL_PATH}")
    return {"model": best_name, "r2": best_r2, "mae": mae, "rmse": rmse}

def predict(features):
    if not os.path.exists(MODEL_PATH):
        return None
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODER_PATH)
    scaler = joblib.load(SCALER_PATH)
    scaler2 = joblib.load(SCALER2_PATH)
    df = pd.DataFrame([features])
    X = preprocess(df, fit=False, encoders=encoders, scaler=scaler, scaler2=scaler2)

    if hasattr(model, "estimators_"):
        preds = np.array([t.predict(X)[0] for t in model.estimators_])
        pred = float(np.mean(preds))
        std = float(np.std(preds))
    else:
        pred = float(model.predict(X)[0])
        std = pred * 0.08

    price = float(np.expm1(pred))
    price = max(price, 0)

    confidence = max(0, min(99, 100 - (std / max(price, 1) * 100)))
    margin = max(std, price * 0.05) * 1.96
    min_r = max(0, price - margin)
    max_r = price + margin

    return {
        "predicted_price": round(price),
        "min_range": round(min_r),
        "max_range": round(max_r),
        "confidence": round(confidence, 1),
        "market_status": "Fair Market Value" if confidence > 75 else "Estimated Value",
    }

if __name__ == "__main__":
    train()
