const { bsc_network: { MAINNET, TESTNET } } = require('../../config/index')

function getNetworkDetails(_network) {
    return _network === TESTNET.NETWORK ?
        { url: 'https://data-seed-prebsc-1-s1.binance.org:8545', chainId: TESTNET.CHAIN_ID } :
        { url: `https://bsc-dataseed1.binance.org`, chainId: MAINNET.CHAIN_ID }
}

module.exports = getNetworkDetails