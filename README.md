# bsc-wallet-controller

This repository contains `BSCHdKeyring` class to create **Binance smart chain wallet** from **Safle Vault**.

## Usecase

We will be using `BSCHdKeyring` class to initialize the wallet and then utilize the provided functions to perform the required tasks. <br />
The class initialization is done in the following way.

```
const bscWallet = new BSCHdKeyring(`mnemonic`)
```

`mnemonic` is the BIP-39 key phrase to generate the wallet.

Once we initialize the class, we can utilize the provided functions.

The wallet have the following functions:

#### generateWallet()

This function is used to generate the BSC wallet and set the 0th address as the default address. <br />
parameters: - <br />
returns: `{address: string} // wallet address`

#### exportPrivateKey()

This function is used to export the private key for the generated address. <br />
**parameters:** - <br />
**returns:** `{privateKey: string} // address private key`

#### signTransaction(transaction: _TransactionObj_ , connectionUrl: _string_ )

This function is used to sign a transaction off-chain and then send it to the network.<br /> Transactions are of 4 types:

1. BSC transfer:<br />
   Trasaction to transfer BSC from one wallet/address to another.<br />The transaction object is of the following type:

```
TransactionObj: {
    data: {
        to, // destination address
        amount, // amount in wei
    },
    txnType: NATIVE_TRANSFER // type constant
}
```

2. Contract transactions:<br />
   Transaction to call any smart contract function.<br />The transaction object is of the following type:

```
TransactionObj: {
    data: {
        to, // destination smart contract address
        amount, // amount in wei
        data, // hex string of the encoded data
    },
    txnType: CONTRACT_TRANSACTION // type constant
}
```

**parameters:**

```
name: transaction,
type: TransactionObj, // refer to the above 2 trancationObj types.

name: connectionUrl, // BTC network {TESTNET | MAINNET}
type: string,
default: MAINNET (undefined)
optional
```

**returns:** `{signedTransaction: string} signed raw transaction`

#### signMessage(message: _string_ )

This function is used to sign a message. <br />
**parameters:**

```
name: message
type: string
```

**returns:** `{signedMessage: string} // signed message hex string`

#### getAccounts()

This function is used to get the wallet address. <br />
**parameters:** - <br />
**returns:** `{address: string} // wallet address`

#### sendTransaction(rawTransaction: _string_ , connectionUrl: _string_)

This function is used send the signed transaction onto the chain. <br />
**parameters:**

```
name: rawTransaction, // signed raw transaction (got from signedTransaction())
type: string

name: connectionUrl, // BTC network {TESTNET | MAINNET}
type: string,
default: MAINNET (undefined)
optional
```

**returns:** `{transactionDetails : string} // transaction hash`

#### getFee(transaction: _TransactionObj_ , connectionUrl: _string_)

This function is returns the fees in wei which will be used for the passed transaction. <br />

**parameters:**

```
name: transaction,
type: TransactionObj, // refer to the 2 trancationObj types provided in signTransaction.

name: connectionUrl, // BTC network {TESTNET | MAINNET}
type: string,
default: MAINNET (undefined)
optional
```

**returns:** `{transactionFees: integer} // transaction fees`

#### getBalance(connectionUrl: _string_)

This function is returns the account balance in wei. <br />

**parameters:**

```
name: connectionUrl, // BTC network {TESTNET | MAINNET}
type: string,
default: MAINNET (undefined)
optional
```

**returns:** `{balance: integer} // transaction fees`
