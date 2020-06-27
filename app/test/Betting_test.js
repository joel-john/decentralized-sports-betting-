const { expectRevert, time } = require('openzeppelin-test-helpers')
const { assert } = require('chai')
const { web3 } = require('openzeppelin-test-helpers/src/setup')

contract('Betting', accounts => {
  const Betting = artifacts.require('Betting.sol')

  const defaultAccount = accounts[0]
  const otherAccount = accounts[1]

  let betting;

  beforeEach(async () => {
    betting = await Betting.new({ from: defaultAccount })
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

    // context('without LINK', () => {
    //   it('reverts', async () => {
    //     await expectRevert.unspecified(
    //       cc.createRequestTo(oc.address, jobId, payment, url, path, times, {
    //         from: consumer,
    //       }),
    //     )
    //   })
    // })

    // context('with LINK', () => {
    //   let request

    //   beforeEach(async () => {
    //     await link.transfer(cc.address, web3.utils.toWei('1', 'ether'), {
    //       from: defaultAccount,
    //     })
    //   })

    //   context('sending a request to a specific oracle contract address', () => {
    //     it('triggers a log event in the new Oracle contract', async () => {
    //       const tx = await cc.createRequestTo(
    //         oc.address,
    //         jobId,
    //         payment,
    //         url,
    //         path,
    //         times,
    //         { from: consumer },
    //       )
    //       request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
    //       assert.equal(oc.address, tx.receipt.rawLogs[3].address)
    //       assert.equal(
    //         request.topic,
    //         web3.utils.keccak256(
    //           'OracleRequest(bytes32,address,bytes32,uint256,address,bytes4,uint256,uint256,bytes)',
    //         ),
    //       )
    //     })
    //   })
    // })
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
      await betting.addBet(0, 0, 0, {from: defaultAccount, value: web3.utils.toWei('3')})
      console.log(await betting.iterableBets.call(0))
    })
  })
})
