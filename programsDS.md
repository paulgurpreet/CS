/*
1. Write a program to implement singly linked list as an ADT that supports the following oper
ations: 
i. 
ii. 
iii. 
iv. 
vi. 
Insert an element x at the beginning of the singly linked list 
Insert an element x at i th
 position in the singly linked list 
Remove an element from the beginning of the doubly linked list  
Remove an element from i th
 position in the singly linked list. 
Search for an element x in the singly linked list and return its pointer 
*/
```
#include <iostream>
using namespace std;

class Node {
public:
    int data;
    Node* next;

    Node(int x) {
        data = x;
        next = nullptr;
    }
};

class SinglyLinkedList {
private:
    Node* head;

public:
    SinglyLinkedList() {
        head = nullptr;
    }

    // Insert at beginning
    void insertAtBeginning(int x) {
        Node* newNode = new Node(x);
        newNode->next = head;
        head = newNode;
    }

    // Insert at ith position (1-indexed)
    void insertAtPosition(int x, int pos) {
        Node* newNode = new Node(x);

        if (pos == 1) {
            newNode->next = head;
            head = newNode;
            return;
        }

        Node* temp = head;
        for (int i = 1; i < pos - 1 && temp != nullptr; i++) {
            temp = temp->next;
        }

        if (temp == nullptr) {
            cout << "Position out of range\n";
            delete newNode;
            return;
        }

        newNode->next = temp->next;
        temp->next = newNode;
    }

    // Remove from beginning
    void removeFromBeginning() {
        if (head == nullptr) {
            cout << "List is empty\n";
            return;
        }

        Node* temp = head;
        head = head->next;
        delete temp;
    }

    // Remove from ith position
    void removeFromPosition(int pos) {
        if (head == nullptr) {
            cout << "List is empty\n";
            return;
        }

        Node* temp = head;

        if (pos == 1) {
            head = head->next;
            delete temp;
            return;
        }

        Node* prev = nullptr;
        for (int i = 1; i < pos && temp != nullptr; i++) {
            prev = temp;
            temp = temp->next;
        }

        if (temp == nullptr) {
            cout << "Position out of range\n";
            return;
        }

        prev->next = temp->next;
        delete temp;
    }

    // Search for element and return pointer
    Node* search(int x) {
        Node* temp = head;

        while (temp != nullptr) {
            if (temp->data == x)
                return temp;
            temp = temp->next;
        }
        return nullptr;
    }

    // Display list
    void display() {
        Node* temp = head;
        while (temp != nullptr) {
            cout << temp->data << " -> ";
            temp = temp->next;
        }
        cout << "NULL\n";
    }
};

int main() {
    SinglyLinkedList list;

    list.insertAtBeginning(10);
    list.insertAtBeginning(20);
    list.insertAtBeginning(30);

    list.insertAtPosition(15, 2);

    list.display();

    list.removeFromBeginning();
    list.display();

    list.removeFromPosition(2);
    list.display();

    Node* found = list.search(10);
    if (found)
        cout << "Element 10 found at node address: " << found << endl;
    else
        cout << "Element not found\n";

    return 0;
}
```

