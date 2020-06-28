const { oracle } = require('@chainlink/test-helpers')
const { expectRevert, time } = require('openzeppelin-test-helpers')
const { assert } = require('chai')
const { web3 } = require('openzeppelin-test-helpers/src/setup')

contract('Betting', accounts => {
  const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
  const { Oracle } = require('@chainlink/contracts/truffle/v0.4/Oracle')
  const Betting = artifacts.require('Betting.sol')

  const defaultAccount = accounts[0]
  const otherAccount = accounts[1]
  const oracleNode = accounts[1]
  const stranger = accounts[2]
  const consumer = accounts[3]

  let link, oc, betting;

  context('Betting features', () => {
    beforeEach(async () => {
      link = await LinkToken.new({ from: defaultAccount })
      oc = await Oracle.new(link.address, { from: defaultAccount })
      betting = await Betting.new(link.address, { from: consumer })
      await oc.setFulfillmentPermission(oracleNode, true, {
        from: defaultAccount,
      })
    })
  
    describe('#addBet', () => {
      it('adds a new bet object that can be read', async () => {
        const betId = 123
        const teamSelected = 1
        const matchId = 4
        const value = web3.utils.toWei('2', 'ether')
  
        await betting.addBet(betId, teamSelected, matchId, {from: defaultAccount, value: value})
        const actualBet = await betting.bet.call(betId)
  
        assert.isTrue(actualBet.active)
        assert.equal(actualBet.betId, betId)
        assert.equal(actualBet.playerA, defaultAccount)
        assert.equal(actualBet.matchId, matchId)
        assert.equal(actualBet.betStatus, 1)
      })
    })
  
    describe('#confirmBet', () => {
      context('with existing bet', () => {
        const betId = 123
        const teamSelected = 1
        const matchId = 3
        const value = web3.utils.toWei('2', 'ether')
  
        beforeEach(async () => {
          await betting.addBet(betId, teamSelected, matchId, {from: defaultAccount, value: value})
          await betting.bet.call(betId)
        })
  
        it('adds second player to an existing bet', async () => {
          await betting.confirmBet(betId, 2, { from: otherAccount, value: value })
  
          const actualBet = await betting.bet.call(betId)
          assert.equal(actualBet.playerB, otherAccount)
          assert.equal(actualBet.betStatus, 2)
          assert.equal(actualBet.amount, web3.utils.toWei('4', 'ether'))
  
        })
        context('when betting value is not equal to playerA', () => {
          const otherValue = web3.utils.toWei('8', 'ether')
          it('should revert', async () => {
            await expectRevert(
              betting.confirmBet(betId, 2, { from: otherAccount, value: otherValue }),
              'Bet amount must match with other player\'s bet'
            )
          })
        })
      })
    })
  
    describe('#retrieveAllBets', () => {
      it('works?', async () => {
        await betting.addBet(123123, 0, 0, {from: defaultAccount, value: web3.utils.toWei('3')})
        console.log(await betting.iterableBets.call(0))
      })
    })
  })

  context('Oracle features', () => {
    // These parameters are used to validate the data was received
    // on the deployed oracle contract. The Job ID only represents
    // the type of data, but will not work on a public testnet.
    // For the latest JobIDs, visit our docs here:
    // https://docs.chain.link/docs/testnet-oracles
    const jobId = web3.utils.toHex('4c7b7ffb66b344fbaa64995af81e355a')
    const url =
      'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY'
    const path = 'USD'
    const times = 100

    // Represents 1 LINK for testnet requests
    const payment = web3.utils.toWei('1')

    describe('#createRequest', () => {
      context('without LINK', () => {
        it('reverts', async () => {
          await expectRevert.unspecified(
            betting.createRequestTo(oc.address, jobId, payment, url, path, times, {
              from: consumer,
            }),
          )
        })
      })
  
      context('with LINK', () => {
        let request
  
        beforeEach(async () => {
          await link.transfer(betting.address, web3.utils.toWei('1', 'ether'), {
            from: defaultAccount,
          })
        })
  
        context('sending a request to a specific oracle contract address', () => {
          it('triggers a log event in the new Oracle contract', async () => {
            const tx = await betting.createRequestTo(
              oc.address,
              jobId,
              payment,
              url,
              path,
              times,
              { from: consumer },
            )
            request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
            assert.equal(oc.address, tx.receipt.rawLogs[3].address)
            assert.equal(
              request.topic,
              web3.utils.keccak256(
                'OracleRequest(bytes32,address,bytes32,uint256,address,bytes4,uint256,uint256,bytes)',
              ),
            )
          })
        })
      })
    })
  
    describe('#chainlinkCallback', () => {
      const expected = 50000
      const response = web3.utils.padLeft(web3.utils.toHex(expected), 64)
      let request
  
      beforeEach(async () => {
        await link.transfer(betting.address, web3.utils.toWei('1', 'ether'), {
          from: defaultAccount,
        })
        const tx = await betting.createRequestTo(
          oc.address,
          jobId,
          payment,
          url,
          path,
          times,
          { from: consumer },
        )
        request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
        
        await oc.fulfillOracleRequest(
          ...oracle.convertFufillParams(request, response, {
            from: oracleNode,
            gas: 500000,
          }),
        )
      })
  
      it('records the data given to it by the oracle', async () => {
        console.log(request)
        const currentPrice = (await betting.oracleRequests.call(request.requestId)).response
        console.log(currentPrice)
        assert.equal(
          web3.utils.padLeft(web3.utils.toHex(currentPrice), 64),
          web3.utils.padLeft(expected, 64),
        )
      })
  
      context('when my contract does not recognize the request ID', () => {
        const otherId = web3.utils.toHex('otherId')
  
        beforeEach(async () => {
          request.id = otherId
        })
  
        it('does not accept the data provided', async () => {
          await expectRevert.unspecified(
            oc.fulfillOracleRequest(
              ...oracle.convertFufillParams(request, response, {
                from: oracleNode,
              }),
            ),
          )
        })
      })
  
      context.skip('when called by anyone other than the oracle contract', () => {
        it('does not accept the data provided', async () => {
          await expectRevert.unspecified(
            betting.chainlinkCallback(request.requestId, response, { from: stranger }),
          )
        })
      })
    })
  
    describe.skip('#cancelRequest', () => {
      let request
  
      beforeEach(async () => {
        await link.transfer(betting.address, web3.utils.toWei('1', 'ether'), {
          from: defaultAccount,
        })
        const tx = await betting.createRequestTo(
          oc.address,
          jobId,
          payment,
          url,
          path,
          times,
          { from: consumer },
        )
        request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
      })
  
      context('before the expiration time', () => {
        it('cannot cancel a request', async () => {
          await expectRevert(
            betting.cancelRequest(
              request.requestId,
              request.payment,
              request.callbackFunc,
              request.expiration,
              { from: consumer },
            ),
            'Request is not expired',
          )
        })
      })
  
      context('after the expiration time', () => {
        beforeEach(async () => {
          await time.increase(300)
        })
  
        context('when called by a non-owner', () => {
          it('cannot cancel a request', async () => {
            await expectRevert.unspecified(
              betting.cancelRequest(
                request.requestId,
                request.payment,
                request.callbackFunc,
                request.expiration,
                { from: stranger },
              ),
            )
          })
        })
  
        context('when called by an owner', () => {
          it('can cancel a request', async () => {
            await betting.cancelRequest(
              request.requestId,
              request.payment,
              request.callbackFunc,
              request.expiration,
              { from: consumer },
            )
          })
        })
      })
    })
  
    describe.skip('#withdrawLink', () => {
      beforeEach(async () => {
        await link.transfer(betting.address, web3.utils.toWei('1', 'ether'), {
          from: defaultAccount,
        })
      })
  
      context('when called by a non-owner', () => {
        it('cannot withdraw', async () => {
          await expectRevert.unspecified(betting.withdrawLink({ from: stranger }))
        })
      })
  
      context('when called by the owner', () => {
        it('transfers LINK to the owner', async () => {
          const beforeBalance = await link.balanceOf(consumer)
          assert.equal(beforeBalance, '0')
          await betting.withdrawLink({ from: consumer })
          const afterBalance = await link.balanceOf(consumer)
          assert.equal(afterBalance, web3.utils.toWei('1', 'ether'))
        })
      })
    })
  })
})
