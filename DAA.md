Q1. Write a program to sort the elements of an array using Insertion Sort (The program should
report the number of comparisons).
```
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;

    int arr[n];

    cout << "Enter elements:\n";
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    int comparisons = 0;

    for(int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        while(j >= 0) {
            comparisons++;

            if(arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            else {
                break;
            }
        }

        arr[j + 1] = key;
    }

    cout << "Sorted Array:\n";
    for(int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }

    cout << "\nComparisons = " << comparisons;

    return 0;
}
```

Q2. Write a program to sort the elements of an array using Merge Sort (The program should report
the number of comparisons).

```
#include <iostream>
using namespace std;

int comparisons = 0;

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int L[n1], R[n2];

    for(int i = 0; i < n1; i++)
        L[i] = arr[left + i];

    for(int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    while(i < n1 && j < n2) {
        comparisons++;

        if(L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        }
        else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while(i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while(j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(int arr[], int left, int right) {
    if(left < right) {
        int mid = (left + right) / 2;

        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);

        merge(arr, left, mid, right);
    }
}

int main() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;

    int arr[n];

    cout << "Enter elements:\n";
    for(int i = 0; i < n; i++)
        cin >> arr[i];

    mergeSort(arr, 0, n - 1);

    cout << "Sorted Array:\n";
    for(int i = 0; i < n; i++)
        cout << arr[i] << " ";

    cout << "\nComparisons = " << comparisons;
}
```

Q3. Write a program to sort the elements of an array using Heap Sort (The program should report
the number of comparisons).

```
#include <iostream>
using namespace std;

int comparisons = 0;

void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if(left < n) {
        comparisons++;
        if(arr[left] > arr[largest])
            largest = left;
    }

    if(right < n) {
        comparisons++;
        if(arr[right] > arr[largest])
            largest = right;
    }

    if(largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for(int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    for(int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

int main() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;

    int arr[n];

    cout << "Enter elements:\n";
    for(int i = 0; i < n; i++)
        cin >> arr[i];

    heapSort(arr, n);

    cout << "Sorted Array:\n";
    for(int i = 0; i < n; i++)
        cout << arr[i] << " ";

    cout << "\nComparisons = " << comparisons;

    return 0;
}
```

Q4. Write a program to multiply two matrices using Strassen's algorithm for matrix multiplication

```
#include <iostream>
using namespace std;

void add(int A[2][2], int B[2][2], int C[2][2]) {
    for(int i = 0; i < 2; i++)
        for(int j = 0; j < 2; j++)
            C[i][j] = A[i][j] + B[i][j];
}

void subtract(int A[2][2], int B[2][2], int C[2][2]) {
    for(int i = 0; i < 2; i++)
        for(int j = 0; j < 2; j++)
            C[i][j] = A[i][j] - B[i][j];
}

int main() {
    int A[2][2], B[2][2], C[2][2];

    cout << "Enter Matrix A:\n";
    for(int i = 0; i < 2; i++)
        for(int j = 0; j < 2; j++)
            cin >> A[i][j];

    cout << "Enter Matrix B:\n";
    for(int i = 0; i < 2; i++)
        for(int j = 0; j < 2; j++)
            cin >> B[i][j];

    int p1 = A[0][0] * (B[0][1] - B[1][1]);
    int p2 = (A[0][0] + A[0][1]) * B[1][1];
    int p3 = (A[1][0] + A[1][1]) * B[0][0];
    int p4 = A[1][1] * (B[1][0] - B[0][0]);
    int p5 = (A[0][0] + A[1][1]) * (B[0][0] + B[1][1]);
    int p6 = (A[0][1] - A[1][1]) * (B[1][0] + B[1][1]);
    int p7 = (A[0][0] - A[1][0]) * (B[0][0] + B[0][1]);

    C[0][0] = p5 + p4 - p2 + p6;
    C[0][1] = p1 + p2;
    C[1][0] = p3 + p4;
    C[1][1] = p1 + p5 - p3 - p7;

    cout << "Result Matrix:\n";
    for(int i = 0; i < 2; i++) {
        for(int j = 0; j < 2; j++) {
            cout << C[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
```

Q5. Write a program to sort the elements of an array using Radix Sort.

