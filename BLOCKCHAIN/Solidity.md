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
