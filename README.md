# vault-bsc-controller

This repository contains `BSCHdKeyring` class to create **Binance smart chain wallet** from **Safle Vault**.

## Install

`npm install --save @getsafle/vault-bsc-controller`

## Initialize the BSC Controller class

```
const { KeyringController, getBalance } = require('@getsafle/vault-bsc-controller');

const bscController = new KeyringController({
  encryptor: {
    // An optional object for defining encryption schemes:
    // Defaults to Browser-native SubtleCrypto.
    encrypt(password, object) {
      return new Promise('encrypted!');
    },
    decrypt(password, encryptedString) {
      return new Promise({ foo: 'bar' });
    },
  },
});
```

## Methods

### Generate Keyring with 1 account and encrypt

```
const keyringState = await bscController.createNewVaultAndKeychain(password);
```

### Restore a keyring with the first account using a mnemonic

```
const keyringState = await bscController.createNewVaultAndRestore(password, mnemonic);
```

### Add a new account to the keyring object

```
const keyringState = await bscController.addNewAccount(keyringObject);
```

### Export the private key of an address present in the keyring

```
const privateKey = await bscController.exportAccount(address);
```

### Sign a transaction

```
const signedTx = await bscController.signTransaction(bscTx, _fromAddress);
```

### Sign a message

```
const signedMsg = await bscController.signMessage(msgParams);
```

### Sign Typed Data (EIP-712)

```
const signedData = await bscController.signTypedMessage(msgParams);
```

### Get balance

```
const balance = await getBalance(address, web3);
```
