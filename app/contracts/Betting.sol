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

    struct Player {
        uint256 teamSelected; //Home = 1 or Away = 2
        //uint amount;
    }

    //TODO Structure for Bet
    struct Bet {
        // uint teamSelected; //Home = 1 or Away = 2
        uint256 gameId; //TODO
        uint256 betId;
        uint256 matchStatus; //TODO
        //mapping(uint => Game) game; //TODO

        uint256 betStatus;
        uint256 amount;
        mapping(address => Player) player;
        address playerA;
        address playerB;
        // Required to distinguish between bets that is initialized with zeroes and null pointer
        bool active;
    }

    //TODO Structure for match
    /*
    struct Game{
        uint gameId;
        uint gameStatus;
        uint gameResult; //HOME or AWAY or TIE
    }*/

    mapping(uint256 => Bet) public bet;

    uint256 public betCount; //TODO auto calculate betID

    function addBet(uint256 _betId, uint256 _teamSelected) public payable {
        //require(msg.value >= minimumBet);

        //require(matchStatus == MATCH_PLANNED);

        Bet storage newBet = bet[_betId];

        newBet.betId = _betId;
        //newBet.gameId = _gameId; //TODO Implement gameID
        newBet.playerA = msg.sender;
        newBet.betStatus = 0;
        newBet.amount = msg.value;
        newBet.player[msg.sender].teamSelected = _teamSelected;
        newBet.betStatus = BET_ADDED;
        newBet.active = true;
    }

    function confirmBet(uint256 _betId, uint256 _teamSelected) public payable {
        Bet storage b = bet[_betId];

        require(b.active, "Bet must exist"); //checks whether the bet already exists
        require(
            msg.value == b.amount,
            "Bet amount must match with other player's bet"
        ); //requires that the bet amount of playerB == bet amount of playerB
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
}
