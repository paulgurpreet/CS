```
#include <iostream>
#include <string>
#include <ctime>

using namespace std;

// Structure for messages stored in BST
struct MessageNode {
    string encryptedMessage;
    time_t timestamp;
    MessageNode* left;
    MessageNode* right;

    MessageNode(string msg, time_t time) {
        encryptedMessage = msg;
        timestamp = time;
        left = right = NULL;
    }
};

// Structure for users (linked list)
struct User {
    string username;
    string password;
    User* next;
    MessageNode* chatHistory; // BST Root
};

// Function to get current timestamp
string getCurrentTime() {
    time_t now = time(0);
    string timeStr = ctime(&now);
    timeStr.pop_back(); // Removes trailing '\n'
    return timeStr;
}

// Function to encrypt message (Caesar Cipher)
string encryptMessage(string msg, int shift = 3) {
    for (char &c : msg) {
        if (isupper(c))
            c = (c - 'A' + shift) % 26 + 'A';
        else if (islower(c))
            c = (c - 'a' + shift) % 26 + 'a';
    }
    return msg;
}

// Function to decrypt message (Caesar Cipher)
string decryptMessage(string msg, int shift = 3) {
    for (char &c : msg) {
        if (isupper(c))
            c = (c - 'A' - shift + 26) % 26 + 'A';
        else if (islower(c))
            c = (c - 'a' - shift + 26) % 26 + 'a';
    }
    return msg;
}

// Function to insert a message into BST
MessageNode* insertMessage(MessageNode* root, string msg) {
    time_t timestamp = time(0);
    if (root == NULL) {
        return new MessageNode(encryptMessage(msg), timestamp);
    }
    if (timestamp < root->timestamp)
        root->left = insertMessage(root->left, msg);
    else
        root->right = insertMessage(root->right, msg);
    return root;
}

// Function to retrieve messages in order
void retrieveMessages(MessageNode* root) {
    if (root == NULL) return;
    retrieveMessages(root->left);
    cout << "Time: " << ctime(&root->timestamp) << " | Message: " << decryptMessage(root->encryptedMessage) << endl;
    retrieveMessages(root->right);
}

// Function to register a new user
void registerUser(User*& head, string username, string password) {
    User* newUser = new User{username, password, NULL, NULL};
    newUser->next = head;
    head = newUser;
}

// Function to login user
User* loginUser(User* head, string username, string password) {
    while (head) {
        if (head->username == username && head->password == password)
            return head;
        head = head->next;
    }
    return NULL;
}

// Function to send a message
void sendMessage(User* sender, string msg) {
    sender->chatHistory = insertMessage(sender->chatHistory, msg);
    cout << "Message Sent!" << endl;
}

// Function to view chat history
void viewChatHistory(User* user) {
    if (user->chatHistory == NULL) {
        cout << "No chat history available!" << endl;
        return;
    }
    cout << "Chat History for " << user->username << ":\n";
    retrieveMessages(user->chatHistory);
}

// Main function
int main() {
    User* userList = NULL;
    User* loggedInUser = NULL;
    int choice;

    while (true) {
        cout << "\n1. Register\n2. Login\n3. Send Message\n4. View Chat History\n5. Logout\n6. Exit\nEnter choice: ";
        cin >> choice;
        cin.ignore();

        if (choice == 1) {
            string uname, pass;
            cout << "Enter Username: ";
            getline(cin, uname);
            cout << "Enter Password: ";
            getline(cin, pass);
            registerUser(userList, uname, pass);
            cout << "User Registered Successfully!\n";

        } else if (choice == 2) {
            string uname, pass;
            cout << "Enter Username: ";
            getline(cin, uname);
            cout << "Enter Password: ";
            getline(cin, pass);
            loggedInUser = loginUser(userList, uname, pass);
            if (loggedInUser) cout << "Login Successful!\n";
            else cout << "Invalid Credentials!\n";

        } else if (choice == 3) {
            if (!loggedInUser) {
                cout << "Login first!\n";
                continue;
            }
            string msg;
            cout << "Enter Message: ";
            getline(cin, msg);
            sendMessage(loggedInUser, msg);

        } else if (choice == 4) {
            if (!loggedInUser) {
                cout << "Login first!\n";
                continue;
            }
            viewChatHistory(loggedInUser);

        } else if (choice == 5) {
            if (!loggedInUser) {
                cout << "You are not logged in!\n";
            } else {
                cout << loggedInUser->username << " logged out successfully!\n";
                loggedInUser = NULL;
            }

        } else if (choice == 6) {
            cout << "Exiting...\n";
            break;

        } else {
            cout << "Invalid choice! Please try again.\n";
        }
    }

    return 0;
}
```
![gg](https://github.com/user-attachments/assets/07bc4980-783c-41a7-ba7c-ec71b2a1986d)
