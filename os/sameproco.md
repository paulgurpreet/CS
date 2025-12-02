```
#include <iostream>
#include <unistd.h>
using namespace std;

int main() {
    pid_t pid = fork();

    if(pid < 0) {
        cout << " Fork failed " << endl;
    }
    else {
        cout << "Process execution,PID: " << getpid() << endl;
    }

    return 0;
}
```
