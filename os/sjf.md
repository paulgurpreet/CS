```
#include <iostream>
using namespace std;

struct Process {
    int pid;
    int at;     // Arrival Time
    int bt;     // Burst Time
    int wt;     // Waiting Time
    int tat;    // Turnaround Time
    bool finished;
};

int main() {
    int n;
    cout << "Enter number of processes: ";
    cin >> n;

    Process p[n];

    // Input
    for (int i = 0; i < n; ++i) {
        p[i].pid = i + 1;
        cout << "\nEnter Arrival Time for P" << p[i].pid << ": ";
        cin >> p[i].at;
        cout << "Enter Burst Time for P" << p[i].pid << ": ";
        cin >> p[i].bt;

        p[i].finished = false;
    }

    int current = 0, completed = 0;
    double totalW = 0, totalT = 0;

    // SJF Non-preemptive Scheduling
    while (completed < n) {
        int idx = -1;
        int minBT = 1e9;

        // Select shortest job among arrived and not finished
        for (int i = 0; i < n; ++i) {
            if (!p[i].finished && p[i].at <= current && p[i].bt < minBT) {
                minBT = p[i].bt;
                idx = i;
            }
        }

        if (idx == -1) {   // CPU is idle
            current++;
            continue;
        }

        p[idx].wt = current - p[idx].at;
        current += p[idx].bt;
        p[idx].tat = p[idx].wt + p[idx].bt;
        p[idx].finished = true;
        completed++;

        totalW += p[idx].wt;
        totalT += p[idx].tat;
    }

    // Output
    cout << "\nSJF (Non-preemptive) Scheduling Result\n";
    cout << "PID\tAT\tBT\tWT\tTAT\n";

    for (int i = 0; i < n; ++i) {
        cout << p[i].pid << '\t'
             << p[i].at  << '\t'
             << p[i].bt  << '\t'
             << p[i].wt  << '\t'
             << p[i].tat << '\n';
    }

    cout << "\nAverage Waiting Time   = " << totalW / n;
    cout << "\nAverage Turnaround Time = " << totalT / n << endl;

    return 0;
}
```
