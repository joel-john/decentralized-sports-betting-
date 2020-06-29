pragma solidity >=0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Betting {

    // Prevent from arithmetic overflows, especially when dealing with Ether payments
    using SafeMath for uint;

    //codes for TeamSelected
    uint256 constant HOME = 1;
    uint256 constant AWAY = 2;
    uint256 constant TIE = 3;

    //matchStatus codes //TODO Implementation
    uint256 constant MATCH_PLANNED = 0;
    uint256 constant MATCH_STARTED = 1;
    uint256 constant MATCH_ENDED = 2;
    uint256 constant MATCH_CANCELLED = 3;

    //betStatus Codes
    uint256 constant BET_ADDED = 1;
    uint256 constant BET_CONFIRMED = 2;
    uint256 constant BET_OVER = 3;

    //Holds the teamSelected value of each Player
    struct Player {
        uint256 teamSelected; //Home = 1 or Away = 2
        //uint amount;
    }

    //Structure for Bet
    struct Bet {
        // uint teamSelected; //Home = 1 or Away = 2
        uint256 matchId;                            //The Id of each match, gets the ID from API, used for getting match status
        uint256 betId;                              //Unique ID for each bet, used for referencing the bet
        uint256 matchStatus;                        //TODO Current status of the match, refer matchStatus codes
        uint256 winningTeam;
        //mapping(uint => Game) game;               //TODO (if needed)
        uint256 betStatus;                          //Current status of each Bet, refer betStatus Codes
        uint256 amount;                             //amount currently held in Bet
        mapping(address => Player) player;          //Maps the address to each Player
        address playerA;                    //Stores the address of PlayerA (used for distributing winnings)
        address playerB;                    //Stores the address of PlayerB (used for distributing winnings)
        bool active;                                // Required to distinguish between bets that is initialized with zeroes and null pointer
    }

    //TODO Structure for match (if needed)
    /*
    struct Game{
        uint gameId;
        uint gameStatus;
        uint gameResult; //HOME or AWAY or TIE
    }*/

    mapping (uint256 => Bet) public bet;             //Maps the betId to each Bet
    // Maps from a request id provided by chainlink to a bet id in order to identify bets from the match outcome
    mapping (bytes32 => uint256) public oracleRequests;

    // Store bet ids inside this array for iteration purposes
    uint256[] public iterableBets;
    uint256 public betCount; //TODO (if needed) auto calculate betID

    //function for adding new bet
    function addBet(uint256 _betId, uint256 _teamSelected, uint256 _matchId) public payable {
        //require(msg.value >= minimumBet);

        Bet storage newBet = bet[_betId];
        require(!newBet.active, "BetId Already Exists");    //the betID should be unique
        //getMatchStatus(_betId, _matchId)                                                          //TODO getting the current match status
        //require(newBet.matchStatus == MATCH_PLANNED, "Match Status should be MATCH_PLANNED);      //TODO verifies match status
        newBet.betId = _betId;
        newBet.matchId = _matchId;
        newBet.playerA = msg.sender;
        newBet.betStatus = 0;
        newBet.amount = msg.value;
        newBet.player[msg.sender].teamSelected = _teamSelected;
        newBet.betStatus = BET_ADDED;                                //changes the status of bet from 0 to BET_ADDED
        newBet.active = true;

        betCount = betCount.add(1);
        iterableBets.push(_betId);
    }

    //function for confirming a bet
    function confirmBet(uint256 _betId, uint256 _teamSelected) public payable {
        Bet storage b = bet[_betId];
        //getMatchStatus(_betId, _matchId)                            //TODO getting the current match status
        //require(b.matchStatus == MATCH_PLANNED);                    //TODO verifies match status

        require(b.active, "Bet must exist");                        //checks whether the bet already exists
        require(
            msg.value == b.amount,
            "Bet amount must match with other player's bet"
        ); //requires that the bet amount of playerB == bet amount of playerA
        require(b.betStatus == BET_ADDED, "Bet must be in state BET_ADDED"); //verifies the bet status
        //require(b.playerA != msg.sender);               //verifies playerA and playerB are different
        require(
            (b.player[b.playerA].teamSelected) != _teamSelected,
            "Selected team already taken by player A"
        ); //teamSelected should be different for playerA and playerB

        b.amount = b.amount.add(msg.value); //amount of bet is doubled
        b.player[msg.sender].teamSelected = _teamSelected;
        b.playerB = msg.sender;
        b.betStatus = BET_CONFIRMED;
    }
    
    //function for fulfilling a bet(distribute winnings)
    //the bet amount is distributed evenly to the players in cases where The match is a tie OR the match is cancelled
    function fulfill(uint256 _betId) public payable{
        Bet storage b = bet[_betId];
        //verifies that match is over
        require (b.matchStatus == MATCH_ENDED||b.matchStatus == MATCH_CANCELLED, "Match Status should be MATCH_ENDED or MATCH_CANCELLED");
        require (b.betStatus != BET_OVER, "Bet Status should not be BET_OVER");
        
        if(b.matchStatus == MATCH_ENDED){
            if(b.winningTeam == b.player[b.playerA].teamSelected){
                b.playerA.transfer(b.amount);
                b.betStatus = BET_OVER;
            }else if(b.winningTeam == b.player[b.playerB].teamSelected){
                b.playerB.transfer(b.amount);
                b.betStatus = BET_OVER;
            }
            else if(b.winningTeam == TIE){
                b.playerA.transfer(b.amount.div(2));
                b.playerB.transfer(b.amount.div(2));
                b.betStatus = BET_OVER;
            }
        }else if(b.matchStatus == MATCH_CANCELLED){
            b.playerA.transfer(b.amount.div(2));
            b.playerB.transfer(b.amount.div(2));
            b.betStatus = BET_OVER;
        }
        //TODO delete bet[_betId];
    }
    
    
    //TODO implement : getMatchStatus(_betId)
    
    
    //Use testEnd / testCancel for simulating match condition (till getMatchStatus is implemented)

    //TODO (REMOVE) function for simulating MATCH_ENDED with HOME team winning
    function testEnd(uint256 _betId) public{
        Bet storage b = bet[_betId];
        b.matchStatus = MATCH_ENDED;
        b.winningTeam = HOME;
    }
    
    //TODO (REMOVE) function for simulating MATCH_CANCELLED
    function testCancel(uint256 _betId) public{
        Bet storage b = bet[_betId];
        b.matchStatus = MATCH_CANCELLED;
    }
}
