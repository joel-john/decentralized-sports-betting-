#! /bin/bash

sudo docker run -p 6688:6688 -it --env-file=./chainlink-dev.env smartcontract/chainlink local n

