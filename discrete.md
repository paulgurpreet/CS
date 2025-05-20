## practical 1
Create a class SET. Create member functions to perform the following SET
 operations:
 1) ismember: check whether an element belongs to the set or not and return value
 as true/false.
 2) powerset: list all the elements of the power set of a set .
 3) subset: Check whether one set is a subset of the other or not.
 4) union and Intersection of two Sets.
 5) complement: Assume Universal Set as per the input elements from the user.
 6) set Difference and Symmetric Difference between two sets.
 7) cartesian Product of Sets.
 Write a menu driven program to perform the above functions on an instance of the
 SET class.
```
class SET:
    def __init__(self, elements):
        self.set = set(elements)

    def ismember(self, element):
        return element in self.set

    def powerset(self):
        s = list(self.set)
        result = [[]]
        for elem in s:
            new_subsets = []
            for subset in result:
                new_subsets.append(subset + [elem])
            result.extend(new_subsets)
        return result

    def subset(self, other):
        return self.set.issubset(other.set)

    def union(self, other):
        return self.set.union(other.set)

    def intersection(self, other):
        return self.set.intersection(other.set)

    def complement(self, universal):
        return set(universal).difference(self.set)

    def set_difference(self, other):
        return self.set.difference(other.set)

    def symmetric_difference(self, other):
        return self.set.symmetric_difference(other.set)

    def cartesian_product(self, other):
        return [(a, b) for a in self.set for b in other.set]


while True:
    print("\n1. Check Membership")
    print("2. Power Set")
    print("3. Subset Check")
    print("4. Union and Intersection")
    print("5. Complement")
    print("6. Set Difference and Symmetric Difference")
    print("7. Cartesian Product")
    print("8. Exit")
    ch = input("Enter your choice: ")

    if ch == '8':
        break

    if ch in ['1', '2', '5']:
        s1 = SET(input("Enter elements of Set (space-separated): ").split())
    if ch in ['3', '4', '6', '7']:
        s1 = SET(input("Enter elements of Set 1 (space-separated): ").split())
        s2 = SET(input("Enter elements of Set 2 (space-separated): ").split())

    if ch == '1':
        e = input("Enter element to check: ")
        print(s1.ismember(e))
    elif ch == '2':
        print(s1.powerset())
    elif ch == '3':
        print(s1.subset(s2))
    elif ch == '4':
        print("Union:", s1.union(s2))
        print("Intersection:", s1.intersection(s2))
    elif ch == '5':
        u = input("Enter Universal Set elements (space-separated): ").split()
        print("Complement:", s1.complement(u))
    elif ch == '6':
        print("Set Difference (S1 - S2):", s1.set_difference(s2))
        print("Symmetric Difference:", s1.symmetric_difference(s2))
    elif ch == '7':
        print("Cartesian Product:", s1.cartesian_product(s2))

```
![d1](https://github.com/user-attachments/assets/abe8f602-17c3-442e-a673-947fdc27bcf9)
## practical 2
Create a class RELATION, use Matrix notation to represent a relation. Include
 member functions to check if the relation is Reflexive, Symmetric, Anti-symmetric,
 Transitive. Using these functions check whether the given relation is: Equivalence or
 Partial Order relation or None
 ```
class RELATION:
    def __init__(self, n, flat_values):
        self.n = n
        self.matrix = []
        idx = 0
        for _ in range(n):
            row = []
            for _ in range(n):
                row.append(flat_values[idx])
                idx += 1
            self.matrix.append(row)

    def is_reflexive(self):
        for i in range(self.n):
            if self.matrix[i][i] != 1:
                return False
        return True

    def is_symmetric(self):
        for i in range(self.n):
            for j in range(self.n):
                if self.matrix[i][j] != self.matrix[j][i]:
                    return False
        return True

    def is_anti_symmetric(self):
        for i in range(self.n):
            for j in range(self.n):
                if i != j and self.matrix[i][j] == 1 and self.matrix[j][i] == 1:
                    return False
        return True

    def is_transitive(self):
        for i in range(self.n):
            for j in range(self.n):
                if self.matrix[i][j]:
                    for k in range(self.n):
                        if self.matrix[j][k] and not self.matrix[i][k]:
                            return False
        return True

    def check_relation_type(self):
        r = self.is_reflexive()
        s = self.is_symmetric()
        a = self.is_anti_symmetric()
        t = self.is_transitive()
        if r and s and t:
            return "Equivalence Relation."
        elif r and a and t:
            return "Partial Order Relation."
        else:
            return "None"


flat = list(map(int, input("Enter All Relation In Form Of Matrix Value With A Space:: ").split()))
n = int(input("Enter How Many Row or Columns In Your Square Matrix:: "))

R = RELATION(n, flat)

print("Your Required Matrix Are::")
for row in R.matrix:
    print(row)

print("Your Relation is", R.check_relation_type())
```
![d2](https://github.com/user-attachments/assets/71146834-2d95-473e-9e7c-27f53fbb151c)

## practical 3
Write a Program that generates all the permutations of a given set of digits, with or  without repetition
```
from itertools import permutations, product

def generate_permutations(Set, repetition): 
    if repetition:
        return list(product(Set, repeat=len(Set)))  # Correct for repetition
    else:
        return list(permutations(Set))  # Correct for no repetition

if __name__ == "__main__":  # ✅ Fix typo: it should be "__main__", not "___main__"
    Set = list(map(int, input("Enter all elements of the set with space: ").split()))  # list instead of set to preserve order and duplicates

    with_repetition = generate_permutations(Set, repetition=True)
    without_repetition = generate_permutations(Set, repetition=False)

    print("\nPermutations with repetition:")
    for perm in with_repetition:
        print(perm)

    print("\nPermutations without repetition:")
    for perm in without_repetition:
        print(perm)

    print("\nCount:")
    print("Without repetition:", len(without_repetition))
    print("With repetition:", len(with_repetition))

```
![d3](https://github.com/user-attachments/assets/2018165a-27b7-4dd7-924e-2a7b45921515)


## practical 4
 For any number n, write a program to list all the solutions of the equation x1 + x2 +
 x3 + ...+ xn = C, where C is a constant (C<=10) and x1, x2,x3,...,xn are nonnegative
 integers, using brute force strategy.
 ```
def find_solutions(n, C, solution, all_solutions):
    if n == 1:
        # The last variable is fixed to satisfy sum = C
        solution.append(C)
        all_solutions.append(solution.copy())
        solution.pop()
        return
    
    for i in range(C + 1):
        solution.append(i)
        # Recur for next variable with reduced sum C - i
        find_solutions(n - 1, C - i, solution, all_solutions)
        solution.pop()

n = int(input("Enter number of variables n: "))
C = int(input("Enter constant C (<=10): "))

all_solutions = []
find_solutions(n, C, [], all_solutions)

print(f"All solutions for x1 + x2 + ... + x{n} = {C} are:")
for sol in all_solutions:
    print(sol)
```
![d4](https://github.com/user-attachments/assets/29dfac28-f664-4059-b4fb-9fb357a0ea76)
## practical 5
Write a Program to evaluate a polynomial function. (For example store f(x) = 4n2 +
 2n + 9 in an array and for a given value of n, say n = 5, compute the value of f(n)).
 ```
def solve_polynomial():
    func = list(map(int, input("Enter Your Function coefficient Separated With Space::").split()))
    num = int(input("Enter Value Of Your Variable::"))
    value = 0
    for i in range(-1, -len(func)-1, -1):
        value += func[i] * num ** (-i - 1)
    return value

print(solve_polynomial())
```
![d5](https://github.com/user-attachments/assets/a2c06492-7169-4eab-9c58-b649b6f05360)
## practical 6
 Write a Program to check if a given graph is a complete graph. Represent the graph
 using the Adjacency Matrix representation.
 ```
def is_complete_graph(adj_matrix):
    n = len(adj_matrix)
    for i in range(n):
        for j in range(n):
            if i == j and adj_matrix[i][j] != 0:
                return False  # self-loop
            elif i != j and adj_matrix[i][j] != 1:
                return False  
    return True

n = int(input("Enter number of vertices: "))

print("Enter the adjacency matrix row by row:")
adj_matrix = []
for i in range(n):
    row = list(map(int, input().split()))
    adj_matrix.append(row)
print('adjacency matrix is:',adj_matrix)

if is_complete_graph(adj_matrix):
    print("The graph is a complete graph.")
else:
    print("The graph is NOT a complete graph.")
```
![d6](https://github.com/user-attachments/assets/826cb444-187d-46fe-aa8b-300d59a9a826)

## practical 7
 Write a Program to check if a given graph is a complete graph. Represent the graph
 using the Adjacency List representation.
 ```
def is_complete_graph(adj_list, n):
    for i in range(n):
        if i in adj_list[i]:  
            return False
        if len(adj_list[i]) != n - 1:
            return False
    return True

n = int(input("Enter number of vertices: "))
adj_list = {}

print("Enter the adjacent vertices for each vertex (space-separated):")
for i in range(n):
    neighbors = list(map(int, input().split()))
    adj_list[i] = neighbors

print("\nAdjacency List:")
for i in range(n):
    print(adj_list[i])

if is_complete_graph(adj_list, n):
    print("\nThe graph is a COMPLETE graph.")
else:
    print("\nThe graph is NOT a complete graph.")
```
![d7](https://github.com/user-attachments/assets/6477c725-a41e-478b-95b9-c1e7755336c0)
## practical 8
 Write a Program to accept a directed graph G and compute the in-degree and out
degree of each vertex.
```
n = int(input("Enter number of vertices: "))

adj_list = {}
print("Enter the adjacent vertices for each vertex (space-separated):")
for i in range(n):
    neighbors = list(map(int, input().split()))
    adj_list[i] = neighbors

in_degree = {i: 0 for i in range(n)}
out_degree = {i: 0 for i in range(n)}

for i in range(n):
    out_degree[i] = len(adj_list[i])

for i in range(n):
    for neighbor in adj_list[i]:
        in_degree[neighbor] += 1

print("\nVertex\tIn-degree\tOut-degree")
for i in range(n):
    print(f"{i}\t{in_degree[i]}\t\t{out_degree[i]}")
```
![d8](https://github.com/user-attachments/assets/82051fc2-6266-4c27-b13d-9c3bcc6b8fa4)









