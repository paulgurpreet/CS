#include <iostream>
#include <fstream>
#include <string>
#include <ctime>
#include <cstdlib>
#include <cmath>
#include <sstream>
#include <iomanip>
#include <openssl/sha.h> // Requires OpenSSL for SHA-256

using namespace std;

// Utility function: check if number is prime
bool isPrime(int num) {
    if (num <= 1) return false;
    for (int i = 2; i <= sqrt(num); ++i)
        if (num % i == 0) return false;
    return true;
}

// Generate a random prime number in 3-digit range
int generatePrime() {
    while (true) {
        int num = rand() % 1000;
        if (isPrime(num)) return num;
    }
}

int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

int modInverse(int e, int phi) {
    for (int d = 2; d < phi; ++d)
        if ((d * e) % phi == 1)
            return d;
    return -1;
}

// SHA-256 hash function
string sha256(const string& input) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256((const unsigned char*)input.c_str(), input.size(), hash);
    stringstream ss;
    for (int i = 0; i < SHA256_DIGEST_LENGTH; ++i)
        ss << hex << setw(2) << setfill('0') << (int)hash[i];
    return ss.str();
}

// Convert string hash to integer for signing
int hashToInt(const string& hash) {
    int result = 0;
    for (int i = 0; i < 5; ++i) {
        result = (result * 16 + (isdigit(hash[i]) ? hash[i] - '0' : toupper(hash[i]) - 'A' + 10)) % 10000;
    }
    return result;
}

void saveKeys(int e, int d, int n) {
    ofstream pub("public_key.txt");
    pub << "Public key -> (e, n)\n";
    pub << "Public key (e): " << e << "\n";
    pub << "Modulus (n): " << n << endl;
    pub.close();

    ofstream priv("private_key.txt");
    priv << "Private key -> (d, n)\n";
    priv << "Private key (d): " << d << "\n";
    priv << "Modulus (n): " << n << endl;
    priv.close();
}

// RSA encryption
int encrypt(int msg, int e, int n) {
    long long result = 1;
    for (int i = 0; i < e; ++i)
        result = (result * msg) % n;
    return static_cast<int>(result);
}

// RSA decryption
int decrypt(int cipher, int d, int n) {
    long long result = 1;
    for (int i = 0; i < d; ++i)
        result = (result * cipher) % n;
    return static_cast<int>(result);
}

string generateOTP() {
    int otp = rand() % 1000000; // 6-digit
    stringstream ss;
    ss << setw(6) << setfill('0') << otp;
    return ss.str();
}

void sendSMSWithTwilio(const string& otp, const string& phone) {
    string accountSID = "YOUR_TWILIO_ACCOUNT_SID";
    string authToken = "YOUR_TWILIO_AUTH_TOKEN";
    string fromNumber = "YOUR_TWILIO_PHONE_NUMBER";
    string msg = "Your OTP is: " + otp;

    string command = "curl -X POST https://api.twilio.com/2010-04-01/Accounts/" + accountSID + "/Messages.json "
                     "--data-urlencode \"To=" + phone + "\" "
                     "--data-urlencode \"From=" + fromNumber + "\" "
                     "--data-urlencode \"Body=" + msg + "\" "
                     "-u " + accountSID + ":" + authToken;

    system(command.c_str());
}

int main() {
    srand(time(0));
    string username = "admin", password = "pass123";
    string u, p;
    cout << "Username: "; cin >> u;
    cout << "Password: "; cin >> p;
    if (u != username || p != password) {
        cout << "Access Denied.\n";
        return 0;
    }

    // RSA Key Generation
    int p1 = generatePrime(), p2 = generatePrime();
    int n = p1 * p2;
    int phi = (p1 - 1) * (p2 - 1);
    int e = 3;
    while (gcd(e, phi) != 1) ++e;
    int d = modInverse(e, phi);

    saveKeys(e, d, n);

    string otp = generateOTP();
    time_t generatedTime = time(0);

    // Hash and Sign
    string hashedOTP = sha256(otp);
    int otpHashInt = hashToInt(hashedOTP);
    int signature = encrypt(otpHashInt, d, n);

    // Send via Twilio SMS
    string phone;
    cout << "Enter phone number (+CountryCode...): ";
    cin >> phone;
    sendSMSWithTwilio(otp, phone);

    cout << "\nOTP has been sent.\n";
    cout << "Digital Signature (RSA Encrypted Hash): " << signature << endl;

    // OTP Verification
    string enteredOTP;
    cout << "\nEnter received OTP: ";
    cin >> enteredOTP;

    time_t now = time(0);
    if (difftime(now, generatedTime) > 180) {
        cout << "OTP expired.\n";
        return 0;
    }

    string enteredHash = sha256(enteredOTP);
    int enteredHashInt = hashToInt(enteredHash);
    int decryptedSignature = decrypt(signature, e, n);

    if (enteredHashInt == decryptedSignature) {
        cout << "\nOTP Verified Successfully. Access Granted.\n";
    } else {
        cout << "\nInvalid OTP.\n";
    }

    return 0;
}
