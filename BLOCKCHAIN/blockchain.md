```
sudo apt update
```
to update the system

```
sudo apt install golang-go
```
to install golang-go

```
sudo snap install docker
```
to install docker

```
sudo apt install git
```
to install git

```
git clone -b main https://github.com/hyperledger/fabric-samples.git
```
to install fabric-samples

```
sudo apt install curl
```
to install curl


```
cd fabric-samples
```
to get in fabric-samples

```
sudo bash
```


```
curl -sSL https://bit.ly/2ysbOFE | bash -s
```
to pull hyperledger docker images


```
cd test-network
```
to get into test-network

```
./network.sh
```
```
./network.sh up
```
to up the network

```
./network.sh createChannel
```
to create channel

```
./network.sh down
```
to down the network

```
wget https://dist.ipfs.tech/kubo/v0.32.1/kubo_v0.32.1_linux-amd64.tar.gz
```
to install IPFS

```
tar -xvzf kubo_v0.32.1_linux-amd64.tar.gz
```
to use kubo

```
cd kubo
```
to get into kubo directory

```
sudo bash install.sh
```
to move to local bin

```
ipfs init
```
to initialise ipfs

```
ipfs daemon
```
to use daemon

![one](https://github.com/user-attachments/assets/28cf8c2c-f1d6-44f3-ade3-37cb24e5b492)


```
ipfs.log 2>&1 &
```
To run ipfs daemon in background

```
echo "Hello, IPFS!" > hello.txt
ipfs add hello.txt
ipfs cat <CID>
```
to add file

![two](https://github.com/user-attachments/assets/a3498732-e133-41c6-a4f2-7b1e21234150)

```
mkdir myfolder
echo "File 1 content" > myfolder/file1.txt
echo "File 2 content" > myfolder/file2.txt
ipfs add -r myfolder
```
to add a directory

![three](https://github.com/user-attachments/assets/4e0d51e5-ae0e-4034-b79d-fe3ac89a0666)


```
ps aux | grep ipfs
```
lists running processes

```
kill <PID>
```
to kill the process

## encrypting and decrypting
```
echo "Hello, bruh" > myfile.txt
ipfs add myfile.txt
openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -salt -in myfile.txt -out myfile_encrypted.txt -pass pass:yourpassword
ipfs add myfile_encrypted.txt
cat myfile_encrypted.txt
openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -in myfile_encrypted.txt -out decrypted_file.txt -pass pass:yourpassword
cat decrypted_file.txt
ipfs add decrypted_file.txt
```

![enc-dec](https://github.com/user-attachments/assets/293f1b3a-4ba4-4b35-8f04-d93fb9c9a6f7)


## to push video and audio

```
ipfs add <audio-path>
```
to add audio

![audio](https://github.com/user-attachments/assets/63297200-f2dd-48e0-ae29-a319240ec2d5)


```
ipfs add <video-path>
```
to add video

![video](https://github.com/user-attachments/assets/131c2e88-a2fa-47a1-93f3-22d615d2e1bd)

## Creating Meta Mask Account

## The metamask account is our wallet where it stores the token , like sepolia faucet which are the test token , with the help of metamask wallet we will do the transaction and deploy our smart contract on the blockchain.

![Screenshot 2025-04-07 170942](https://github.com/user-attachments/assets/8d7fa6ad-1365-4e3a-bf1c-e809f1198531)

## Sepolia Faucet

### These are the test token because as we can't afford  etherum coins ,and also for the learning purpose we use them , these faucet can be get from the Google Cloud.

![Screenshot from 2025-04-07 14-08-21](https://github.com/user-attachments/assets/197de3d9-335a-41e5-a63e-6a7bf40e5640)

![Screenshot From 2025-04-07 14-32-10](https://github.com/user-attachments/assets/1ead8d7b-e715-4a4b-91c8-81e01dad14d4)

### Here in the above Image you can see the Wallet Address where we have to enter our metamask wallet address then click on the recive button.

# Solidity
## 1
```
contract Hello {
    string public welecome = "Hello World";
}

contract Calculator{
    uint256 result = 0 ; 
    function add(uint128 num1) external {
        result += num1;
    }

    function subtract(uint128 num2) public{
        result -= num2;
    }

    function multiply(uint128 num3) public{
        result *= num3;
    }

    function get() public view returns (uint256){
        return result; 
    }
```

## 2
```
contract Twitter{
    // add
    mapping(address => string) public tweets;
    // Mapping () is like the dictinory in the python  address ---> name or message 
    // addres which is form our wallet map to a sting which name is tweets and it is public 
    //
    function createTweet(string memory _tweet) public {
        tweets[msg.sender] = _tweet; //Here the msg.sender stores the USER Metamask account 
        // Here our wallet address is the key and the message we tweet is the value
    }

    function getTweet(address _owner) public view returns(string memory){
        return tweets[_owner];
    }
```
## 3
```
contract Twitter{
    // add
    mapping(address => string[]) public tweets;

    function createTweet(string memory _tweet) public {
        tweets[msg.sender].push(_tweet);
    }

    function getTweet(address _owner , uint _i) public view returns(string memory){
        return tweets[_owner][_i];
    }

    function getAllTweets(address  _owner) public view returns (string[] memory){
        return tweets[_owner];
    }
```
## 4
```
contract Twitter{
    // define struct
    struct Tweet {
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }


    mapping(address => Tweet[]) public tweets;

    function createTweet(string memory _tweet) public {
        Tweet memory newTweet = Tweet({
            author:msg.sender,
            content:_tweet,
            timestamp:block.timestamp,
            likes: 0
        });
        tweets[msg.sender].push(newTweet);
    }

    function getTweet(address _owner , uint _i) public view returns(Tweet memory){
        return tweets[_owner][_i];
    }

    function getAllTweets(address  _owner) public view returns (Tweet[] memory){
        return tweets[_owner];
    }
```
## 5
```
contract Token {
    address public owner;
    bool  public paused;
    mapping(address => uint) public balance;

    constructor(){
        owner = msg.sender;
        paused = false;
        balance[owner] = 100000;
     }

     modifier onlyOwner(){
        require(msg.sender == owner,"You are not the owner");
        _;
     }

     modifier notPaused() {
        require(paused == false, "Already paused.");
        _;
     }
    
    function pause() public onlyOwner{
        paused= true;
    }

    function unpause() public onlyOwner{
        paused = false;
    }

    function transfer(address to, uint amount) public notPaused{
        require(balance[msg.sender] >= amount,"Insufficient Balance");
        balance[msg.sender] -= amount;
        balance[to] += amount;
    }
```


## Deploying contracts using remix ide
### 2
Write a contract that manages a list of student records (name, roll number). Allow adding and retrieving student data.
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentRecords {
    struct Student {
        string name;
        uint rollNo;
    }

    Student[] public students;

    function addStudent(string memory _name, uint _rollNo) public {
        students.push(Student(_name, _rollNo));
    }

    function getStudent(uint index) public view returns (string memory, uint) {
        require(index < students.length, "Invalid index");
        Student memory s = students[index];
        return (s.name, s.rollNo);
    }
}
```
![sec2](https://github.com/user-attachments/assets/94bbe6fe-c11d-42fa-b0f2-f4f543d3f8c3)
![sec2-1](https://github.com/user-attachments/assets/98619b98-8a15-4156-95e8-93c6534ad6f4)























