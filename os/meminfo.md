```
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    ifstream meminfo("/proc/meminfo");
    if (!meminfo) {
        cout << "Error: Cannot open /proc/meminfo" << endl;
        return 1;
    }

    string key, unit;
    long memTotal = 0;
    long memFree = 0;
    long buffers = 0;
    long cached = 0;
    long value = 0;

    // Read data line by line
    while (meminfo >> key >> value >> unit) {
        if (key == "MemTotal:")   memTotal = value;
        else if (key == "MemFree:")  memFree = value;
        else if (key == "Buffers:")  buffers = value;
        else if (key == "Cached:")   cached = value;
    }

    long usedMemory = memTotal - (memFree + buffers + cached);

    cout << "\n--- Linux Memory Information ---\n";
    cout << "Configured Memory (Total): " << memTotal  << " kB\n";
    cout << "Free Memory:              " << memFree   << " kB\n";
    cout << "Buffers:                  " << buffers   << " kB\n";
    cout << "Cached:                   " << cached    << " kB\n";
    cout << "Used Memory (Calculated): " << usedMemory << " kB\n";

    return 0;
}
```
