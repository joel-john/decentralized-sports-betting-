# Decentralized Sports Betting

This is the Blockchain Lab project for Group PONZI.

## Motivation

Online betting platforms are centralized.
Users need to trust a certain third party to correctly proceed with their assets according to a betting protocol.
Additionally, these protocols may be designed with the intention to make players lose in the long term.
A decentralized betting platform could solve this issue.
As the third party gets eliminated, smart contracts openly enforce correct execution of the betting protocol.

## Challenges

- Create a (fair) betting protocol as a smart contract
- How can smart contract receive external data (i.e., real-life game results) in a decentral manner?

## Approaches

### Betting protocol

We define a Bet as follows: a Bet is an agreement between exactly two players, `playerA` and `playerB`.
1. `playerA` creates a new Bet by predicting a game result and providing some Ether as the stake
2. `playerB` joins the Bet created by `playerA`. It is implied that `playerB` predicts the opposite game result and provides the same Ether amount as `playerA` as the stake.
3. Both players can invoke an Oracle to retrieve the current state of a match.
4. If the Oracle provides a game result as predicted by a player, they won the Bet, and that player receives all Ether of that Bet. The Bet is then finalized and closed.

### Oracle

A 'centralized' Oracle is single point of failure, which makes our smart contract as reliable as that one Oracle.
We utilize Chainlink as the middleware to connect blockchain and external data.
It allows us to connect to a decentralized oracle network.

## Demo

The demo shows a scenario with a Decentral Sports Betting platform, three Oracles, and three Chainlink nodes, each connected to a game results API that mocks a data source provider. In this case, one data source is failing and we show that in an Oracle network we still receive the correct data.

### Installation

Requirements:
- Docker
- NodeJS v12.x.x
- Browser with Metamask enabled and set to `http://localhost:8545`
  - Use the mnemonic seed `find flat salute zebra mosquito laptop sample kangaroo pitch grass trim silver` to get started with pre-funded accounts.

First, run Docker-Compose:
```
docker-compose up -d
```

Then, install npm packages, migrate the contracts, run necessary scripts, and start the UI:
```
cd app
npm ci
npm run migrate:demo
npm fund-link
npm setup-demo
cd ui
npm ci
npm run serve
```

The UI should be accessible from `localhost:8080`.
