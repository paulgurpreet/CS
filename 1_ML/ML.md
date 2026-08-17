```
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score



df = pd.read_csv("WheatData.csv")

print("Column names:")
print(df.columns.tolist())


data = df[["Year", "Value"]].copy()

data["Year"] = pd.to_numeric(data["Year"], errors="coerce")
data["Value"] = pd.to_numeric(data["Value"], errors="coerce")

data = data.dropna()

data = data.sort_values("Year")

data = data.reset_index(drop=True)

print("\nFirst 5 rows:")
print(data.head())

print("\nLast 5 rows:")
print(data.tail())

X = data[["Year"]]
y = data["Value"]


split_index = int(len(data) * 0.80)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

print("\nTraining years:")
print(X_train["Year"].min(), "to", X_train["Year"].max())

print("\nTesting years:")
print(X_test["Year"].min(), "to", X_test["Year"].max())



linear_model = LinearRegression()

linear_model.fit(X_train, y_train)

print("\nLinear Regression trained successfully!")



#  LINEAR PREDICTION


linear_test_pred = linear_model.predict(X_test)


#  LINEAR MODEL EVALUATION


linear_mse = mean_squared_error(y_test, linear_test_pred)

linear_rmse = np.sqrt(linear_mse)

linear_mae = mean_absolute_error(y_test, linear_test_pred)

linear_r2 = r2_score(y_test, linear_test_pred)


print("\n==============================")
print("LINEAR REGRESSION")
print("==============================")

print(f"MSE  : {linear_mse:.2f}")
print(f"RMSE : {linear_rmse:.2f}")
print(f"MAE  : {linear_mae:.2f}")
print(f"R²   : {linear_r2:.4f}")


# POLYNOMIAL REGRESSION

# Degree 2 polynomial
poly = PolynomialFeatures(degree=2)

X_train_poly = poly.fit_transform(X_train)

X_test_poly = poly.transform(X_test)

poly_model = LinearRegression()

poly_model.fit(X_train_poly, y_train)

print("\nPolynomial Regression trained successfully!")


#  POLYNOMIAL PREDICTION

poly_test_pred = poly_model.predict(X_test_poly)


#  POLYNOMIAL MODEL EVALUATION

poly_mse = mean_squared_error(y_test, poly_test_pred)

poly_rmse = np.sqrt(poly_mse)

poly_mae = mean_absolute_error(y_test, poly_test_pred)

poly_r2 = r2_score(y_test, poly_test_pred)


print("\n==============================")
print("POLYNOMIAL REGRESSION")
print("==============================")

print(f"MSE  : {poly_mse:.2f}")
print(f"RMSE : {poly_rmse:.2f}")
print(f"MAE  : {poly_mae:.2f}")
print(f"R²   : {poly_r2:.4f}")


#  TEST PREDICTION TABLE

test_results = pd.DataFrame({
    "Year": X_test["Year"].values,
    "Actual Yield": y_test.values,
    "Linear Prediction": linear_test_pred,
    "Polynomial Prediction": poly_test_pred
})

print("\n==============================")
print("TEST PREDICTION TABLE")
print("==============================")

print(test_results.to_string(index=False))


#  TRAIN FINAL LINEAR MODEL

final_linear_model = LinearRegression()

final_linear_model.fit(X, y)


# TRAIN FINAL POLYNOMIAL MODEL

final_poly = PolynomialFeatures(degree=2)

X_poly = final_poly.fit_transform(X)

final_poly_model = LinearRegression()

final_poly_model.fit(X_poly, y)


#  FUTURE YEARS

future_years = pd.DataFrame({
    "Year": [2027, 2028, 2029, 2030]
})


#  LINEAR FUTURE PREDICTIONS

linear_future_predictions = final_linear_model.predict(
    future_years
)


#  POLYNOMIAL FUTURE PREDICTIONS

future_years_poly = final_poly.transform(
    future_years
)

poly_future_predictions = final_poly_model.predict(
    future_years_poly
)


#  FUTURE PREDICTION TABLE

prediction_table = pd.DataFrame({
    "Year": [2027, 2028, 2029, 2030],

    "Linear Yield (kg/ha)": linear_future_predictions,

    "Polynomial Yield (kg/ha)": poly_future_predictions
})

print("\n==============================")
print("FUTURE YIELD PREDICTIONS")
print("==============================")

print(prediction_table.to_string(index=False))


#  SAVE PREDICTIONS

prediction_table.to_csv(
    "wheat_yield_predictions_2027_2030.csv",
    index=False
)

print("\nPrediction table saved as:")
print("wheat_yield_predictions_2027_2030.csv")


# PLOT

plt.figure(figsize=(12, 6))

# Actual data
plt.scatter(
    data["Year"],
    data["Value"],
    color="blue",
    label="Actual Yield"
)

# Linear regression line
plt.plot(
    data["Year"],
    final_linear_model.predict(X),
    color="red",
    linewidth=2,
    label="Linear Regression"
)

# Polynomial regression line
plt.plot(
    data["Year"],
    final_poly_model.predict(X_poly),
    color="orange",
    linewidth=2,
    label="Polynomial Regression"
)

# Future linear predictions
plt.scatter(
    future_years["Year"],
    linear_future_predictions,
    color="green",
    s=100,
    label="Linear Future Prediction"
)

# Future polynomial predictions
plt.scatter(
    future_years["Year"],
    poly_future_predictions,
    color="purple",
    s=100,
    label="Polynomial Future Prediction"
)

plt.xlabel("Year")

plt.ylabel("Yield (kg/ha)")

plt.title("Wheat Yield Prediction")

plt.legend()

plt.grid(True)

plt.show()
```
