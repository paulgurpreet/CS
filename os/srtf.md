```
#include <iostream>
#include <climits>
using namespace std;

int main() {
    int n;
    cout << "Enter number of processes: ";
    cin >> n;

    int pid[n], at[n], bt[n], rt[n];
    int ct[n], wt[n], tat[n];

    //  Input
    for (int i = 0; i < n; ++i) {
        pid[i] = i + 1;

        cout << "\nEnter Arrival Time for P" << pid[i] << ": ";
        cin >> at[i];

        cout << "Enter Burst Time for P" << pid[i] << ": ";
        cin >> bt[i];

        rt[i] = bt[i];   // remaining time initially = burst time
    }

    int completed = 0;
    int time = 0;

    // Preemptive SRTF Scheduling
    while (completed < n) {
        int idx = -1;
        int minRT = INT_MAX;

        // Select process with smallest remaining time among arrived
        for (int i = 0; i < n; ++i) {
            if (at[i] <= time && rt[i] > 0 && rt[i] < minRT) {
                minRT = rt[i];
                idx = i;
            }
        }

        if (idx == -1) {   // CPU idle
            time++;
            continue;
        }

        // Run selected process for 1 time unit
        rt[idx]--;
        time++;

        // If process finishes
        if (rt[idx] == 0) {
            completed++;
            ct[idx] = time;   // completion time
        }
    }

    double totalW = 0, totalT = 0;

    //  Calculate WT and TAT
    for (int i = 0; i < n; ++i) {
        tat[i] = ct[i] - at[i];     // Turnaround Time
        wt[i]  = tat[i] - bt[i];   // Waiting Time

        totalW += wt[i];
        totalT += tat[i];
    }

    // Output
    cout << "\nSRTF (Preemptive) Scheduling Result\n";
    cout << "PID\tAT\tBT\tCT\tWT\tTAT\n";

    for (int i = 0; i < n; ++i) {
        cout << pid[i] << '\t'
             << at[i]  << '\t'
             << bt[i]  << '\t'
             << ct[i]  << '\t'
             << wt[i]  << '\t'
             << tat[i] << '\n';
    }

    cout << "\nAverage Waiting Time   = " << totalW / n;
    cout << "\nAverage Turnaround Time = " << totalT / n << endl;

    return 0;
}
```