```
#include <iostream>
using namespace std;

void countingSort(int arr[], int n, int exp)
{
    int output[1000];
    int count[10] = {0};

    for(int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;

    for(int i = 1; i < 10; i++)
        count[i] += count[i - 1];

    for(int i = n - 1; i >= 0; i--)
    {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    for(int i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(int arr[], int n)
{
    int max = arr[0];

    for(int i = 1; i < n; i++)
    {
        if(arr[i] > max)
            max = arr[i];
    }

    for(int exp = 1; max / exp > 0; exp *= 10)
        countingSort(arr, n, exp);
}

int main()
{
    int n;
    cout << "Enter number of elements: ";
    cin >> n;

    int arr[1000];

    cout << "Enter elements:";
    for(int i = 0; i < n; i++)
        cin >> arr[i];

    radixSort(arr, n);

    cout << "Sorted Array:";
    for(int i = 0; i < n; i++)
        cout << arr[i] << " ";

    return 0;
}
```

Q6. Write a program to sort the elements of an array using Bucket Sort.
```
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void bucketSort(float arr[], int n)
{
    vector<float> bucket[10];

    for(int i = 0; i < n; i++)
    {
        int index = arr[i] * 10;
        bucket[index].push_back(arr[i]);
    }

    for(int i = 0; i < 10; i++)
        sort(bucket[i].begin(), bucket[i].end());

    int k = 0;

    for(int i = 0; i < 10; i++)
    {
        for(int j = 0; j < bucket[i].size(); j++)
        {
            arr[k++] = bucket[i][j];
        }
    }
}

int main()
{
    int n;
    cout << "Enter number of elements: ";
    cin >> n;

    float arr[100];

    cout << "Enter elements between 0 and 1:
";
    for(int i = 0; i < n; i++)
        cin >> arr[i];

    bucketSort(arr, n);

    cout << "Sorted Array:
";
    for(int i = 0; i < n; i++)
        cout << arr[i] << " ";

    return 0;
}
```

Q7. Display the data stored in a given graph using the Breadth-First Search algorithm.
```
#include <iostream>
#include <queue>
using namespace std;

int main()
{
    int n;
    cout << "Enter number of vertices: ";
    cin >> n;

    int graph[10][10];

    cout << "Enter adjacency matrix:";
    for(int i = 0; i < n; i++)
    {
        for(int j = 0; j < n; j++)
            cin >> graph[i][j];
    }

    int start;
    cout << "Enter starting vertex: ";
    cin >> start;

    bool visited[10] = {false};
    queue<int> q;

    visited[start] = true;
    q.push(start);

    cout << "BFS Traversal: ";

    while(!q.empty())
    {
        int current = q.front();
        q.pop();

        cout << current << " ";

        for(int i = 0; i < n; i++)
        {
            if(graph[current][i] == 1 && !visited[i])
            {
                visited[i] = true;
                q.push(i);
            }
        }
    }

    return 0;
}
```

Q8. Display the data stored in a given graph using the Depth-First Search algorithm.

```
#include <iostream>
using namespace std;

void dfs(int graph[10][10], int visited[10], int node, int n)
{
    visited[node] = 1;
    cout << node << " ";

    for(int i = 0; i < n; i++)
    {
        if(graph[node][i] == 1 && visited[i] == 0)
            dfs(graph, visited, i, n);
    }
}

int main()
{
    int n;
    cout << "Enter number of vertices: ";
    cin >> n;

    int graph[10][10];
    int visited[10] = {0};

    cout << "Enter adjacency matrix:";
    for(int i = 0; i < n; i++)
    {
        for(int j = 0; j < n; j++)
            cin >> graph[i][j];
    }

    int start;
    cout << "Enter starting vertex: ";
    cin >> start;

    cout << "DFS Traversal: ";
    dfs(graph, visited, start, n);

    return 0;
}
```

Q9. Write a program to determine a minimum spanning tree of a graph using Prim's algorithm.

