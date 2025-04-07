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
