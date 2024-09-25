# WHAT IS PYTHON?
Python is a popular, high-level programming language known for its simplicity and readability. Python’s syntax is designed to be easy to understand and write, making it a great choice for beginners. It is also versatile and can be used for a wide variety of tasks, including web development, data analysis, machine learning, and scientific computing.

# Basic Concepts of Python:-
#•*Variable* 
In Python, a variable is a container for storing a value. You can create a variable by assigning a value to it using the “=” operator. The value can be of any data type, such as a string, integer, or floating-point number. Once a variable is assigned a value, it can be used throughout your program.
For example:

x = 5
y = “Hello”
z = 3.14

In this example, x is assigned the value of 5, y is assigned the value “Hello”, and z is assigned the value 3.14.

# •Data Types
Python has several built-in data types, including strings, integers, and floating-point numbers. In Python, data types refer to the type of value a variable holds. Python has several built-in data types:

1.Numbers: This includes integers (e.g. 1, 2, 3) and floating-point numbers (e.g. 3.14, 1.23)

2.Strings: A string is a sequence of characters (e.g. “hello”, “world”). Strings can be enclosed in single or double quotes

3.Lists: A list is a collection of items that are ordered and changeable. Lists are written with square brackets and items are separated by commas.

4.Tuples: A tuple is similar to a list, but it’s immutable (i.e. its items cannot be changed). Tuples are written with round brackets and items are separated by commas.

5.Dictionaries: A dictionary is a collection of key-value pairs. Dictionaries are written with curly braces and keys and values are separated by colons.

6.Boolean: A Boolean data type is either True or False.

7.None: None is a special constant used to represent the absence of a value or a null value.


# *Operators*
Python supports various operators for performing mathematical and logical operations, such as +, -, *, /, and %. In Python, operators are special symbols that perform specific operations on one or more operands (i.e. the variables or values being operated on). There are operators of python:-

1. Arithmetic operators:
These operators perform basic mathematical operations, such as addition (+), subtraction (-), multiplication (*), division (/), and modulus (%).

2. Comparison operators:
These operators compare two values and return a Boolean value (True or False) based on the comparison. Examples include equal to (==), not equal to (!=), greater than (>), less than (<), greater than or equal to (>=), and less than or equal to (<=).

3. Logical operators:
These operators are used to combine multiple conditions. Examples include and (and), or (or), and not (not).

3. Conditional Statements
It is used to execute different codes depending on certain conditions. The most common type of conditional statement is the if-else statement. The basic syntax of an if-else statement is as follows:

if condition:
*code to be executed if the condition is true*

else:
 *code to be executed if the condition is false*

The ‘condition’ in the if statement is a Boolean expression that evaluates to either True or False.

If the condition is True, the code in the if block will be executed, otherwise, the code in the else block will be executed.

For example:

x = 5
if x > 0:
print(“x is positive”)
else:
print(“x is not positive”)

In this example, the condition ‘x > 0’ evaluates to True, so the code in the if block is executed and the output will be “x is positive”

#Loops
Python has two types of loops: for loops and while loops. These allow you to repeatedly execute a block of code. In Python, loops are used to repeatedly execute a block of code. There are two types of loops: for loops and while loops.

1. For loops: A for loop is used to iterate over a sequence of items (e.g. a list, string, or tuple) and execute a block of code for each item.

2. While loops: A while loop is used to repeatedly execute a block of code as long as a certain condition is true.

# •Functions
In Python, a function is a block of code that can be reused throughout your program. Functions are useful for breaking down a complex program into smaller, more manageable pieces.

The basic syntax of a function is as follows:

def function_name(parameters):
#code to be executed

Here, function_name is the name of the function, and ‘parameters’ are the input values that are passed to the function. The code inside the function is executed when the function is called.

For example:

def greet(name):
print(“Hello, ” + name)
greet(“John”)

In this example, the function ‘greet’ takes one parameter ‘name’, and when called it prints the string “Hello, ” followed by the value of the ‘name’ parameter.

# • Libraries
A library is a collection of pre-written code that you can use to perform various tasks. Libraries provide a way to add functionality to your program without having to write the code yourself.

There are many libraries available for Python, some of the most popular ones include:

1. NumPy: A library for working with numerical data in Python. It provides tools for working with arrays, matrices, and mathematical functions.
   
2. Pandas: A library for working with data in Python. It provides tools for data manipulation, data analysis, and data visualization.
 
3. Matplotlib: A library for creating visualizations in Python. It provides tools for creating charts, plots, and other types of graphics.
 
4. Scikit-learn: A library for machine learning in Python. It provides tools for classification, regression, clustering, and more.

5. TensorFlow: A library for building and training machine learning models in Python. It’s widely used for deep learning, computer vision, natural language processing, and more.

#
#
**A simple integer in Python takes up 28 bytes of memory because of the following overheads:
Reference count: 8 bytes
Type pointer: 8 bytes
Size: 8 bytes
Integer value: 4 bytes**
   
6. OpenCV: A library for computer vision in Python. It provides tools for image and video processing, feature detection and extraction, and more.


     
