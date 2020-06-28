#Instructions for chainlink node setup

1. Download and install Ganache
2. Start a new Ganache workspace with the following settings:
    - Add the truffle-config.js of this project in order to connect Ganache and Truffle
    - Hostname: 0.0.0.0 (all interfaces)
3. Start the start-cl.sh shell script to start the chainlink node via a docker image
4. Open the GUI of the chainlink node on localhost:6688

(optional) 5. Change the database in the chainlink-dev.env file to a more stable local instance (limit of parallel users)


