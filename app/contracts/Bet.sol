pragma solidity >=0.4.24 <0.6.0;

import "@chainlink/contracts/src/v0.4/ChainlinkClient.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Bet is a contract that models a bet between two players
 * @dev This contract is mostly adopted from the example here https://github.com/smartcontractkit/box
 */
contract Bet is ChainlinkClient, Ownable {
    // playerA is the 'hosting' player that predicts a game outcome and defines the bet price.
    // playerB is the 'joining' player that predicts the opposite.
    address public playerA;
    address public playerB;

    // The game id this bet is referring to
    uint256 public gameId;

    // Outcome of the game predicted by playerA. It follows that playerB predicts the complementary.
    uint256 public playerAPrediction;

    // The game outcome of gameId. Is set by an oracle contract
    uint256 public observedGameOutcome;

    bool public isActive;

    /**
     * @notice Deploy the contract with a specified address for the LINK
     * and Oracle contract addresses
     * @dev Sets the storage for the specified addresses
     * @param _link The address of the LINK token contract
     * @param _playerA The address of playerA
     * @param _playerB The address of playerB
     */
    constructor(
        address _link,
        address _playerA,
        address _playerB
    ) public {
        if (_link == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_link);
        }

        playerA = _playerA;
        playerB = _playerB;
    }

    /**
     * @notice Returns the address of the LINK token
     * @dev This is the public implementation for chainlinkTokenAddress, which is
     * an internal method of the ChainlinkClient contract
     */
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
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
    ) public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
        req.add("url", _url);
        req.add("path", _path);
        req.addInt("times", _times);
        requestId = sendChainlinkRequestTo(_oracle, req, _payment);
    }

    /**
     * @notice The fulfill method from requests created by this contract
     * @dev The recordChainlinkFulfillment protects this function from being called
     * by anyone other than the oracle address that the request was sent to
     * @param _requestId The ID that was generated for the request
     * @param _data The answer provided by the oracle
     */
    function fulfill(bytes32 _requestId, uint256 _data)
        public
        recordChainlinkFulfillment(_requestId)
    {
        observedGameOutcome = _data;
    }

    /**
     * @notice Allows the owner to withdraw any LINK balance on the contract
     */
    function withdrawLink() public onlyOwner {
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
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }
}
