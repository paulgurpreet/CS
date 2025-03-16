## Program 1
Write a program to compute the sum of the first n terms of the following series:
□ = 1 - 1/2^2 + 1/3^3 .......
The number of terms n is to be taken from the user through the command line. If the
command line argument is not found then prompt the user to enter the value of n
```
#include <iostream>
#include <cmath>

using namespace std;

double computeSeries(int n) {
    double sum = 1.0;  // First term is always 1

    for (int i = 2; i <= n; i++) {
        double term = 1.0 / pow(i, i);
        if (i % 2 == 0) {
            term = -term;  // Make even-indexed terms negative
        }
        sum += term;
    }

    return sum;
}

int main() {
    int n;
    cout << "Enter the number of terms: ";
    cin >> n;

    double result = computeSeries(n);
    cout << "Sum of the series: " << result << endl;

    return 0;
}
```
![n1](https://github.com/user-attachments/assets/3548ec55-18e5-45f4-b2f3-ba6f9b8d2d3c)

## Program 2
Write a program to remove the duplicates from an array
```
#include <iostream>

using namespace std;

// Function to remove duplicates from an array
int removeDuplicates(int arr[], int n) {
    int uniqueCount = 0;

    for (int i = 0; i < n; i++) {
        bool isDuplicate = false;

        // Check if arr[i] is already in the unique part of the array
        for (int j = 0; j < uniqueCount; j++) {
            if (arr[i] == arr[j]) {
                isDuplicate = true;
                break;
            }
        }

        // If not a duplicate, add it to the unique section
        if (!isDuplicate) {
            arr[uniqueCount] = arr[i];
            uniqueCount++;
        }
    }

    return uniqueCount;  // Return new size of array
}

int main() {
    int n;
    cout << "Enter the size of the array: ";
    cin >> n;

    int arr[n];
    cout << "Enter " << n << " elements: ";
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    int newSize = removeDuplicates(arr, n);

    cout << "Array after removing duplicates: ";
    for (int i = 0; i < newSize; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;

    return 0;
}
```
![n2](https://github.com/user-attachments/assets/331c41d4-27a5-413e-9545-7b380b7ac585)

## Program 3 
Write a program that prints a table indicating the number of occurrences of each
alphabet in the text entered as command line arguments
```
#include <iostream>
#include <map>

using namespace std;

void countCharacters(string text) {
    map<char, int> freq;
    for (char c : text) {
        freq[c]++;
    }
    for (auto pair : freq) {
        cout << pair.first << ": " << pair.second << endl;
    }
}

int main(int argc, char* argv[]) {
    if (argc > 1) {
        countCharacters(argv[1]);
    } else {
        string text;
        cout << "Enter text: ";
        cin >> text;
        countCharacters(text);
    }
    return 0;
}
```
![n3](https://github.com/user-attachments/assets/01cf7e25-0704-4449-990a-30ae90d5c3d1)

## Program 4
Write a menu driven program to perform string manipulation (without using inbuilt
string functions):
a. Show address of each character in string
b. Concatenate two strings.
c. Compare two strings
d. Calculate length of the string (use pointers)
e. Convert all lowercase characters to uppercase
f. Reverse the string
g. Insert a string in another string at a user specified position
```
#include <iostream>

using namespace std;

// Function to display the address of each character in the string
void showAddress(char* str) {
    cout << "Character addresses:\n";
    for (int i = 0; str[i] != '\0'; i++) {
        cout << str[i] << " -> " << (void*)&str[i] << endl;
    }
}

// Function to concatenate two strings
void concatenate(char* str1, char* str2, char* result) {
    int i = 0, j = 0;

    // Copy first string
    while (str1[i] != '\0') {
        result[i] = str1[i];
        i++;
    }

    // Copy second string
    while (str2[j] != '\0') {
        result[i] = str2[j];
        i++; j++;
    }
    
    result[i] = '\0'; // Null-terminate the result
}

// Function to compare two strings
bool compare(char* str1, char* str2) {
    int i = 0;
    while (str1[i] != '\0' && str2[i] != '\0') {
        if (str1[i] != str2[i])
            return false;
        i++;
    }
    return str1[i] == str2[i]; // Ensure both strings end together
}

// Function to find length of a string (using pointers)
int length(char* str) {
    int len = 0;
    while (*str != '\0') {
        len++;
        str++;
    }
    return len;
}

// Function to convert lowercase to uppercase
void toUppercase(char* str) {
    for (int i = 0; str[i] != '\0'; i++) {
        if (str[i] >= 'a' && str[i] <= 'z') {
            str[i] = str[i] - 32;
        }
    }
}

// Function to reverse a string
void reverse(char* str) {
    int len = length(str);
    for (int i = 0; i < len / 2; i++) {
        char temp = str[i];
        str[i] = str[len - i - 1];
        str[len - i - 1] = temp;
    }
}

// Function to insert a string into another at a given position
void insertString(char* str1, char* str2, int pos, char* result) {
    int i = 0, j = 0, k = 0;
    int len1 = length(str1), len2 = length(str2);

    if (pos > len1) pos = len1; // If position is out of bounds, insert at end

    // Copy first part of str1
    while (i < pos) {
        result[k++] = str1[i++];
    }

    // Insert str2
    while (str2[j] != '\0') {
        result[k++] = str2[j++];
    }

    // Copy remaining part of str1
    while (str1[i] != '\0') {
        result[k++] = str1[i++];
    }

    result[k] = '\0'; // Null terminate
}

int main() {
    char str1[100], str2[100], result[200];

    cout << "Enter first string: ";
    cin.getline(str1, 100);
    cout << "Enter second string: ";
    cin.getline(str2, 100);

    // 1. Show address of each character
    showAddress(str1);

    // 2. Concatenate two strings
    concatenate(str1, str2, result);
    cout << "Concatenated string: " << result << endl;

    // 3. Compare two strings
    if (compare(str1, str2))
        cout << "Strings are equal.\n";
    else
        cout << "Strings are different.\n";

    // 4. Calculate string length
    cout << "Length of first string: " << length(str1) << endl;

    // 5. Convert lowercase to uppercase
    toUppercase(str1);
    cout << "Uppercase string: " << str1 << endl;
    // 6. Insert one string into another
    int pos;
    cout << "Enter position to insert second string into first: ";
    cin >> pos;
    insertString(str1, str2, pos, result);
    cout << "String after insertion: " << result << endl;

    // 7. Reverse the string
    reverse(str1);
    cout << "Reversed string: " << str1 << endl;



    return 0;
}
```
![n4](https://github.com/user-attachments/assets/f93e596a-54a5-46d9-abb4-bdf595392e66)

## Program 5
Write a program to merge two ordered arrays to get a single ordered array.
```
#include <iostream>

using namespace std;

// Function to merge two sorted arrays
void mergeArrays(int arr1[], int size1, int arr2[], int size2, int merged[]) {
    int i = 0, j = 0, k = 0;

    // Merge elements from both arrays in sorted order
    while (i < size1 && j < size2) {
        if (arr1[i] < arr2[j]) {
            merged[k++] = arr1[i++];
        } else {
            merged[k++] = arr2[j++];
        }
    }

    // Copy remaining elements of arr1
    while (i < size1) {
        merged[k++] = arr1[i++];
    }

    // Copy remaining elements of arr2
    while (j < size2) {
        merged[k++] = arr2[j++];
    }
}

int main() {
    int size1, size2;

    // Input first sorted array
    cout << "Enter the size of first sorted array: ";
    cin >> size1;
    int arr1[size1];

    cout << "Enter " << size1 << " sorted elements: ";
    for (int i = 0; i < size1; i++) {
        cin >> arr1[i];
    }

    // Input second sorted array
    cout << "Enter the size of second sorted array: ";
    cin >> size2;
    int arr2[size2];

    cout << "Enter " << size2 << " sorted elements: ";
    for (int i = 0; i < size2; i++) {
        cin >> arr2[i];
    }

    int merged[size1 + size2]; // Array to store merged result

    // Merge the arrays
    mergeArrays(arr1, size1, arr2, size2, merged);

    // Display the merged sorted array
    cout << "Merged sorted array: ";
    for (int i = 0; i < size1 + size2; i++) {
        cout << merged[i] << " ";
    }
    cout << endl;

    return 0;
}
```
![n5](https://github.com/user-attachments/assets/4ce66c4d-dcf1-4265-93ac-45917e0cf9ae)

## Program 6
Write a program to search a given element in a set of N numbers using Binary search
(i) with recursion (ii) without recursion.
```
#include <iostream>

using namespace std;

// Recursive Binary Search
int binarySearchRecursive(int arr[], int left, int right, int key) {
    if (left > right)
        return -1; // Not found

    int mid = left + (right - left) / 2;
    
    if (arr[mid] == key)
        return mid;
    else if (arr[mid] > key)
        return binarySearchRecursive(arr, left, mid - 1, key);
    else
        return binarySearchRecursive(arr, mid + 1, right, key);
}

// Iterative Binary Search
int binarySearchIterative(int arr[], int size, int key) {
    int left = 0, right = size - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == key)
            return mid;
        else if (arr[mid] > key)
            right = mid - 1;
        else
            left = mid + 1;
    }
    return -1; // Not found
}

int main() {
    int size, key;
    cout << "Enter the size of sorted array: ";
    cin >> size;
    int arr[size];

    cout << "Enter " << size << " sorted elements: ";
    for (int i = 0; i < size; i++) {
        cin >> arr[i];
    }

    cout << "Enter the element to search: ";
    cin >> key;

    int resultRecursive = binarySearchRecursive(arr, 0, size - 1, key);
    int resultIterative = binarySearchIterative(arr, size, key);

    if (resultRecursive != -1)
        cout << "Element found at index (Recursive): " << resultRecursive << endl;
    else
        cout << "Element not found (Recursive).\n";

    if (resultIterative != -1)
        cout << "Element found at index (Iterative): " << resultIterative << endl;
    else
        cout << "Element not found (Iterative).\n";

    return 0;
}
```
![n6](https://github.com/user-attachments/assets/3126c1a6-d4b8-4548-a3e2-325f237cc4ba)

## Program 7
Write a program to calculate GCD of two numbers (i) with recursion (ii) without
recursion
```
#include <iostream>

using namespace std;

// Recursive GCD
int gcdRecursive(int a, int b) {
    return (b == 0) ? a : gcdRecursive(b, a % b);
}

// Iterative GCD
int gcdIterative(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int main() {
    int a, b;
    cout << "Enter two numbers: ";
    cin >> a >> b;

    cout << "GCD (Recursive): " << gcdRecursive(a, b) << endl;
    cout << "GCD (Iterative): " << gcdIterative(a, b) << endl;

    return 0;
}
```
![n7](https://github.com/user-attachments/assets/bff8553b-abf7-4f13-b16d-c01c457bdf6a)

## Program 8
Create a Matrix class. Write a menu-driven program to perform following Matrix
operations (exceptions should be thrown by the functions if matrices passed to them
are incompatible and handled by the main() function):
a. Sum
b. Product
c. Transpose
```
#include <iostream>

using namespace std;

class Matrix {
public:
    int mat[10][10], rows, cols;

    void input() {
        cout << "Enter rows and columns: ";
        cin >> rows >> cols;
        cout << "Enter elements:\n";
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                cin >> mat[i][j];
            }
        }
    }

    void display() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                cout << mat[i][j] << " ";
            }
            cout << endl;
        }
    }

    Matrix add(Matrix m) {
        Matrix res;
        if (rows != m.rows || cols != m.cols) {
            cout << "Addition not possible!\n";
            return res;
        }
        res.rows = rows;
        res.cols = cols;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                res.mat[i][j] = mat[i][j] + m.mat[i][j];
            }
        }
        return res;
    }

    Matrix multiply(Matrix m) {
        Matrix res;
        if (cols != m.rows) {
            cout << "Multiplication not possible!\n";
            return res;
        }
        res.rows = rows;
        res.cols = m.cols;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < m.cols; j++) {
                res.mat[i][j] = 0;
                for (int k = 0; k < cols; k++) {
                    res.mat[i][j] += mat[i][k] * m.mat[k][j];
                }
            }
        }
        return res;
    }

    Matrix transpose() {
        Matrix res;
        res.rows = cols;
        res.cols = rows;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                res.mat[j][i] = mat[i][j];
            }
        }
        return res;
    }
};

int main() {
    Matrix A, B, result;

    cout << "Enter first matrix:\n";
    A.input();

    cout << "Enter second matrix:\n";
    B.input();

    result = A.add(B);
    cout << "Sum of matrices:\n";
    result.display();

    result = A.multiply(B);
    cout << "Product of matrices:\n";
    result.display();

    result = A.transpose();
    cout << "Transpose of first matrix:\n";
    result.display();

    return 0;
}
```
![n8](https://github.com/user-attachments/assets/62bd751e-0315-4f2e-97a7-cd56ddaba401)

## Program 9
Define a class Person having name as a data member. Inherit two classes Student and
Employee from Person. Student has additional attributes as course, marks and year
and Employee has department and salary. Write display() method in all the three
classes to display the corresponding attributes. Provide the necessary methods to show
runtime polymorphism
```
#include <iostream>
#include <string>

using namespace std;

// Base class
class Person {
protected:
    string name;
public:
    void setPersonDetails() {
        cout << "Enter Name: ";
        getline(cin, name);
    }

    virtual void display() {
        cout << "Name: " << name << endl;
    }

    virtual ~Person() {} // Virtual destructor
};

// Derived class: Student
class Student : public Person {
private:
    string course;
    int marks;
    int year;
public:
    void setStudentDetails() {
        setPersonDetails(); // Set name from base class
        cout << "Enter Course: ";
        getline(cin, course);
        cout << "Enter Marks: ";
        cin >> marks;
        cout << "Enter Year: ";
        cin >> year;
        cin.ignore(); // Ignore newline character after numeric input
    }

    void display() override {
        cout << "\nStudent Details:" << endl;
        cout << "Student Name: " << name << endl;
        cout << "Course: " << course << endl;
        cout << "Marks: " << marks << endl;
        cout << "Year: " << year << endl;
    }
};

// Derived class: Employee
class Employee : public Person {
private:
    string department;
    double salary;
public:
    void setEmployeeDetails() {
        setPersonDetails(); // Set name from base class
        cout << "Enter Department: ";
        getline(cin, department);
        cout << "Enter Salary: ";
        cin >> salary;
        cin.ignore(); // Ignore newline character after numeric input
    }

    void display() override {
        cout << "\nEmployee Details:" << endl;
        cout << "Employee Name: " << name << endl;
        cout << "Department: " << department << endl;
        cout << "Salary: " << salary << endl;
    }
};

int main() {
    Person* p1 = new Student();
    Person* p2 = new Employee();

    cout << "Enter Student Details:" << endl;
    static_cast<Student*>(p1)->setStudentDetails();

    cout << "\nEnter Employee Details:" << endl;
    static_cast<Employee*>(p2)->setEmployeeDetails();

    // Display details
    p1->display();
    p2->display();

    // Cleanup
    delete p1;
    delete p2;

    return 0;
}
```
![n9](https://github.com/user-attachments/assets/9ef1bad3-6e7a-4bdf-82e9-53b5de1a2fc0)

## Program 10
Create a Triangle class. Add exception handling statements to ensure the following
conditions: all sides are greater than 0 and sum of any two sides are greater than the
third side. The class should also have overloaded functions for calculating the area
of a right angled triangle as well as using Heron's formula to calculate the area of any
type of triangle
```
#include <iostream>
#include <cmath>
#include <stdexcept>

using namespace std;

class Triangle {
private:
    double a, b, c;

public:
    // Constructor with validation
    Triangle(double side1, double side2, double side3) {
        if (side1 <= 0 || side2 <= 0 || side3 <= 0)
            throw invalid_argument("Sides must be greater than zero.");
        if (side1 + side2 <= side3 || side1 + side3 <= side2 || side2 + side3 <= side1)
            throw invalid_argument("Sum of any two sides must be greater than the third side.");

        a = side1;
        b = side2;
        c = side3;
    }

    // Function to calculate area using Heron's formula
    double calculateArea() {
        double s = (a + b + c) / 2; // Semi-perimeter
        return sqrt(s * (s - a) * (s - b) * (s - c));
    }

    // Overloaded function to calculate area of a right-angled triangle
    static double calculateArea(double base, double height) {
        if (base <= 0 || height <= 0)
            throw invalid_argument("Base and height must be greater than zero.");
        return 0.5 * base * height;
    }

    // Display function
    void display() {
        cout << "Triangle sides: " << a << ", " << b << ", " << c << endl;
        cout << "Area using Heron's formula: " << calculateArea() << endl;
    }
};

int main() {
    try {
        // User input for any triangle
        double x, y, z;
        cout << "Enter three sides of the triangle: ";
        cin >> x >> y >> z;

        Triangle t(x, y, z);
        t.display();

        // User input for right-angled triangle
        double base, height;
        cout << "\nEnter base and height of right-angled triangle: ";
        cin >> base >> height;

        cout << "Area of right-angled triangle: " << Triangle::calculateArea(base, height) << endl;
    }
    catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
    }

    return 0;
}
```
![n10](https://github.com/user-attachments/assets/3bedad47-0816-477f-9d7e-17ab613b4906)

## Program 11
Create a class Student containing fields for Roll No., Name, Class, Year and Total
Marks. Write a program to store 5 objects of Student class in a file. Retrieve these
records from the file and display them
```
#include <iostream>
#include <fstream>

using namespace std;

class Student {
private:
    int rollNo;
    string name;
    string studentClass;
    int year;
    float totalMarks;

public:
    // Constructor to initialize student details
    Student(int r, string n, string c, int y, float marks) 
        : rollNo(r), name(n), studentClass(c), year(y), totalMarks(marks) {}

    // Default constructor for file reading
    Student() {}

    // Function to display student details
    void displayStudentDetails() {
        cout << "\nRoll No.: " << rollNo;
        cout << "\nName: " << name;
        cout << "\nClass: " << studentClass;
        cout << "\nYear: " << year;
        cout << "\nTotal Marks: " << totalMarks << "\n";
    }

    // Function to write student data to a file
    void writeToFile(ofstream &outFile) {
        outFile.write(reinterpret_cast<char*>(this), sizeof(*this));
    }

    // Function to read student data from a file
    void readFromFile(ifstream &inFile) {
        inFile.read(reinterpret_cast<char*>(this), sizeof(*this));
    }
};

int main() {
    const string filename = "students.dat";

    // Predefined student records
    Student students[5] = {
        {101, "Alice", "12A", 2024, 450.5},
        {102, "Bob", "12B", 2024, 480.0},
        {103, "Charlie", "12A", 2024, 470.0},
        {104, "David", "12C", 2024, 460.0},
        {105, "Eve", "12B", 2024, 490.5}
    };

    // Writing student records to the file
    ofstream outFile(filename, ios::binary);
    if (!outFile) {
        cerr << "Error opening file for writing!" << endl;
        return 1;
    }

    for (int i = 0; i < 5; ++i) {
        students[i].writeToFile(outFile);
    }
    outFile.close();

    // Reading student records from the file
    ifstream inFile(filename, ios::binary);
    if (!inFile) {
        cerr << "Error opening file for reading!" << endl;
        return 1;
    }

    cout << "\nRetrieving Student Records from File:\n";
    Student temp;
    while (inFile.read(reinterpret_cast<char*>(&temp), sizeof(temp))) {
        temp.displayStudentDetails();
        cout << "---------------------------\n";
    }
    inFile.close();

    return 0;
}
```
![n11](https://github.com/user-attachments/assets/05a556ca-7f52-45e2-a183-50dd8d8507c1)

## Program 12
Copy the contents of one text file to another file, after removing all whitespaces
```
#include <iostream>
#include <fstream>
#include <cctype>

using namespace std;

void removeWhitespacesAndCopy(const string &sourceFile, const string &destinationFile) {
    ifstream inFile(sourceFile);
    ofstream outFile(destinationFile);

    if (!inFile) {
        cerr << "Error opening source file!" << endl;
        return;
    }
    if (!outFile) {
        cerr << "Error creating destination file!" << endl;
        return;
    }

    char ch;
    while (inFile.get(ch)) {
        if (!isspace(ch)) { // Check if the character is NOT a whitespace
            outFile.put(ch);
        }
    }

    cout << "File copied successfully without whitespaces.\n";

    inFile.close();
    outFile.close();
}

int main() {
    string sourceFile, destinationFile;
    
    cout << "Enter source file name: ";
    cin >> sourceFile;
    cout << "Enter destination file name: ";
    cin >> destinationFile;

    removeWhitespacesAndCopy(sourceFile, destinationFile);

    return 0;
}
```
![n12](https://github.com/user-attachments/assets/33690bfa-ceb0-4513-a360-fa5225b98af8)













