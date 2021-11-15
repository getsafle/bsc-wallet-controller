var assert = require('assert');
const Web3 = require('web3')
const BSC = require('../src/index')
const {
    HD_WALLET_12_MNEMONIC,
    HD_WALLET_12_MNEMONIC_TEST_OTHER,
    TESTING_MESSAGE_1,
    TESTING_MESSAGE_2,
    TESTING_MESSAGE_3,
    BSC_NETWORK: {
        TESTNET,
        MAINNET
    },
    TRANSFER_BSC: {
        BSC_AMOUNT,
        BSC_RECEIVER
    },
    TRANSACTION_TYPE: {
        NATIVE_TRANSFER,
        TOKEN_TRANSFER,
        CONTRACT_TRANSACTION,
        MINT_NEW_TOKEN
    },
} = require('./constants')

const BSC_TXN_PARAM = {
    transaction: {
        data: {
            to: BSC_RECEIVER,
            amount: BSC_AMOUNT,
        },
        txnType: NATIVE_TRANSFER
    },
    connectionUrl: TESTNET
}

describe('Initialize wallet ', () => {
    const bscWallet = new BSC(HD_WALLET_12_MNEMONIC)

    it("Should have correct mnemonic", () => {
        assert.equal(bscWallet.mnemonic, HD_WALLET_12_MNEMONIC, "Incorrect hd wallet")
    })

    it("Should generateWallet ", async () => {
        assert(bscWallet.address === null)
        const wallet = await bscWallet.generateWallet()
        console.log("wallet, ", wallet)
        assert(bscWallet.address !== null)
    })

    it("Should get privateKey ", async () => {
        const privateKey = await bscWallet.exportPrivateKey(TESTNET)
        console.log("privateKey, ", privateKey)
    })

    it("Should get account ", async () => {
        const accounts = await bscWallet.getAccounts()
        console.log("accounts, ", accounts)
    })

    it("Sign message", async () => {
        const web3 = new Web3()

        const signedMessage1 = await bscWallet.signMessage(TESTING_MESSAGE_1)
        let signedAddress = web3.eth.accounts.recover(TESTING_MESSAGE_1, signedMessage1.signedMessage)
        assert(signedAddress.toLowerCase() === bscWallet.address.toLowerCase(), "Should verify message 1")

        const signedMessage2 = await bscWallet.signMessage(TESTING_MESSAGE_2)
        signedAddress = web3.eth.accounts.recover(TESTING_MESSAGE_2, signedMessage2.signedMessage)
        assert(signedAddress.toLowerCase() === bscWallet.address.toLowerCase(), "Should verify message 1")

        const signedMessage3 = await bscWallet.signMessage(TESTING_MESSAGE_3)
        signedAddress = web3.eth.accounts.recover(TESTING_MESSAGE_3, signedMessage3.signedMessage)
        assert(signedAddress.toLowerCase() === bscWallet.address.toLowerCase(), "Should verify message 1")
    })

    it("Get fees", async () => {
        const { transactionFees } = await bscWallet.getFee(BSC_TXN_PARAM.transaction, BSC_TXN_PARAM.connectionUrl);
        console.log("transactionFees ", transactionFees)
    })

    it("Sign Transaction", async () => {
        const { signedTransaction } = await bscWallet.signTransaction(BSC_TXN_PARAM.transaction, BSC_TXN_PARAM.connectionUrl);
        console.log("signedTransaction ", signedTransaction)

        const sendTransaction = await bscWallet.sendTransaction(signedTransaction, BSC_TXN_PARAM.connectionUrl)
        console.log("sendTransaction ", sendTransaction)
    })

})