```
#include <iostream>
#include <climits>
using namespace std;

void printAllocation(const char* title,
                     int alloc[],
                     int process[],
                     int NP) {
    cout << '\n' << title << ":\n";
    cout << "Process\tSize\tBlock\n";
    for (int i = 0; i < NP; ++i) {
        cout << "P" << i + 1 << "\t" << process[i] << "\t";
        if (alloc[i] == -1)
            cout << "Not Allocated";
        else
            cout << "B" << alloc[i] + 1;
        cout << '\n';
    }
}

int main() {
    int NB, NP;

    cout << "Enter number of memory blocks: ";
    cin >> NB;

    cout << "Enter number of processes: ";
    cin >> NP;

    int blocks[NB], process[NP];

    // Input memory blocks
    cout << "\nEnter sizes of memory blocks:\n";
    for (int i = 0; i < NB; ++i) {
        cout << "Block " << i + 1 << ": ";
        cin >> blocks[i];
    }

    // Input process sizes
    cout << "\nEnter sizes of processes:\n";
    for (int i = 0; i < NP; ++i) {
        cout << "Process P" << i + 1 << ": ";
        cin >> process[i];
    }

    /* ---------- First Fit ---------- */
    int b1[NB], allocFF[NP];
    for (int i = 0; i < NB; ++i) b1[i] = blocks[i];
    for (int i = 0; i < NP; ++i) allocFF[i] = -1;

    for (int i = 0; i < NP; ++i) {
        for (int j = 0; j < NB; ++j) {
            if (b1[j] >= process[i]) {
                allocFF[i] = j;
                b1[j] -= process[i];
                break;
            }
        }
    }
    printAllocation("First Fit Allocation", allocFF, process, NP);

    /* ---------- Best Fit ---------- */
    int b2[NB], allocBF[NP];
    for (int i = 0; i < NB; ++i) b2[i] = blocks[i];
    for (int i = 0; i < NP; ++i) allocBF[i] = -1;

    for (int i = 0; i < NP; ++i) {
        int bestIdx = -1;
        int bestRem = INT_MAX;

        for (int j = 0; j < NB; ++j) {
            if (b2[j] >= process[i] && b2[j] - process[i] < bestRem) {
                bestRem = b2[j] - process[i];
                bestIdx = j;
            }
        }

        if (bestIdx != -1) {
            allocBF[i] = bestIdx;
            b2[bestIdx] -= process[i];
        }
    }
    printAllocation("Best Fit Allocation", allocBF, process, NP);

    /* ---------- Worst Fit ---------- */
    int b3[NB], allocWF[NP];
    for (int i = 0; i < NB; ++i) b3[i] = blocks[i];
    for (int i = 0; i < NP; ++i) allocWF[i] = -1;

    for (int i = 0; i < NP; ++i) {
        int worstIdx = -1;
        int worstRem = -1;

        for (int j = 0; j < NB; ++j) {
            if (b3[j] >= process[i] && b3[j] - process[i] > worstRem) {
                worstRem = b3[j] - process[i];
                worstIdx = j;
            }
        }

        if (worstIdx != -1) {
            allocWF[i] = worstIdx;
            b3[worstIdx] -= process[i];
        }
    }
    printAllocation("Worst Fit Allocation", allocWF, process, NP);

    return 0;
}
```
```
// Q7 – copy file using system calls
#include <iostream>
#include <fcntl.h>      // open
#include <unistd.h>     // read, write, close
#include <sys/stat.h>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 3) {
        cerr << "Usage: " << argv[0] << " <source> <destination>\n";
        return 1;
    }

    int src = open(argv[1], O_RDONLY);
    if (src < 0) {
        perror("open source");
        return 1;
    }

    int dest = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (dest < 0) {
        perror("open dest");
        close(src);
        return 1;
    }

    char buffer[4096];
    ssize_t bytes;
    while ((bytes = read(src, buffer, sizeof(buffer))) > 0) {
        if (write(dest, buffer, bytes) != bytes) {
            perror("write");
            close(src);
            close(dest);
            return 1;
        }
    }

    if (bytes < 0)
        perror("read");

    close(src);
    close(dest);

    cout << "File copied successfully.\n";
    return 0;
}
```
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
```
#include <iostream>
#include <unistd.h>     // fork, sleep, getpid
#include <sys/types.h>  // pid_t
#include <sys/wait.h>   // wait

using namespace std;

int main() {
    pid_t pid = fork();

    if(pid < 0) {
        cout << " Fork failed " << endl;
    }
    else if(pid == 0) {
        cout << " Child running, PID: " << getpid() << endl;
        sleep(2);  // simulate some work
        cout << " Child finished\n";
    }
    else {
        wait(NULL);  // parent waits for child to finish
        cout << " Parent waited for child. Parent PID: " << getpid() << endl;
    }

    return 0;
}
```
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
```
#include <iostream>
#include <pthread.h>
using namespace std;

long long sum = 0;          // Shared global sum
pthread_mutex_t mutex;     // Mutex for synchronization

struct ThreadData {
    int start;
    int end;
};

// Thread function
void* partial_sum(void* arg) {
    ThreadData* data = (ThreadData*)arg;
    long long local_sum = 0;

    for (int i = data->start; i <= data->end; i++) {
        local_sum += i;
    }

    pthread_mutex_lock(&mutex);   // Lock before updating shared sum
    sum += local_sum;
    pthread_mutex_unlock(&mutex); // Unlock after update

    pthread_exit(NULL);
}

int main() {
    int n, num_threads;

    cout << "Enter n: ";
    cin >> n;

    cout << "Enter number of threads: ";
    cin >> num_threads;

    pthread_t threads[num_threads];
    ThreadData tdata[num_threads];

    pthread_mutex_init(&mutex, NULL);

    int range = n / num_threads;
    int start = 1;

    for (int i = 0; i < num_threads; i++) {
        tdata[i].start = start;

        if (i == num_threads - 1)
            tdata[i].end = n;
        else
            tdata[i].end = start + range - 1;

        start = tdata[i].end + 1;

        pthread_create(&threads[i], NULL, partial_sum, &tdata[i]);
    }

    for (int i = 0; i < num_threads; i++) {
        pthread_join(threads[i], NULL);
    }

    pthread_mutex_destroy(&mutex);

    cout << "Sum = " << sum << endl;

    return 0;
}
```
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










