```
# Import required libraries

import pandas as pd
import matplotlib.pyplot as plt

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.tree import plot_tree
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


# Load Iris dataset

iris = load_iris()

X = iris.data
y = iris.target


# Display feature names and target names

print("Features:")
print(iris.feature_names)

print("\nTarget Classes:")
print(iris.target_names)


# Split dataset into training and testing data

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create Decision Tree model

model = DecisionTreeClassifier(
    criterion="entropy",
    random_state=42
)


# Train the model

model.fit(X_train, y_train)


# Make predictions

y_pred = model.predict(X_test)


# Calculate accuracy

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:", accuracy)


# Confusion Matrix

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# Classification Report

print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=iris.target_names
))


# Visualize the Decision Tree

plt.figure(figsize=(15, 10))

plot_tree(
    model,
    feature_names=iris.feature_names,
    class_names=iris.target_names,
    filled=True
)

plt.title("Decision Tree Classifier")
plt.show()


# Test a new flower

new_flower = [[5.1, 3.5, 1.4, 0.2]]

prediction = model.predict(new_flower)

print("\nPredicted Class:",
      iris.target_names[prediction[0]])

```
<img width="647" height="403" alt="image" src="https://github.com/user-attachments/assets/a7bbae68-1275-4a48-93bc-c8c1a78e6e2c" />

<img width="1358" height="848" alt="image" src="https://github.com/user-attachments/assets/2090a5b9-2e47-43c8-a600-31c3d62e042b" />
