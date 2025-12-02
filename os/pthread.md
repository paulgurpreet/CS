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
