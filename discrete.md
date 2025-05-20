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
def permute_no_repetition(prefix, digits, used):
    if len(prefix) == len(digits):
        print(' '.join(prefix))
        return
    for i in range(len(digits)):
        if not used[i]:
            used[i] = True
            permute_no_repetition(prefix + [digits[i]], digits, used)
            used[i] = False

def permute_with_repetition(prefix, digits, length):
    if len(prefix) == length:
        print(' '.join(prefix))
        return
    for d in digits:
        permute_with_repetition(prefix + [d], digits, length)

digits = input("Enter digits separated by spaces: ").split()

print("\nPermutations Without Repetition:")
used = [False] * len(digits)
permute_no_repetition([], digits, used)

print("\nPermutations With Repetition:")
permute_with_repetition([], digits, len(digits))
```
![d3](https://github.com/user-attachments/assets/1e8ffbaf-0c8e-4e45-91d0-52540d43e220)

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






