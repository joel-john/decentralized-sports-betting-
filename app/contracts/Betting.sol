pragma solidity >=0.4.24;

import "@chainlink/contracts/src/v0.4/ChainlinkClient.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Betting is ChainlinkClient {
    // Prevent from arithmetic overflows, especially when dealing with Ether payments
    // Not necessary anymore as ChainlinkClient provides SafeMath already
    // using SafeMath for uint256;

    // Events
    event NewBet(
        address indexed _from,
        uint256 _betId
    );

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
        uint256 matchId; //The Id of each match, gets the ID from API, used for getting match status
        uint256 betId; //Unique ID for each bet, used for referencing the bet
        uint256 matchStatus; //TODO Current status of the match, refer matchStatus codes
        uint256 winningTeam;
        //mapping(uint => Game) game;               //TODO (if needed)
        uint256 betStatus; //Current status of each Bet, refer betStatus Codes
        uint256 amount; //amount currently held in Bet
        mapping(address => Player) player; //Maps the address to each Player
        address playerA; //Stores the address of PlayerA (used for distributing winnings)
        address playerB; //Stores the address of PlayerB (used for distributing winnings)
        bool active; // Required to distinguish between bets that is initialized with zeroes and null pointer
    }

    struct Request {
        uint256 betId;
        uint256 response;
        bool active;
    }

    //TODO Structure for match (if needed)
    /*
    struct Game{
        uint gameId;
        uint gameStatus;
        uint gameResult; //HOME or AWAY or TIE
    }*/

    mapping(uint256 => Bet) public bet; //Maps the betId to each Bet
    // Maps from a request id provided by chainlink to a Request (including a bet id) in order to identify bets from the match outcome
    mapping(bytes32 => Request) public oracleRequests;

    // Store bet ids inside this array for iteration purposes
    uint256[] public iterableBets;
    uint256 public betCount; //TODO (if needed) auto calculate betID

    /**
     * @notice Deploy the contract with a specified address for the LINK
     * and Oracle contract addresses
     * @dev Sets the storage for the specified addresses
     * @param _link The address of the LINK token contract.
     *              Use 0x0 address to automatically assign one
     */
    constructor(address _link) public {
        if (_link == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_link);
        }
    }

    /**
     * @notice Adds a new bet
     * @dev Automatically assigns a new bet id and constructs a new Bet struct
     * @param _teamSelected The predicted winning team of the sender
     * @param _matchId The (real world) match id of the game this bet refers to.
     * @return The new bet id, if successful
     */
    function addBet(
        uint256 _teamSelected,
        uint256 _matchId
    ) public payable returns (uint256 newBetId) {
        //require(msg.value >= minimumBet);

        newBetId = betCount; // Automatically generate unique bet id
        Bet storage newBet = bet[newBetId];
        require(!newBet.active, "BetId Already Exists"); //the betID should be unique
        //getMatchStatus(newBetId, _matchId)                                                          //TODO getting the current match status
        //require(newBet.matchStatus == MATCH_PLANNED, "Match Status should be MATCH_PLANNED);      //TODO verifies match status
        newBet.betId = newBetId;
        newBet.matchId = _matchId;
        newBet.playerA = msg.sender;
        newBet.betStatus = 0;
        newBet.amount = msg.value;
        newBet.player[msg.sender].teamSelected = _teamSelected;
        newBet.betStatus = BET_ADDED; //changes the status of bet from 0 to BET_ADDED
        newBet.active = true;

        betCount = betCount.add(1);
        iterableBets.push(newBetId);

        // Emit event for better testability
        emit NewBet(msg.sender, newBetId);
    }

    //function for confirming a bet
    function confirmBet(uint256 _betId, uint256 _teamSelected) public payable {
        Bet storage b = bet[_betId];
        //getMatchStatus(_betId, _matchId)                            //TODO getting the current match status
        //require(b.matchStatus == MATCH_PLANNED);                    //TODO verifies match status

        require(b.active, "Bet must exist"); //checks whether the bet already exists
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
    function fulfill(uint256 _betId) public payable {
        Bet storage b = bet[_betId];
        //verifies that match is over
        require(
            b.matchStatus == MATCH_ENDED || b.matchStatus == MATCH_CANCELLED,
            "Match Status should be MATCH_ENDED or MATCH_CANCELLED"
        );
        require(b.betStatus != BET_OVER, "Bet Status should not be BET_OVER");

        if (b.matchStatus == MATCH_ENDED) {
            if (b.winningTeam == b.player[b.playerA].teamSelected) {
                b.playerA.transfer(b.amount);
                b.betStatus = BET_OVER;
            } else if (b.winningTeam == b.player[b.playerB].teamSelected) {
                b.playerB.transfer(b.amount);
                b.betStatus = BET_OVER;
            } else if (b.winningTeam == TIE) {
                b.playerA.transfer(b.amount.div(2));
                b.playerB.transfer(b.amount.div(2));
                b.betStatus = BET_OVER;
            }
        } else if (b.matchStatus == MATCH_CANCELLED) {
            b.playerA.transfer(b.amount.div(2));
            b.playerB.transfer(b.amount.div(2));
            b.betStatus = BET_OVER;
        }
        //TODO delete bet[_betId];
    }

    //TODO implement : getMatchStatus(_betId)

    //Use testEnd / testCancel for simulating match condition (till getMatchStatus is implemented)

    //TODO (REMOVE) function for simulating MATCH_ENDED with HOME team winning
    function testEnd(uint256 _betId) public {
        Bet storage b = bet[_betId];
        b.matchStatus = MATCH_ENDED;
        b.winningTeam = HOME;
    }

    //TODO (REMOVE) function for simulating MATCH_CANCELLED
    function testCancel(uint256 _betId) public {
        Bet storage b = bet[_betId];
        b.matchStatus = MATCH_CANCELLED;
    }

    /**
     * @notice Returns the address of the LINK token
     * @dev This is the public implementation for chainlinkTokenAddress, which is
     * an internal method of the ChainlinkClient contract
     */
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function requestBetResult(
        uint256 _betId,
        address _oracle,
        uint256 _payment
    ) public {
        Bet storage b = bet[_betId];
        require(b.active, "Bet must exist");

        // Hardcoded stuff for now
        bytes32 jobId = "4c7b7ffb66b344fbaa64995af81e355a";
        string memory url = "http://localhost:7070/api";
        string memory path = uint2str(b.matchId);
        int256 times = 1;

        bytes32 requestId = createRequestTo(
            _oracle,
            jobId,
            _payment,
            url,
            path,
            times
        );

        Request storage req = oracleRequests[requestId];
        req.betId = _betId;
        req.active = true;
    }

    /**
     * @notice Creates a request to the specified Oracle contract address
     * @dev This function ignores the stored Oracle contract address and
     * will instead send the request to the address specified
     * @param _oracle The Oracle contract address to send the request to
     * @param _jobId The bytes32 JobID to be executed
     * @param _url The URL to fetch data from
     * @param _path The dot-delimited path to parse of the response
     * @param _times The number to multiply the result by
     */
    function createRequestTo(
        address _oracle,
        bytes32 _jobId,
        uint256 _payment,
        string memory _url,
        string memory _path,
        int256 _times
    ) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.chainlinkCallback.selector
        );
        req.add("url", _url);
        req.add("path", _path);
        req.addInt("times", _times);
        requestId = sendChainlinkRequestTo(_oracle, req, _payment);
    }

    /**
     * @notice The chainlinkCallback method from requests created by this contract
     * @dev The recordChainlinkFulfillment protects this function from being called
     * by anyone other than the oracle address that the request was sent to
     * @param _requestId The ID that was generated for the request
     * @param _data The answer provided by the oracle
     */
    function chainlinkCallback(bytes32 _requestId, uint256 _data)
        public
        recordChainlinkFulfillment(_requestId)
    {
        Request storage req = oracleRequests[_requestId];
        Bet storage b = bet[req.betId];

        req.response = _data; // Redundant, but good for testing
        b.winningTeam = _data;
    }

    /**
     * @notice Allows the owner to withdraw any LINK balance on the contract
     */
    function withdrawLink() public {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    /**
     * @notice Call this method if no response is received within 5 minutes
     * @param _requestId The ID that was generated for the request to cancel
     * @param _payment The payment specified for the request to cancel
     * @param _callbackFunctionId The bytes4 callback function ID specified for
     * the request to cancel
     * @param _expiration The expiration generated for the request to cancel
     */
    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    function uint2str(uint256 _i) internal pure returns (string) {
        uint256 i = _i;
        if (i == 0) return "0";
        uint256 j = i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length - 1;
        while (i != 0) {
            bstr[k--] = bytes1(48 + (i % 10));
            i /= 10;
        }
        return string(bstr);
    }
}
