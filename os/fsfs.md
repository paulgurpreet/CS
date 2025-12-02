```
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter number of processes: ";
    cin >> n;

    int pid[n], arrival[n], burst[n], wt[n], tat[n];
    int current = 0;
    double totalW = 0, totalT = 0;

    // Input
    for (int i = 0; i < n; ++i) {
        pid[i] = i + 1;
        cout << "\nEnter Arrival Time for P" << pid[i] << ": ";
        cin >> arrival[i];
        cout << "Enter Burst Time for P" << pid[i] << ": ";
        cin >> burst[i];
    }

    // FCFS Calculation
    for (int i = 0; i < n; ++i) {
        if (current < arrival[i])
            current = arrival[i];   // CPU idle until process arrives

        wt[i] = current - arrival[i];
        current += burst[i];
        tat[i] = wt[i] + burst[i];

        totalW += wt[i];
        totalT += tat[i];
    }

    // Output
    cout << "\nFCFS Scheduling Result\n";
    cout << "PID\tAT\tBT\tWT\tTAT\n";

    for (int i = 0; i < n; ++i) {
        cout << pid[i] << '\t'
             << arrival[i] << '\t'
             << burst[i]   << '\t'
             << wt[i]      << '\t'
             << tat[i]     << '\n';
    }

    cout << "\nAverage Waiting Time   = " << totalW / n;
    cout << "\nAverage Turnaround Time = " << totalT / n << endl;

    return 0;
}
```
