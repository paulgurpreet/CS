import numpy as np

#Addition & Subtraction
X = [[1, 2, 3], 
    [4, 5, 6],
    [7, 8, 9]]
print('Matrix X:','\n',np.asmatrix(X))

Y = [ [9,8,7],
      [6,5,4],
      [3,2,1] ]
print('Matrix Y:','\n',np.asmatrix(Y))
result = [ [0,0,0],
      [0,0,0],
      [0,0,0] ]
result1 = [ [0,0,0],
      [0,0,0],
      [0,0,0] ]
for i in range(len(X)):
    for j in range(len(X[0])):
        result[i][j] = X[i][j] + Y[i][j]
        result1[i][j] = X[i][j] - Y[i][j]
print('Addition:')
for r in result:
        print(r)
print('Subtraction:')
for r in result1:
    print(r)

#Multiplication
mul= np.dot(X,Y)
print('Multiplication:','\n',mul)
print('transpose of Matrix X:','\n',np.transpose(X))

#NxN matrix
n = int(input('enter the no. N to form Matrix of NxN:'))
matrix_1 = [[i* n+j for j in range(1,n+1)] for i in range(n)]
print('the created matrix of N*N:','\n', np.asmatrix(matrix_1))


#rank

A = [ [1,2,3,23],
      [4,5,6,25],
      [7,8,9,28],
      [10,11,12,41] ]
print('Matrix A:','\n',np.asmatrix(A))
print('Rank of matrix A:', np.linalg.matrix_rank(A))

```
#practical 1 ( USER DEFINED MATRIX AND ITS TRANSPOSE )

print('\n \n \n','PRACTICAL 1 :-','\n \n \n')


NR = int(input('enter the no. of rows:'))
NC = int(input('enter the no. of columns:'))
print('enter entries in single line (separated by space):')
entries=list(map(int,input().split()))
matrix= np.array(entries).reshape(NR,NC)
print('Matrix B is as follows:','\n',matrix)
print('Transpose of matrix B as follows:','\n',np.transpose(matrix))
```

# practical 2 ( DETERMINANT , INVERSE , ADJOINT , COFACTOR )

print('\n \n \n','PRACTICAL 2 :-','\n \n \n')
```

NR = int(input('enter the no. of rows:'))
NC = int(input('enter the no. of columns:'))
print('enter entries in single line (separated by space):')
entries=list(map(int,input().split()))
matrix_A= np.array(entries).reshape(NR,NC)
print('Matrix B is as follows:','\n',matrix_A)

A_inverse= np.linalg.inv(matrix_A)
T_of_A_inverse=np.transpose(A_inverse)
Det_of_A=np.linalg.det(matrix_A)
Cofactor_of_A=np.dot(T_of_A_inverse,Det_of_A)
print('inverse is:', '\n',A_inverse)
print('cofactor is:', '\n',Cofactor_of_A)
print('determinant is:', '\n',Det_of_A)
adjoint_of_A=np.transpose(Cofactor_of_A)
print('Adjoint is:',' \n',adjoint_of_A)
```
# PRACTICAL 3 ( SOLVING SYSTEM USING GAUSS ELIMINATION)
print('\n \n \n','PRACTICAL 3 :','\n \n \n')
```
import numpy as np
NR = int(input('enter the no. of rows:'))
NC = int(input('enter the no. of columns:'))
print('enter entries in single line (separated by space)for coefficient matrix:')
entries=list(map(int,input().split()))
coefficient_matrix= np.array(entries).reshape(NR,NC)
print('enter entries in single line (separated by space)for column matrix:')
column_entries=list(map(float,input().split()))
column_matrix=np.array(column_entries).reshape(NR,1)
print('COLUMN MATRIX:','\n',column_matrix)
print('COEFFICIENT MATRIX:','\n',coefficient_matrix)
sol_of_the_system=np.linalg.solve(coefficient_matrix,column_matrix)
print('sol of system using gauss elimination:','\n',sol_of_the_system)
```

#   PRACTICAL 4 (SOLVING SYSTEM USING GAUSS JORDAN)

print('\n \n \n','PRACTICAL 4 :','\n \n \n')
```
import numpy as np
NR = int(input('enter the no. of rows:'))
NC = int(input('enter the no. of columns:'))
print('enter entries in single line (separated by space)for coefficient matrix:')
entries=list(map(int,input().split()))
coefficient_matrix= np.array(entries).reshape(NR,NC)
print('enter entries in single line (separated by space)for column matrix:')
column_entries=list(map(float,input().split()))
column_matrix=np.array(column_entries).reshape(NR,1)
print('COLUMN MATRIX:','\n',column_matrix)
print('COEFFICIENT MATRIX:','\n',coefficient_matrix)
inv_of_coefficient_matrix=np.linalg.inv(coefficient_matrix)
sol_of_system_gaussJordan=np.matmul(inv_of_coefficient_matrix,column_matrix)
print('sol of system using gauss jordan','\n',sol_of_system_gaussJordan)
```
#PRACTICAL 5 (NULLITY)
print('\n \n \n','PRACTICAL 5 :','\n \n \n')
```
import numpy as np
from sympy import Matrix
NR = int(input('enter the no. of rows:'))
NC = int(input('enter the no. of columns:'))
print('enter entries in single line (separated by space)for coefficient matrix:')
entries=list(map(float,input().split()))
matrix_B= np.array(entries).reshape(NR,NC)
B=Matrix(matrix_B)
NullSpace=B.nullspace()
NullSpace=Matrix(NullSpace)
print('Null space of a Matrix(B) is =',NullSpace,'\n')
print('checking whether NullSpace satisfies the given condition','\n','or not as B * NullSpace=0','\n','if NullSpace is null space of B')

```



