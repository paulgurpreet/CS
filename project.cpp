// main.cpp
#include <iostream>
#include <fstream>
#include <ctime>
#include <cstdlib>
#include <string>
#include <cmath>
#include <curl/curl.h>
#include <openssl/evp.h>

using namespace std;

// -------------------- RSA Utility --------------------
long long gcd(long long a, long long b) {
    return b == 0 ? a : gcd(b, a % b);
}

long long modexp(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1)
            result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return result;
}

long long modinv(long long a, long long m) {
    for (long long x = 1; x < m; x++) {
        if ((a * x) % m == 1)
            return x;
    }
    return -1;
}

bool is_prime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i <= sqrt(n); i++) {
        if (n % i == 0) return false;
    }
    return true;
}

// -------------------- RSA Key Generation --------------------
void generate_keys(long long& e, long long& d, long long& n) {
    int p = 61, q = 53; // Small primes (for demonstration)
    n = p * q;
    long long phi = (p - 1) * (q - 1);
    e = 17; // Choose e
    d = modinv(e, phi);

    ofstream keyFile("keys.txt");
    keyFile << "public key -> (" << e << ", " << n << ")\n";
    keyFile << "private key -> (" << d << ", " << n << ")\n";
    keyFile.close();
}

// -------------------- SHA-P256 Using OpenSSL --------------------
string sha_p256(const string& input) {
    unsigned char hash[EVP_MAX_MD_SIZE];
    unsigned int lengthOfHash = 0;

    EVP_MD_CTX* context = EVP_MD_CTX_new();
    if (context != nullptr) {
        if (EVP_DigestInit_ex(context, EVP_sha256(), nullptr)) {
            if (EVP_DigestUpdate(context, input.c_str(), input.length())) {
                if (EVP_DigestFinal_ex(context, hash, &lengthOfHash)) {
                    EVP_MD_CTX_free(context);
                    char buf[65];
                    for (unsigned int i = 0; i < lengthOfHash; i++) {
                        sprintf(buf + (i * 2), "%02x", hash[i]);
                    }
                    buf[lengthOfHash * 2] = 0;
                    return string(buf);
                }
            }
        }
        EVP_MD_CTX_free(context);
    }
    return "";
}

// -------------------- RSA Sign --------------------
long long rsa_sign(const string& message_hash, long long d, long long n) {
    long long num = stoll(message_hash.substr(0, 5), nullptr, 16);
    return modexp(num, d, n);
}

// -------------------- OTP Generation --------------------
string generate_otp() {
    srand(time(0));
    string otp = "";
    for (int i = 0; i < 6; i++)
        otp += to_string(rand() % 10);
    return otp;
}

// -------------------- Email via Gmail --------------------
void send_email(const string& recipient, const string& otp) {
    CURL* curl = curl_easy_init();
    if (curl) {
        string username = "your_email@gmail.com";
        string password = "your_app_password"; // App password from Google

        string message = "To: " + recipient + "\r\n"
                         "From: " + username + "\r\n"
                         "Subject: Your OTP\r\n"
                         "\r\n"
                         "Your OTP is: " + otp + "\r\n";

        curl_easy_setopt(curl, CURLOPT_USERNAME, username.c_str());
        curl_easy_setopt(curl, CURLOPT_PASSWORD, password.c_str());
        curl_easy_setopt(curl, CURLOPT_URL, "smtps://smtp.gmail.com:465");
        curl_easy_setopt(curl, CURLOPT_MAIL_FROM, ("<" + username + ">" ).c_str());

        struct curl_slist* recipients = NULL;
        recipients = curl_slist_append(recipients, ("<" + recipient + ">" ).c_str());
        curl_easy_setopt(curl, CURLOPT_MAIL_RCPT, recipients);

        curl_easy_setopt(curl, CURLOPT_READFUNCTION, [](char* ptr, size_t size, size_t nmemb, void* userdata) -> size_t {
            string* msg = static_cast<string*>(userdata);
            size_t len = msg->size();
            memcpy(ptr, msg->c_str(), len);
            msg->clear(); return len;
        });
        curl_easy_setopt(curl, CURLOPT_READDATA, &message);
        curl_easy_setopt(curl, CURLOPT_UPLOAD, 1L);
        curl_easy_perform(curl);
        curl_slist_free_all(recipients);
        curl_easy_cleanup(curl);
    }
}

// -------------------- MAIN --------------------
int main() {
    long long e, d, n;
    generate_keys(e, d, n);

    string otp = generate_otp();
    string hashed = sha_p256(otp);
    long long signature = rsa_sign(hashed, d, n);

    ofstream sigFile("signature.txt");
    sigFile << "OTP: " << otp << "\n";
    sigFile << "SHA-P256 hash: " << hashed << "\n";
    sigFile << "Digital Signature: " << signature << "\n";
    sigFile << "Generated at: " << time(0) << " (valid for 180 seconds)\n";
    sigFile.close();

    string recipient_email = "recipient@example.com"; // <-- change this
    send_email(recipient_email, otp);

    cout << "OTP sent and digitally signed. Check your email." << endl;
    return 0;
}
