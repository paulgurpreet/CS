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
