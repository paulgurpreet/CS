```
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score


# =========================================================
# 1. LOAD THE CSV FILE
# =========================================================

df = pd.read_csv("WheatYieldData.csv")

print("Column names:")
print(df.columns.tolist())


# =========================================================
# 2. SELECT YEAR AND YIELD
# =========================================================

data = df[["Year", "Value"]].copy()

# Convert columns to numbers
data["Year"] = pd.to_numeric(data["Year"], errors="coerce")
data["Value"] = pd.to_numeric(data["Value"], errors="coerce")

# Remove missing values
data = data.dropna()

# Sort by year
data = data.sort_values("Year")

# Reset row numbers
data = data.reset_index(drop=True)

print("\nFirst 5 rows:")
print(data.head())

print("\nLast 5 rows:")
print(data.tail())


# =========================================================
# 3. CREATE X AND Y
# =========================================================

# X = input/features
# y = target/output

X = data[["Year"]]
y = data["Value"]


# =========================================================
# 4. TRAIN-TEST SPLIT
# =========================================================

# Use the first 80% of the years for training
# and the last 20% for testing.

split_index = int(len(data) * 0.80)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

print("\nTraining years:")
print(X_train["Year"].min(), "to", X_train["Year"].max())

print("\nTesting years:")
print(X_test["Year"].min(), "to", X_test["Year"].max())


# =========================================================
# 5. TRAIN THE MODEL
# =========================================================

model = LinearRegression()

model.fit(X_train, y_train)

print("\nModel trained successfully!")


# =========================================================
# 6. PREDICT THE TEST DATA
# =========================================================

y_test_pred = model.predict(X_test)


# =========================================================
# 7. CALCULATE MSE, RMSE, MAE AND R²
# =========================================================

mse = mean_squared_error(y_test, y_test_pred)

rmse = np.sqrt(mse)

mae = mean_absolute_error(y_test, y_test_pred)

r2 = r2_score(y_test, y_test_pred)


print("\n==============================")
print("MODEL EVALUATION")
print("==============================")

print(f"MSE  : {mse:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"MAE  : {mae:.2f}")
print(f"R²   : {r2:.4f}")


# =========================================================
# 8. CREATE TEST PREDICTION TABLE
# =========================================================

test_results = pd.DataFrame({
    "Year": X_test["Year"].values,
    "Actual Yield": y_test.values,
    "Predicted Yield": y_test_pred
})

test_results["Error"] = (
    test_results["Actual Yield"]
    - test_results["Predicted Yield"]
)

print("\n==============================")
print("TEST PREDICTION TABLE")
print("==============================")

print(test_results.to_string(index=False))


# =========================================================
# 9. TRAIN FINAL MODEL USING ALL AVAILABLE DATA
# =========================================================

final_model = LinearRegression()

final_model.fit(X, y)


# =========================================================
# 10. PREDICT 2027, 2028 AND 2029
# =========================================================

future_years = pd.DataFrame({
    "Year": [2027, 2028, 2029]
})

future_predictions = final_model.predict(future_years)


# =========================================================
# 11. CREATE FUTURE PREDICTION TABLE
# =========================================================

prediction_table = pd.DataFrame({
    "Year": [2027, 2028, 2029],
    "Predicted Yield (kg/ha)": future_predictions
})

print("\n==============================")
print("FUTURE YIELD PREDICTIONS")
print("==============================")

print(prediction_table.to_string(index=False))


# =========================================================
# 12. SAVE PREDICTIONS TO CSV
# =========================================================

prediction_table.to_csv(
    "wheat_yield_predictions_2027_2029.csv",
    index=False
)

print("\nPrediction table saved as:")
print("wheat_yield_predictions_2027_2029.csv")


# =========================================================
# 13. PLOT ACTUAL DATA + REGRESSION + FUTURE PREDICTIONS
# =========================================================

plt.figure(figsize=(12, 6))

# Actual historical data
plt.scatter(
    data["Year"],
    data["Value"],
    color="blue",
    label="Actual Yield"
)

# Regression line for historical data
plt.plot(
    data["Year"],
    final_model.predict(X),
    color="red",
    linewidth=2,
    label="Linear Regression"
)

# Future predictions
plt.scatter(
    future_years["Year"],
    future_predictions,
    color="green",
    s=100,
    label="Future Predictions"
)

# Add labels to future predictions
for year, prediction in zip(
    future_years["Year"],
    future_predictions
):
    plt.annotate(
        f"{prediction:.1f}",
        (year, prediction),
        xytext=(5, 5),
        textcoords="offset points"
    )

plt.xlabel("Year")
plt.ylabel("Yield (kg/ha)")
plt.title("Wheat Yield Prediction using Linear Regression")

plt.legend()
plt.grid(True)

plt.show()

```
## OUTPUT -
<img width="1100" height="578" alt="1" src="https://github.com/user-attachments/assets/6eeab948-e7ca-4e46-8a04-df71d4b32b34" />

<img width="520" height="481" alt="2" src="https://github.com/user-attachments/assets/ddad76f8-df87-4b09-abed-e82569399fe3" />

<img width="1194" height="656" alt="3" src="https://github.com/user-attachments/assets/8c9e836f-834b-42a5-9b97-7efc6c1da022" />