```
#include <iostream>
#include <climits>
using namespace std;

int main()
{
    int n;
    cout << "Enter number of vertices: ";
    cin >> n;

    int graph[10][10];

    cout << "Enter adjacency matrix:";
    for(int i = 0; i < n; i++)
    {
        for(int j = 0; j < n; j++)
            cin >> graph[i][j];
    }

    int parent[10];
    int key[10];
    bool mstSet[10];

    for(int i = 0; i < n; i++)
    {
        key[i] = INT_MAX;
        mstSet[i] = false;
    }

    key[0] = 0;
    parent[0] = -1;

    for(int count = 0; count < n - 1; count++)
    {
        int min = INT_MAX, u;

        for(int v = 0; v < n; v++)
        {
            if(mstSet[v] == false && key[v] < min)
            {
                min = key[v];
                u = v;
            }
        }

        mstSet[u] = true;

        for(int v = 0; v < n; v++)
        {
            if(graph[u][v] && mstSet[v] == false && graph[u][v] < key[v])
            {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }

    cout << "Edge 	 Weight";
    for(int i = 1; i < n; i++)
        cout << parent[i] << " - " << i << "	" << graph[i][parent[i]] << endl;

    return 0;
}
```

Q10. Write a program to implement Dijkstra's algorithm to find the shortest paths from a given
source node to all other nodes in a graph.

```
#include <iostream>
#include <climits>
using namespace std;

int minDistance(int dist[], bool visited[], int n)
{
    int min = INT_MAX, min_index;

    for(int v = 0; v < n; v++)
    {
        if(visited[v] == false && dist[v] <= min)
        {
            min = dist[v];
            min_index = v;
        }
    }

    return min_index;
}
int main()
{
    int n;
    cout << "Enter number of vertices: ";
    cin >> n;

    int graph[10][10];

    cout << "Enter adjacency matrix:";
    for(int i = 0; i < n; i++)
    {
        for(int j = 0; j < n; j++)
            cin >> graph[i][j];
    }

    int source;
    cout << "Enter source vertex: ";
    cin >> source;

    int dist[10];
    bool visited[10];

    for(int i = 0; i < n; i++)
    {
        dist[i] = INT_MAX;
        visited[i] = false;
    }

    dist[source] = 0;

    for(int count = 0; count < n - 1; count++)
    {
        int u = minDistance(dist, visited, n);
        visited[u] = true;

        for(int v = 0; v < n; v++)
        {
            if(!visited[v] && graph[u][v] && dist[u] != INT_MAX
               && dist[u] + graph[u][v] < dist[v])
            {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    cout << "Vertex	Distance";
    for(int i = 0; i < n; i++)
        cout << i << "	" << dist[i] << endl;

    return 0;
}
```

Q11. Write a program to solve the weighted interval scheduling problem.

```
#include <iostream>
#include <algorithm>
using namespace std;

struct Job
{
    int start, finish, profit;
};

bool compare(Job a, Job b)
{
    return a.finish < b.finish;
}

int latestNonConflict(Job arr[], int i)
{
    for(int j = i - 1; j >= 0; j--)
    {
        if(arr[j].finish <= arr[i].start)
            return j;
    }
    return -1;
}

int main()
{
    int n;
    cout << "Enter number of jobs: ";
    cin >> n;

    Job arr[100];

    cout << "Enter start finish profit:";
    for(int i = 0; i < n; i++)
        cin >> arr[i].start >> arr[i].finish >> arr[i].profit;

    sort(arr, arr + n, compare);

    int dp[100];
    dp[0] = arr[0].profit;

    for(int i = 1; i < n; i++)
    {
        int includeProfit = arr[i].profit;
        int l = latestNonConflict(arr, i);

        if(l != -1)
            includeProfit += dp[l];

        dp[i] = max(includeProfit, dp[i - 1]);
    }

    cout << "Maximum Profit = " << dp[n - 1];

    return 0;
}
```
Q12. Write a program to solve the 0-1 knapsack problem.

```
#include <iostream>
using namespace std;

int maxValue(int a, int b)
{
    if(a > b)
        return a;
    else
        return b;
}

int main()
{
    int n;
    cout << "Enter number of items: ";
    cin >> n;

    int weight[100], profit[100];

    cout << "Enter weights:";
    for(int i = 0; i < n; i++)
        cin >> weight[i];

    cout << "Enter profits:";
    for(int i = 0; i < n; i++)
        cin >> profit[i];

    int capacity;
    cout << "Enter knapsack capacity: ";
    cin >> capacity;

    int dp[100][100];

    for(int i = 0; i <= n; i++)
    {
        for(int w = 0; w <= capacity; w++)
        {
            if(i == 0 || w == 0)
                dp[i][w] = 0;
            else if(weight[i - 1] <= w)
                dp[i][w] = maxValue(profit[i - 1] + dp[i - 1][w - weight[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }

    cout << "Maximum Profit = " << dp[n][capacity];

    return 0;
}
```
