

## Installation

### Prerequisites

Ensure you have Python (latest version )installed.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/opencv-python-repo.git
   cd opencv-python-repo
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Test the installation by running an example:

   ```bash
   python examples/image_processing/edge_detection.py
   ```

---

## Usage Examples

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


