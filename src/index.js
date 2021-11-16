const ethereumjs = require('ethereumjs-util');
const hdkey = require('hdkey')
const bip39 = require('bip39')
const Web3 = require('web3')

const { bsc: { HD_PATH }, bsc_transaction: { NATIVE_TRANSFER, CONTRACT_TRANSACTION } } = require('./config/index')
const helpers = require('./helpers/index')

class BSCHdKeyring {
  constructor(mnemonic) {
    this.mnemonic = mnemonic
    this.hdPath = HD_PATH
    this.wallet = null
    this.address = null
  }

  async generateWallet() {
    const seed = await bip39.mnemonicToSeed(this.mnemonic)
    const hdWallet = hdkey.fromMasterSeed(seed)
    this.root = hdWallet.derive(this.hdPath)
    this.wallet = await this.root.deriveChild(0)
    this.address = ethereumjs.Address.fromPrivateKey(Buffer.from(this.wallet.privateKey)).toString('hex')

    return { wallet: this.wallet, address: this.address }
  }

  async exportPrivateKey() {
    const privateKey = this.wallet.privateKey.toString('hex');
    return { privateKey };
  }

  /**
   * NATIVE_TXN : { data : {to, amount}, txnType: NATIVE_TRANSFER }
   * CONTRACT_TXN : { data : {to, amount, data}, txnType: CONTRACT_TRANSACTION }
   *     
   */
  /**
   *  
   * @param {object: NATIVE_TXN | CONTRACT_TXN} transaction 
   * @param {string: <TESTNET | MAINNET>} connectionUrl
   * @returns 
   */
  async signTransaction(transaction, connectionUrl) {
    const privateKey = this.wallet.privateKey.toString('hex');
    const network = helpers.networkSetup(connectionUrl)
    const web3 = new Web3(network.url)

    const { txnType } = transaction
    if (txnType === NATIVE_TRANSFER) {
      const { to, amount } = transaction.data
      const fees = await this.getFee(transaction, connectionUrl)
      const nonce = await web3.eth.getTransactionCount(this.address, 'latest');
      const txObj = {
        from: this.address,
        to: to,
        value: amount,
        gas: fees.transactionFees,
        gasPrice: await web3.eth.getGasPrice(),
        nonce: nonce
      }
      const signedTransactionObj = await web3.eth.accounts.signTransaction(txObj, privateKey)

      return { signedTransaction: signedTransactionObj.rawTransaction }
    }
    if (txnType === CONTRACT_TRANSACTION) {
      const { to, amount, data } = transaction.data
      const fees = await this.getFee(transaction, connectionUrl)
      const nonce = await web3.eth.getTransactionCount(this.address, 'latest');
      const txObj = {
        from: this.address,
        to: to,
        value: amount,
        gas: fees.transactionFees,
        gasPrice: await web3.eth.getGasPrice(),
        nonce: nonce,
        data: data
      }
      const signedTransactionObj = await web3.eth.accounts.signTransaction(txObj, privateKey)

      return { signedTransaction: signedTransactionObj.rawTransaction }
    }

  }

  async signMessage(message) {
    const privateKey = this.wallet.privateKey.toString('hex');
    const web3 = new Web3()
    const { signature } = web3.eth.accounts.sign(
      message,
      privateKey
    );
    return { signedMessage: signature };
  }

  async getAccounts() {
    return { address: this.address }
  }

  async sendTransaction(rawTransaction, connectionUrl) {
    const network = helpers.networkSetup(connectionUrl)
    const web3 = new Web3(network.url)
    const receipt = await web3.eth.sendSignedTransaction(rawTransaction);

    return { transactionDetails: receipt.transactionHash }
  }

  /**
   * NATIVE_TXN : { data : {to, amount}, txnType: NATIVE_TRANSFER }
   * CONTRACT_TXN : { data : {to, amount, data}, txnType: CONTRACT_TRANSACTION }
   *     
   */
  /**
   *  
   * @param {object: NATIVE_TXN | CONTRACT_TXN} transaction 
   * @param {string: <TESTNET | MAINNET>} connectionUrl
   * @returns 
   */
  async getFee(transaction, connectionUrl) {
    const network = helpers.networkSetup(connectionUrl)
    const web3 = new Web3(network.url)
    const { txnType } = transaction
    if (txnType === NATIVE_TRANSFER) {
      const { to, amount } = transaction.data
      const estimate = await web3.eth.estimateGas({ to, from: this.address, value: amount })

      return { transactionFees: estimate }
    }

    if (txnType === CONTRACT_TRANSACTION) {
      const { to, amount, data } = transaction.data
      const estimate = await web3.eth.estimateGas({ to, from: this.address, value: amount, data })

      return { transactionFees: estimate }
    }
  }

  async getBalance(connectionUrl) {
    const network = helpers.networkSetup(connectionUrl)
    const web3 = new Web3(network.url)
    return { balance: await web3.eth.getBalance(this.address) }
  }

}

module.exports = BSCHdKeyring