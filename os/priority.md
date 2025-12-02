```
// Q10 – Non-preemptive Priority Scheduling (no input)
#include <iostream>
using namespace std;

struct Process {
    int pid;
    int at;    // Arrival Time
    int bt;    // Burst Time
    int pr;    // Priority (smaller value = higher priority)
    int wt;    // Waiting Time
    int tat;   // Turnaround Time
    bool finished;
};

int main() {
    int n;
    cout << "Enter number of processes: ";
    cin >> n;

    Process p[n];

    // ✅ Input
    for (int i = 0; i < n; ++i) {
        p[i].pid = i + 1;

        cout << "\nEnter Arrival Time for P" << p[i].pid << ": ";
        cin >> p[i].at;

        cout << "Enter Burst Time for P" << p[i].pid << ": ";
        cin >> p[i].bt;

        cout << "Enter Priority for P" << p[i].pid 
             << " (smaller number = higher priority): ";
        cin >> p[i].pr;

        p[i].finished = false;
    }

    int current = 0, completed = 0;
    double totalW = 0, totalT = 0;

    // ✅ Non-Preemptive Priority Scheduling Logic
    while (completed < n) {
        int idx = -1;
        int bestPr = 1e9;

        // Select highest priority process among arrived & not finished
        for (int i = 0; i < n; ++i) {
            if (!p[i].finished && p[i].at <= current &&
                p[i].pr < bestPr) {
                bestPr = p[i].pr;
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

    // ✅ Output
    cout << "\nNon-Preemptive Priority Scheduling Result\n";
    cout << "PID\tAT\tBT\tPR\tWT\tTAT\n";

    for (int i = 0; i < n; ++i) {
        cout << p[i].pid << '\t'
             << p[i].at  << '\t'
             << p[i].bt  << '\t'
             << p[i].pr  << '\t'
             << p[i].wt  << '\t'
             << p[i].tat << '\n';
    }

    cout << "\nAverage Waiting Time   = " << totalW / n;
    cout << "\nAverage Turnaround Time = " << totalT / n << endl;

    return 0;
}
```
