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
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class SET {
private:
    vector<int> elements;

public:
    void inputSet(string name = "Set") {
        int n, temp;
        cout << "Enter number of elements in " << name << ": ";
        cin >> n;
        cout << "Enter elements of " << name << ": ";
        for (int i = 0; i < n; ++i) {
            cin >> temp;
            if (!ismember(temp))
                elements.push_back(temp);
        }
    }

    void display() {
        cout << "{ ";
        for (int e : elements)
            cout << e << " ";
        cout << "}\n";
    }

    bool ismember(int val) {
        return find(elements.begin(), elements.end(), val) != elements.end();
    }

    void powerset() {
        int n = elements.size();
        int powSize = 1 << n;
        for (int i = 0; i < powSize; ++i) {
            cout << "{ ";
            for (int j = 0; j < n; ++j) {
                if (i & (1 << j))
                    cout << elements[j] << " ";
            }
            cout << "}\n";
        }
    }

    bool isSubset(SET& other) {
        for (int e : elements)
            if (!other.ismember(e))
                return false;
        return true;
    }

    SET Union(SET& other) {
        SET result;
        result.elements = elements;
        for (int e : other.elements) {
            if (!result.ismember(e))
                result.elements.push_back(e);
        }
        return result;
    }

    SET Intersection(SET& other) {
        SET result;
        for (int e : elements) {
            if (other.ismember(e))
                result.elements.push_back(e);
        }
        return result;
    }

    SET Complement(SET& universal) {
        SET result;
        for (int e : universal.elements) {
            if (!ismember(e))
                result.elements.push_back(e);
        }
        return result;
    }

    SET Difference(SET& other) {
        SET result;
        for (int e : elements) {
            if (!other.ismember(e))
                result.elements.push_back(e);
        }
        return result;
    }

    SET SymmetricDifference(SET& other) {
        SET diff1 = this->Difference(other);
        SET diff2 = other.Difference(*this);
        return diff1.Union(diff2);
    }

    void CartesianProduct(SET& other) {
        cout << "{ ";
        for (int a : elements) {
            for (int b : other.elements) {
                cout << "(" << a << "," << b << ") ";
            }
        }
        cout << "}\n";
    }
};

int main() {
    SET A, B, U;
    int choice, val;

    cout << "Universal Set:\n";
    U.inputSet("Universal Set");

    cout << "\nSet A:\n";
    A.inputSet("Set A");

    cout << "\nSet B:\n";
    B.inputSet("Set B");

    do {
        cout << "\nMENU\n";
        cout << "1. Check Membership in A\n";
        cout << "2. Power Set of A\n";
        cout << "3. Is A subset of B\n";
        cout << "4. Union of A and B\n";
        cout << "5. Intersection of A and B\n";
        cout << "6. Complement of A\n";
        cout << "7. A - B\n";
        cout << "8. Symmetric Difference (A ^ B)\n";
        cout << "9. Cartesian Product A x B\n";
        cout << "0. Exit\n";
        cout << "Enter choice: ";
        cin >> choice;

        switch (choice) {
        case 1:
            cout << "Enter element to check: ";
            cin >> val;
            cout << (A.ismember(val) ? "True" : "False") << "\n";
            break;
        case 2:
            A.powerset();
            break;
        case 3:
            cout << (A.isSubset(B) ? "Yes" : "No") << "\n";
            break;
        case 4:
            A.Union(B).display();
            break;
        case 5:
            A.Intersection(B).display();
            break;
        case 6:
            A.Complement(U).display();
            break;
        case 7:
            A.Difference(B).display();
            break;
        case 8:
            A.SymmetricDifference(B).display();
            break;
        case 9:
            A.CartesianProduct(B);
            break;
        case 0:
            break;
        default:
            cout << "Invalid choice\n";
        }
    } while (choice != 0);

    return 0;
}
```
![11](https://github.com/user-attachments/assets/00ae136e-fbca-490d-951d-67b8b3001593)
