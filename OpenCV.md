

## Installation

### Prerequisites

Ensure you have Python (latest version )installed.

### Steps
**OPEN POWERSHELL AND WRITE**

```
python --version
```
**to check if python is installed**

```
install opencv-contrib-python
```
**this will install opencv lib. with the contributions**

```
pip install caer
```
**Caer is a Python library that can be used with OpenCV to simplify computer vision and speed up workflows**


### Image Processing Example

```python
import cv2

# Load an image
image = cv2.imread('data/sample_image.jpg')

# Convert to grayscale
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Display the image
cv2.imshow('Grayscale Image', gray_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

### Video Capture Example

```python
import cv2

# Open the webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Display the frame
    cv2.imshow('Webcam', frame)

    # Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```


