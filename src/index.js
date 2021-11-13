const ethereumjs = require('ethereumjs-util');
const hdkey = require('hdkey')
const bip39 = require('bip39')
const Web3 = require('web3')

const { bsc: { HD_PATH } } = require('./config/index')

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

}

module.exports = BSCHdKeyring