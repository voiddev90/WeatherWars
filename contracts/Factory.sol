pragma solidity ^0.5.0;
import "./oraclizeAPI_0.5.sol";

//Factory contract 1
//Contracts get associated with owner address & owners can only have 1 contract
contract Betlist
{
    mapping(address => address) bets;

    function createBet(uint startTime, uint initial, string memory location) public payable
    {
        if (bets[msg.sender] == 0)
        {
            address newBet = new BettingContract(startTime, initial, location, msg.value, msg.sender);
            bets[msg.sender] = newBet;
            newBet.transfer(msg.value);
        }
    }

    function GetContract() public view returns (address[])
    {
        return bets;
    }

    function GetOwnContract() public view returns (address)
    {
        if (bets[msg.sender != 0])
        {
            return bets[msg.sender];
        }
    }
}

//Factory contract 2
//Simpel factory contract
contract Betlist2
{
    address[] bets;

    function createBet(uint startTime, uint initial, string memory location) public payable
    {
        address newBet = new BettingContract(startTime, initial, location, msg.value, msg.sender);
        bets.push(newBet);
        newBet.transfer(msg.value);
    }

    function GetContracts() public view returns (address[])
    {
        return bets;
    }
}

//Contract for bets
contract BettingContract is usingOraclize
{
    address payable owner;
    uint playerCount = 0;
    uint betAmount;
    uint initialBet;

    uint public temperature;
    event NewOraclizeQuery(string description);
    event NewTemperature(string temperature);

    struct Player {
        address payable addr; //The address of their account
        bool higher; //Whether their guess was higher than the owner's guess. True = higher, False = lower.
    }

    Player[] players;
    Player[] winners;

    //When called for, Oraclize needs to be called and the Total needs to be updated.
    function BetttingContract(uint startTime, uint initial, string memory location, uint betAmount_, address owner_) public payable
    {
        owner = owner_;
        betAmount = betAmount_;
        initialBet = initial;

        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        getWeather(startTime, location);

    }

    function AddPlayer(bool guessedHigher) public payable
    {
        if (msg.value != betAmount){
            msg.sender.transfer(msg.value);
        }
        else{

            //Since the owner is also counted, this playerCount starts at 1!
            playerCount = playerCount + 1;

            //Add player to a struct, and add it to the array.
            Player memory player;
            player.addr = msg.sender;
            player.higher = guessedHigher;
            players.push(player);

            //Update the Total for each player added.
            updateTotalReceived(msg.value);
        }
    }

    function updateTotalReceived(uint amount) internal {
        betAmount += amount;
    }


    //Function that contains the actions of Oraclize.
    function getWeather(uint _time, string memory searchstring) public
    {
        emit NewOraclizeQuery("Query was sent waiting for response....");
        oraclize_query(_time, "WolframAlpha",  searchstring);
    }


    //This function will do everything needed to give the winnings to the winner of the bet.
    function _callback(string memory _result) public
    {
        //totalReceived should get sent to the winner(s).
        //Thus, the winner(s) need(s) to be chosen.

        //This results in a loop if the owner did not win.

        if(msg.sender != oraclize_cbAddress()) revert();
        emit NewTemperature(_result);
        temperature = parseInt(_result);

        if (initialBet == temperature){
            //Send everything in the contract back to the owner, since he won!
            owner.transfer(address(this).balance);
        }
        else{
            //
            if (initialBet > temperature) {
                for (uint i = 0; i < players.length; i++) {
                    if (players[i].higher == true){
                        winners.push(players[i]);
                    }
                }
            }
            else{
                for (uint i = 0; i < players.length; i++) {
                    if (players[i].higher == false){
                        winners.push(players[i]);
                    }
                }
            }

            for (uint i = 0; i < winners.length; i++){
                winners[i].addr.transfer(betAmount / winners.length);
            }
        }
    }
}