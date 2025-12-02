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