/*
2. Write a program to implement doubly linked list as an ADT that supports the following op
erations: 
i. 
ii. 
iii. 
iv. 
Insert an element x at the beginning of the doubly linked list 
Insert an element x at the end of the doubly linked list 
Remove an element from the beginning of the doubly linked list 
Remove an element from the end of the doubly linked list 
*/
```
#include <iostream>
using namespace std;

class Node {
public:
    int data;
    Node* prev;
    Node* next;

    Node(int x) {
        data = x;
        prev = nullptr;
        next = nullptr;
    }
};

class DoublyLinkedList {
private:
    Node* head;
    Node* tail;

public:
    DoublyLinkedList() {
        head = nullptr;
        tail = nullptr;
    }

    // Insert at beginning
    void insertAtBeginning(int x) {
        Node* newNode = new Node(x);

        if (head == nullptr) { // Empty list
            head = tail = newNode;
            return;
        }

        newNode->next = head;
        head->prev = newNode;
        head = newNode;
    }

    // Insert at end
    void insertAtEnd(int x) {
        Node* newNode = new Node(x);

        if (tail == nullptr) { // Empty list
            head = tail = newNode;
            return;
        }

        tail->next = newNode;
        newNode->prev = tail;
        tail = newNode;
    }

    // Remove from beginning
    void removeFromBeginning() {
        if (head == nullptr) {
            cout << "List is empty\n";
            return;
        }

        Node* temp = head;

        if (head == tail) { // Only one node
            head = tail = nullptr;
        } else {
            head = head->next;
            head->prev = nullptr;
        }

        delete temp;
    }

    // Remove from end
    void removeFromEnd() {
        if (tail == nullptr) {
            cout << "List is empty\n";
            return;
        }

        Node* temp = tail;

        if (head == tail) { // Only one node
            head = tail = nullptr;
        } else {
            tail = tail->prev;
            tail->next = nullptr;
        }

        delete temp;
    }

    // Display list forward
    void display() {
        Node* temp = head;
        while (temp != nullptr) {
            cout << temp->data << " <-> ";
            temp = temp->next;
        }
        cout << "NULL\n";
    }
};

int main() {
    DoublyLinkedList list;

    list.insertAtBeginning(10);
    list.insertAtBeginning(20);
    list.insertAtEnd(5);
    list.insertAtEnd(1);

    list.display();

    list.removeFromBeginning();
    list.display();

    list.removeFromEnd();
    list.display();

    return 0;
}
```
/*
3. Write a program to implement circular linked list as an ADT which supports the following 
operations: 
i. 
ii. 
iii. 
Insert an element x in the list 
Remove an element from the list 
Search for an element x in the list and return its pointer 
*/
```
#include <iostream>
using namespace std;

class Node {
public:
    int data;
    Node* next;

    Node(int x) {
        data = x;
        next = nullptr;
    }
};

class CircularLinkedList {
private:
    Node* tail;   // Tail pointer (tail->next is head)

public:
    CircularLinkedList() {
        tail = nullptr;
    }

    // Insert element x in the circular list (at end)
    void insert(int x) {
        Node* newNode = new Node(x);

        if (tail == nullptr) {  // First node
            tail = newNode;
            tail->next = tail;
            return;
        }

        newNode->next = tail->next; // newNode->next = head
        tail->next = newNode;       // tail->next = new node
        tail = newNode;             // update tail
    }

    // Remove an element x from the list
    void remove(int x) {
        if (tail == nullptr) {
            cout << "List is empty\n";
            return;
        }

        Node* curr = tail->next; // head
        Node* prev = tail;

        do {
            if (curr->data == x) {
                if (curr == prev) { // Only one node in list
                    tail = nullptr;
                } 
                else {
                    prev->next = curr->next;
                    if (curr == tail)
                        tail = prev;  // If deleting tail, update it
                }
                delete curr;
                return;
            }
            prev = curr;
            curr = curr->next;
        } while (curr != tail->next);

        cout << "Element not found\n";
    }

    // Search for an element and return pointer
    Node* search(int x) {
        if (tail == nullptr) return nullptr;

        Node* temp = tail->next; // head

        do {
            if (temp->data == x)
                return temp;
            temp = temp->next;
        } while (temp != tail->next);

        return nullptr;
    }

    // Display circular list
    void display() {
        if (tail == nullptr) {
            cout << "List is empty\n";
            return;
        }

        Node* temp = tail->next; // head

        do {
            cout << temp->data << " -> ";
            temp = temp->next;
        } while (temp != tail->next);

        cout << "(back to head)\n";
    }
};

int main() {
    CircularLinkedList list;

    list.insert(10);
    list.insert(20);
    list.insert(30);
    list.display();

    list.remove(20);
    list.display();

    Node* found = list.search(30);
    if (found)
        cout << "Element 30 found at node address: " << found << endl;
    else
        cout << "Element not found\n";

    return 0;
}
```
/*
4. Implement Stack as an ADT and use it to evaluate a prefix/postfix expression.
*/
```
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

// -------------------- Stack ADT --------------------
class Stack {
private:
    int top;
    int arr[100];

public:
    Stack() { top = -1; }

    void push(int x) {
        arr[++top] = x;
    }

    int pop() {
        return arr[top--];
    }

    bool empty() {
        return top == -1;
    }
};

// -------------------- Helper: Check if operator --------------------
bool isOperator(char c) {
    return (c == '+' || c == '-' || c == '*' || c == '/');
}

// -------------------- Evaluate Postfix --------------------
int evaluatePostfix(string exp) {
    Stack st;

    for (int i = 0; i < exp.length(); i++) {
        char ch = exp[i];

        if (isdigit(ch)) {
            st.push(ch - '0');
        } 
        else if (isOperator(ch)) {
            int b = st.pop();
            int a = st.pop();

            switch (ch) {
                case '+': st.push(a + b); break;
                case '-': st.push(a - b); break;
                case '*': st.push(a * b); break;
                case '/': st.push(a / b); break;
            }
        }
    }
    return st.pop();
}

// -------------------- Evaluate Prefix --------------------
int evaluatePrefix(string exp) {
    Stack st;

    for (int i = exp.length() - 1; i >= 0; i--) {
        char ch = exp[i];

        if (isdigit(ch)) {
            st.push(ch - '0');
        }
        else if (isOperator(ch)) {
            int a = st.pop();
            int b = st.pop();

            switch(ch) {
                case '+': st.push(a + b); break;
                case '-': st.push(a - b); break;
                case '*': st.push(a * b); break;
                case '/': st.push(a / b); break;
            }
        }
    }
    return st.pop();
}

// -------------------- Main --------------------
int main() {
    string postfix = "231*+9-";     // example postfix
    string prefix  = "-+2*319";     // example prefix

    cout << "Postfix Evaluation = " << evaluatePostfix(postfix) << endl;
    cout << "Prefix Evaluation  = " << evaluatePrefix(prefix) << endl;

    return 0;
}
```
/*
5. Implement Queue as an ADT.
*/
```
#include <iostream>
using namespace std;

class Queue {
private:
    int arr[100];
    int frontIndex, rearIndex, size;

public:
    Queue() {
        frontIndex = 0;
        rearIndex = -1;
        size = 0;
    }

    bool isEmpty() {
        return size == 0;
    }

    bool isFull() {
        return size == 100;
    }

    // Insert element
    void enqueue(int x) {
        if (isFull()) {
            cout << "Queue is full\n";
            return;
        }

        rearIndex = (rearIndex + 1) % 100;
        arr[rearIndex] = x;
        size++;
    }

    // Remove element
    void dequeue() {
        if (isEmpty()) {
            cout << "Queue is empty\n";
            return;
        }

        frontIndex = (frontIndex + 1) % 100;
        size--;
    }

    // Get front element
    int front() {
        if (isEmpty()) {
            cout << "Queue is empty\n";
            return -1;
        }
        return arr[frontIndex];
    }

    // Display queue elements
    void display() {
        if (isEmpty()) {
            cout << "Queue is empty\n";
            return;
        }

        int count = size;
        int index = frontIndex;

        while (count--) {
            cout << arr[index] << " ";
            index = (index + 1) % 100;
        }
        cout << endl;
    }
};

int main() {
    Queue q;

    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);

    q.display();

    q.dequeue();
    q.display();

    cout << "Front element = " << q.front() << endl;

    return 0;
}
```
/* 
6. Write a program to implement Binary Search Tree as an ADT which supports the following 
operations: 
i. 
ii. 
iii. 
iv. 
Insert an element x 
Delete an element x 
Search for an element x in the BST  
Display the elements of the BST in preorder, inorder, and postorder traversal 
*/
```
#include <iostream>
#include <memory>
using namespace std;

class BST {
private:
    struct Node {
        int key;
        Node* left;
        Node* right;
        Node(int k) : key(k), left(nullptr), right(nullptr) {}
    };

    Node* root;

    // Helper: insert recursively
    Node* insertRec(Node* node, int key) {
        if (!node) return new Node(key);
        if (key < node->key)
            node->left = insertRec(node->left, key);
        else if (key > node->key)
            node->right = insertRec(node->right, key);
        // if equal, do nothing (no duplicate). Change if duplicates allowed.
        return node;
    }

    // Helper: find minimum node in subtree
    Node* findMin(Node* node) {
        if (!node) return nullptr;
        while (node->left) node = node->left;
        return node;
    }

    // Helper: delete recursively
    Node* deleteRec(Node* node, int key) {
        if (!node) return nullptr;

        if (key < node->key) {
            node->left = deleteRec(node->left, key);
        } else if (key > node->key) {
            node->right = deleteRec(node->right, key);
        } else {
            // node to be deleted found
            if (!node->left && !node->right) {
                // no children
                delete node;
                return nullptr;
            } else if (!node->left) {
                // only right child
                Node* temp = node->right;
                delete node;
                return temp;
            } else if (!node->right) {
                // only left child
                Node* temp = node->left;
                delete node;
                return temp;
            } else {
                // two children: replace with inorder successor (min in right subtree)
                Node* succ = findMin(node->right);
                node->key = succ->key;
                node->right = deleteRec(node->right, succ->key);
            }
        }
        return node;
    }

    // Helper: search recursively
    bool searchRec(Node* node, int key) const {
        if (!node) return false;
        if (key == node->key) return true;
        if (key < node->key) return searchRec(node->left, key);
        return searchRec(node->right, key);
    }

    // Traversal helpers
    void inorderRec(Node* node) const {
        if (!node) return;
        inorderRec(node->left);
        cout << node->key << " ";
        inorderRec(node->right);
    }

    void preorderRec(Node* node) const {
        if (!node) return;
        cout << node->key << " ";
        preorderRec(node->left);
        preorderRec(node->right);
    }

    void postorderRec(Node* node) const {
        if (!node) return;
        postorderRec(node->left);
        postorderRec(node->right);
        cout << node->key << " ";
    }

    // Helper: free entire tree
    void freeTree(Node* node) {
        if (!node) return;
        freeTree(node->left);
        freeTree(node->right);
        delete node;
    }

public:
    BST() : root(nullptr) {}
    ~BST() { freeTree(root); }

    void insert(int key) {
        root = insertRec(root, key);
    }

    void remove(int key) {
        root = deleteRec(root, key);
    }

    bool search(int key) const {
        return searchRec(root, key);
    }

    void inorder() const {
        inorderRec(root);
        cout << "\n";
    }

    void preorder() const {
        preorderRec(root);
        cout << "\n";
    }

    void postorder() const {
        postorderRec(root);
        cout << "\n";
    }

    bool isEmpty() const {
        return root == nullptr;
    }
};

int main() {
    BST tree;
    int choice, x;

    cout << "Binary Search Tree (ADT) Demo\n";
    do {
        cout << "\nMenu:\n"
             << "1. Insert x\n"
             << "2. Delete x\n"
             << "3. Search x\n"
             << "4. Inorder traversal\n"
             << "5. Preorder traversal\n"
             << "6. Postorder traversal\n"
             << "0. Exit\n"
             << "Enter choice: ";
        if (!(cin >> choice)) {
            cout << "Invalid input. Exiting.\n";
            break;
        }
        switch (choice) {
            case 1:
                cout << "Enter integer to insert: ";
                cin >> x;
                tree.insert(x);
                cout << x << " inserted.\n";
                break;
            case 2:
                cout << "Enter integer to delete: ";
                cin >> x;
                if (tree.search(x)) {
                    tree.remove(x);
                    cout << x << " deleted if present.\n";
                } else {
                    cout << x << " not found in tree.\n";
                }
                break;
            case 3:
                cout << "Enter integer to search: ";
                cin >> x;
                cout << (tree.search(x) ? "Found\n" : "Not found\n");
                break;
            case 4:
                cout << "Inorder: ";
                tree.inorder();
                break;
            case 5:
                cout << "Preorder: ";
                tree.preorder();
                break;
            case 6:
                cout << "Postorder: ";
                tree.postorder();
                break;
            case 0:
                cout << "Exiting.\n";
                break;
            default:
                cout << "Invalid choice.\n";
        }
    } while (choice != 0);

    return 0;
}
```
/*
7. Write a program to implement insert and search operation in AVL trees. 
*/
```
#include <iostream>
using namespace std;

class AVL {
private:
    struct Node {
        int key;
        int height;
        Node* left;
        Node* right;
        Node(int k) : key(k), height(1), left(nullptr), right(nullptr) {}
    };

    Node* root = nullptr;

    int height(Node* n) {
        return n ? n->height : 0;
    }

    int getBalance(Node* n) {
        if (!n) return 0;
        return height(n->left) - height(n->right);
    }

    Node* rightRotate(Node* y) {
        Node* x = y->left;
        Node* T2 = x->right;

        // rotation
        x->right = y;
        y->left = T2;

        // update heights
        y->height = max(height(y->left), height(y->right)) + 1;
        x->height = max(height(x->left), height(x->right)) + 1;

        return x; // new root
    }

    Node* leftRotate(Node* x) {
        Node* y = x->right;
        Node* T2 = y->left;

        // rotation
        y->left = x;
        x->right = T2;

        // update heights
        x->height = max(height(x->left), height(x->right)) + 1;
        y->height = max(height(y->left), height(y->right)) + 1;

        return y; // new root
    }

    Node* insertRec(Node* node, int key) {
        if (!node) return new Node(key);

        if (key < node->key)
            node->left = insertRec(node->left, key);
        else if (key > node->key)
            node->right = insertRec(node->right, key);
        else
            return node; // no duplicates

        // update height
        node->height = max(height(node->left), height(node->right)) + 1;

        int balance = getBalance(node);

        // LL
        if (balance > 1 && key < node->left->key)
            return rightRotate(node);

        // RR
        if (balance < -1 && key > node->right->key)
            return leftRotate(node);

        // LR
        if (balance > 1 && key > node->left->key) {
            node->left = leftRotate(node->left);
            return rightRotate(node);
        }

        // RL
        if (balance < -1 && key < node->right->key) {
            node->right = rightRotate(node->right);
            return leftRotate(node);
        }

        return node;
    }

    bool searchRec(Node* node, int key) {
        if (!node) return false;
        if (key == node->key) return true;
        if (key < node->key) return searchRec(node->left, key);
        return searchRec(node->right, key);
    }

    void inorder(Node* node) {
        if (!node) return;
        inorder(node->left);
        cout << node->key << " ";
        inorder(node->right);
    }

public:
    void insert(int key) {
        root = insertRec(root, key);
    }

    bool search(int key) {
        return searchRec(root, key);
    }

    void displayInorder() {
        inorder(root);
        cout << endl;
    }
};

int main() {
    AVL tree;
    int choice, x;

    do {
        cout << "\nAVL Tree Menu:\n";
        cout << "1. Insert\n2. Search\n3. Display (Inorder)\n0. Exit\n";
        cout << "Enter choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                cout << "Enter value: ";
                cin >> x;
                tree.insert(x);
                cout << "Inserted.\n";
                break;

            case 2:
                cout << "Enter value to search: ";
                cin >> x;
                cout << (tree.search(x) ? "Found\n" : "Not Found\n");
                break;

            case 3:
                cout << "Inorder: ";
                tree.displayInorder();
                break;

            case 0:
                cout << "Exiting...\n";
                break;

            default:
                cout << "Invalid choice.\n";
        }
    } while (choice != 0);

    return 0;
}
```
