#include <iostream>
#include <cstdlib>
#include <ctime>
#include <cmath>
#include <sstream>

using namespace std;

// Node for linked list (stores encrypted messages)
struct Node {
    string encryptedText; // Store full encrypted message
    Node* next;
};

// Node for binary tree (stores keys)
struct TreeNode {
    long long value;
    TreeNode* left;
    TreeNode* right;
};

// Function to insert a key into the binary tree
TreeNode* insert(TreeNode* root, long long value) {
    if (!root) return new TreeNode{value, nullptr, nullptr};
    if (value < root->value) root->left = insert(root->left, value);
    else root->right = insert(root->right, value);
    return root;
}

// Function to search for a key in the binary tree
bool search(TreeNode* root, long long value) {
    if (!root) return false;
    if (root->value == value) return true;
    return value < root->value ? search(root->left, value) : search(root->right, value);
}

// Function to check if a number is prime
bool isPrime(long long num) {
    if (num < 2) return false;
    for (long long i = 2; i * i <= num; i++)
        if (num % i == 0) return false;
    return true;
}

// Function to generate a random 5-digit prime number
long long generatePrime() {
    while (true) {
        long long num = rand() % 90000 + 10000;  // Ensure 5-digit range
        if (isPrime(num)) return num;
    }
}

// Function to compute GCD
long long gcd(long long a, long long b) {
    return (b == 0) ? a : gcd(b, a % b);
}

// Function to compute modular inverse (d = e^(-1) mod φ(n))
long long modInverse(long long e, long long phi) {
    for (long long d = 2; d < phi; d++)
        if ((d * e) % phi == 1) return d;
    return -1;
}

// Function to compute (base^exp) % mod
long long modPower(long long base, long long exp, long long mod) {
    long long result = 1;
    while (exp > 0) {
        if (exp % 2 == 1) result = (result * base) % mod;
        base = (base * base) % mod;
        exp /= 2;
    }
    return result;
}

// Encrypt message using RSA
long long encryptRSA(char message, long long n, long long e) {
    return modPower((long long)message, e, n);
}

// Decrypt message using RSA
char decryptRSA(long long encryptedMessage, long long n, long long d) {
    return (char)modPower(encryptedMessage, d, n);
}

int main() {
    srand(time(0));

    long long n, e, d;
    Node* head = nullptr;
    TreeNode* keyTree = nullptr;

    int choice;
    do {
        cout << "\n1. Encrypt Message\n2. Decrypt Message\n3. View Encrypted Messages\n4. Exit\nEnter choice: ";
        cin >> choice;
        cin.ignore();

        if (choice == 1) {
            string message;
            cout << "Enter message to encrypt: ";
            getline(cin, message);

            // Generate RSA keys **only after message is entered**
            long long p = generatePrime();
            long long q = generatePrime();
            n = (long long)p * q;  
            long long phi = (p - 1) * (q - 1);

            do {
                e = rand() % (phi - 2) + 2;
            } while (gcd(e, phi) != 1);

            d = modInverse(e, phi);
            while (d == -1) { // Ensure valid d is found
                e = rand() % (phi - 2) + 2;
                d = modInverse(e, phi);
            }

            // Encrypt message and store in linked list
            ostringstream encryptedStream;
            for (char c : message) {
                long long encryptedChar = encryptRSA(c, n, e);
                encryptedStream << encryptedChar << " ";
            }

            string encryptedMessage = encryptedStream.str();
            cout << "Encrypted Message: " << encryptedMessage << endl;

            // Store encrypted message as a separate node in linked list
            Node* newNode = new Node{encryptedMessage, head};
            head = newNode;

            // Store private key in binary tree
            keyTree = insert(keyTree, d);

            cout << "Public Key (SAVE THIS!): (" << n << ", " << e << ")\n";
            cout << "Private Key (SAVE THIS!): " << d << "\n";

        } else if (choice == 2) {
            long long dKey, encryptedChar;
            cout << "Enter private key: ";
            cin >> dKey;
            cin.ignore();

            // Check if private key exists in the tree
            if (!search(keyTree, dKey)) {
                cout << "Invalid key! Decryption failed.\n";
                continue;
            }

            cout << "Enter encrypted message (space-separated numbers): ";
            string encryptedInput;
            getline(cin, encryptedInput);
            istringstream iss(encryptedInput);

            cout << "Decrypted Message: ";
            while (iss >> encryptedChar) {
                cout << decryptRSA(encryptedChar, n, dKey);
            }
            cout << endl;

        } else if (choice == 3) {
            cout << "Stored Encrypted Messages:\n";
            Node* temp = head;
            int count = 1;
            while (temp) {
                cout << count++ << ". " << temp->encryptedText << endl;
                temp = temp->next;
            }
        }

    } while (choice != 4);

    return 0;
}
