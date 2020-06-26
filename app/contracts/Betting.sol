pragma solidity >=0.4.24;

contract Betting {
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
    }

    //TODO Structure for match
    /*
    struct Game{
        uint gameId;
        uint gameStatus;
        uint gameResult; //HOME or AWAY or TIE
        
    }*/

    // constructor() public {
    //   minimumBet = 100000000000000;
    // }

    mapping(uint256 => Bet) bet;

    uint256 public betCount; //TODO auto calculate betID

    function addBet(uint256 _betId, uint256 _teamSelected) public payable {
        //require(msg.value >= minimumBet);

        //require(matchStatus == MATCH_PLANNED);

        bet[_betId].betId = _betId;
        //bet[_betId].gameId = _gameId; //TODO Implement gameID
        bet[_betId].playerA = msg.sender;
        bet[_betId].betStatus = 0;
        bet[_betId].amount = msg.value;
        bet[_betId].player[msg.sender].teamSelected = _teamSelected;
        bet[_betId].betStatus = BET_ADDED;
    }

    function confirmBet(uint256 _betId, uint256 _teamSelected) public payable {
        require(bet[_betId].betId == _betId); //checks whether the bet already exists
        require(msg.value == bet[_betId].amount); //requires that the bet amount of playerB == bet amount of playerB
        require(bet[_betId].betStatus == BET_ADDED); //verifies the bet status
        //require(bet[_betId].playerA != msg.sender);               //verifies playerA and playerB are different
        require(
            (bet[_betId].player[bet[_betId].playerA].teamSelected) !=
                _teamSelected
        ); //teamSelected should be different for playerA and playerB

        bet[_betId].amount = bet[_betId].amount + msg.value; //amount of bet is doubled
        bet[_betId].player[msg.sender].teamSelected = _teamSelected;
        bet[_betId].playerB = msg.sender;
        bet[_betId].betStatus = BET_CONFIRMED;
    }
}
