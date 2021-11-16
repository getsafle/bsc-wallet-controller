var assert = require('assert');
const Web3 = require('web3')
const bridgeContract = require('./contract-json/BridgeBsc.json');
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
    CONTRACT_TXN: {
        BSC_CONTRACT,
        BSC_AMOUNT_TO_CONTRACT
    },
    TRANSACTION_TYPE: {
        NATIVE_TRANSFER,
        CONTRACT_TRANSACTION
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
    connectionUrl: TESTNET.NETWORK
}

const BSC_CONTRACT_TXN_PARAM = {
    transaction: {
        data: {
            to: BSC_CONTRACT,
            amount: BSC_AMOUNT_TO_CONTRACT,
            data: null // will be updated in the test case. this will never be null
        },
        txnType: CONTRACT_TRANSACTION
    },
    connectionUrl: TESTNET.NETWORK
}

const CONTRACT_MINT_PARAM = {
    from: BSC_CONTRACT, 
    to: '', // this will be the current account 
    amount: 1,
    nonce: 0,
    signature: [72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 220, 122]
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

    it("Get fees - transfer BSC", async () => {
        const { transactionFees } = await bscWallet.getFee(BSC_TXN_PARAM.transaction, BSC_TXN_PARAM.connectionUrl);
        console.log("transactionFees ", transactionFees)
    })

    it("Get fees - mint token in a demo token contract", async () => {
        const url = BSC_CONTRACT_TXN_PARAM.connectionUrl === TESTNET.NETWORK ? 
        { url: 'https://data-seed-prebsc-1-s1.binance.org:8545', chainId: TESTNET.CHAIN_ID } :
        { url: `https://bsc-dataseed1.binance.org`, chainId: MAINNET.CHAIN_ID }

        const web3 = new Web3(url.url);
        const bridgeBsc = new web3.eth.Contract(
            bridgeContract.abi,
            bridgeContract.networks[`${url.chainId}`].address
        );

        const tx = bridgeBsc.methods.mint(CONTRACT_MINT_PARAM.from, bscWallet.address.toLowerCase(), CONTRACT_MINT_PARAM.amount, CONTRACT_MINT_PARAM.nonce, CONTRACT_MINT_PARAM.signature);
        const data = tx.encodeABI();
        BSC_CONTRACT_TXN_PARAM.transaction.data.data = data

        const { transactionFees } = await bscWallet.getFee(BSC_CONTRACT_TXN_PARAM.transaction, BSC_CONTRACT_TXN_PARAM.connectionUrl);
        console.log("transactionFees ", transactionFees)
    })

    it("Sign Transaction - transfer BSC", async () => {
        const { signedTransaction } = await bscWallet.signTransaction(BSC_TXN_PARAM.transaction, BSC_TXN_PARAM.connectionUrl);
        console.log("signedTransaction ", signedTransaction)

        // const sendTransaction = await bscWallet.sendTransaction(signedTransaction, BSC_TXN_PARAM.connectionUrl)
        // console.log("sendTransaction ", sendTransaction)
    })

    it("Sign Transaction - mint token in a demo token contract", async () => {
        const url = BSC_CONTRACT_TXN_PARAM.connectionUrl === TESTNET.NETWORK ? 
        { url: 'https://data-seed-prebsc-1-s1.binance.org:8545', chainId: TESTNET.CHAIN_ID } :
        { url: `https://bsc-dataseed1.binance.org`, chainId: MAINNET.CHAIN_ID }

        const web3 = new Web3(url.url);
        const bridgeBsc = new web3.eth.Contract(
            bridgeContract.abi,
            bridgeContract.networks[`${url.chainId}`].address
        );

        const tx = bridgeBsc.methods.mint(CONTRACT_MINT_PARAM.from, bscWallet.address.toLowerCase(), CONTRACT_MINT_PARAM.amount, CONTRACT_MINT_PARAM.nonce, CONTRACT_MINT_PARAM.signature);
        const data = tx.encodeABI();
        BSC_CONTRACT_TXN_PARAM.transaction.data.data = data

        const { signedTransaction } = await bscWallet.signTransaction(BSC_CONTRACT_TXN_PARAM.transaction, BSC_CONTRACT_TXN_PARAM.connectionUrl);
        console.log("signedTransaction ", signedTransaction)

        // const sendTransaction = await bscWallet.sendTransaction(signedTransaction, BSC_CONTRACT_TXN_PARAM.connectionUrl)
        // console.log("sendTransaction ", sendTransaction)
    })

    it("Get balance ", async () => {
        const { balance } = await bscWallet.getBalance(TESTNET.NETWORK);
        console.log("balance ", balance)
    })

})