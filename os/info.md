```
#include <iostream>
#include <cstdlib>   // for system()
using namespace std;

int main() {

    cout << "----- Linux System Information -----\n" << endl;

    // Kernel version
    cout << "Kernel Version:\n";
    system("uname -r");
    cout << endl;

    // CPU type / architecture
    cout << "CPU Type (Architecture):\n";
    system("uname -m");
    cout << endl;

    // Full CPU information
    cout << "Detailed CPU Information:\n";
    system("cat /proc/cpuinfo");
    cout << endl;

    return 0;
}
```
