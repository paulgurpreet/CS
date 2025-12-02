```
#include <iostream>
#include <unistd.h>
using namespace std;

int main() {
    pid_t pid = fork();

    if(pid < 0) {
        cout << " Fork failed " << endl;
    }
    else if(pid == 0) {
        cout << " Child process executing " << endl;
        cout << " Child PID: " << getpid() << endl;
    }
    else {
        cout << " Parent Process is executing " << endl;
        cout << " Parent PID: " << getpid() << endl;
    }

    return 0;
}
```
