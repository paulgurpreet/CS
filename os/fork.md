```
#include <iostream>
#include <sys/types.h>
#include <unistd.h>   // fork, getpid, getppid
#include <cstdlib>    // system()

using namespace std;

int main() {
    cout << "I am the single parent. About to fork...\n";

    pid_t pid = fork();   // create child

    if (pid < 0) {
        perror("fork failed");
        return 1;
    }

    if (pid == 0) {
        // ----- CHILD -----
        cout << "Child: Hello from the C++ CHILD process!  (PID: "
             << getpid() << ", Parent PID: " << getppid() << ")\n";
        // optional: show processes
        // system("ps -o pid,ppid,cmd | head");
    } else {
        // ----- PARENT -----
        cout << "Parent: Hello from the C++ PARENT process! (Child's PID: "
             << pid << ", My PID: " << getpid() << ")\n";
        // optional: give child time to print
        // sleep(1);
    }

    return 0;
}
```
