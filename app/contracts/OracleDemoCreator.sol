pragma solidity >=0.5.0 <0.6.0;

import "@chainlink/contracts/src/v0.5/Oracle.sol";

/**
 * @notice Creates 3 Oracle instances for us and stores their addresses publicly for use.
 */
contract OracleDemoCreator {
    address[3] public oracles;

    /**
     * @notice Deploy the contract with a specified address for the LINK
     * and Oracle contract addresses
     * @dev Sets the storage for the specified addresses
     * @param _link The address of the LINK token contract.
     *              Use 0x0 address to automatically assign one
     */
    constructor(address _link) public {
        for (uint256 i = 0; i < 3; i += 1) {
            Oracle o = new Oracle(_link);
            o.transferOwnership(msg.sender);
            oracles[i] = address(o);
        }
    }

    function getOracles() public view returns (address[3] memory) {
        return oracles;
    }
}
