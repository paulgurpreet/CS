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