#practical 5
```
import numpy as np

def is_linearly_dependent(vectors):
    # Convert the list of vectors to a numpy matrix (each vector is a column)
    A = np.column_stack(vectors)

    # Perform row reduction (Gaussian elimination)
    rank = np.linalg.matrix_rank(A)

    # If the rank of the matrix is less than the number of vectors, they are linearly dependent
    if rank < A.shape[1]:
        print("The vectors are linearly dependent.")
        # Find a non-trivial solution to the equation A * c = 0
        # where c is the vector of coefficients
        # Solve A * c = 0 (using least squares)
        c = np.linalg.lstsq(A, np.zeros(A.shape[0]), rcond=None)[0]
        print("Non-trivial linear combination (coefficients):")
        print(c)
    else:
        print("The vectors are linearly independent.")

def generate_linear_combination(vectors, coefficients):
    # Linear combination of vectors based on given coefficients
    result = np.zeros_like(vectors[0])
    for i, vec in enumerate(vectors):
        result += coefficients[i] * vec
    return result

# Example: 3 vectors in R^3 (3D space)
v1 = np.array([1, 2, 3])
v2 = np.array([2, 4, 6])
v3 = np.array([3, 6, 9])

vectors = [v1, v2, v3]

# Check if the vectors are linearly dependent
is_linearly_dependent(vectors)

# Example: Generating a linear combination
coefficients = np.array([2, -1, 1])  # coefficients for the linear combination
linear_combination = generate_linear_combination(vectors, coefficients)
print("\nGenerated linear combination:")
print(linear_combination)
```


#practical 6

```
import numpy as np
from scipy.linalg import eig
from sympy import Matrix, symbols, det

# Function to check diagonalizability
def is_diagonalizable(A):
    # Compute eigenvalues and eigenvectors
    eigenvalues, eigenvectors = eig(A)
    
    # Check the geometric multiplicity (number of independent eigenvectors)
    # If the number of independent eigenvectors matches the size of the matrix, it's diagonalizable
    rank = np.linalg.matrix_rank(eigenvectors)
    if rank == A.shape[0]:
        return True, eigenvalues
    else:
        return False, eigenvalues

# Function to verify the Cayley-Hamilton theorem
def verify_cayley_hamilton(A):
    # Convert matrix to sympy Matrix
    A_sympy = Matrix(A)
    
    # Compute the characteristic polynomial
    lambda_symbol = symbols('lambda')
    char_poly = A_sympy.charpoly(lambda_symbol)
    
    # The characteristic polynomial as a sympy expression
    characteristic_polynomial = char_poly.as_expr()

    # Replace lambda with the matrix A in the characteristic polynomial
    A_substitution = characteristic_polynomial.subs(lambda_symbol, A_sympy)
    
    # Check if the result is the zero matrix (Cayley-Hamilton should hold)
    return A_substitution.is_zero

# Example matrix
A = np.array([[4, -1, 1],
              [-1, 4, -2],
              [1, -2, 3]])

# Step 1: Check if the matrix is diagonalizable
diagonalizable, eigenvalues = is_diagonalizable(A)
print("Is the matrix diagonalizable?", diagonalizable)
print("Eigenvalues of the matrix:", eigenvalues)

# Step 2: Verify Cayley-Hamilton theorem
is_cayley_hamilton_true = verify_cayley_hamilton(A)
print("Does the matrix satisfy the Cayley-Hamilton theorem?", is_cayley_hamilton_true)

```


# practical 7
```
import sympy as sp

# Define symbols (coordinates)
x, y, z = sp.symbols('x y z')

# Example Scalar Field f(x, y, z)
f = x**2 + y**2 + z**2

# Example Vector Field A(x, y, z)
A_x = x * y
A_y = y * z
A_z = z * x
A = sp.Matrix([A_x, A_y, A_z])

# 1. Compute the Gradient of the scalar field f
gradient_f = sp.Matrix([sp.diff(f, var) for var in (x, y, z)])
print("Gradient of f(x, y, z):")
sp.pprint(gradient_f)

# 2. Compute the Divergence of the vector field A
divergence_A = sp.diff(A_x, x) + sp.diff(A_y, y) + sp.diff(A_z, z)
print("\nDivergence of A(x, y, z):")
sp.pprint(divergence_A)

# 3. Compute the Curl of the vector field A
curl_A = sp.Matrix([
    sp.diff(A_z, y) - sp.diff(A_y, z),  # i-component
    sp.diff(A_x, z) - sp.diff(A_z, x),  # j-component
    sp.diff(A_y, x) - sp.diff(A_x, y)   # k-component
    ])
print("\nCurl of A(x, y, z):")
sp.pprint(curl_A)

```











