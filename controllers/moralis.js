import Moralisdefault from 'moralis'
import pkg from '@moralisweb3/evm-utils'
import config from '../config'
import axios from 'axios'

const { EvmChain } = pkg

const Moralis = Moralisdefault.default

await Moralis.start({
  apiKey: config.MORALIS.API_KEY
})

const delay = async (millis) => new Promise(resolve => setTimeout(resolve, millis))

export const getBalance = async (chainName, address) => {
  console.log('Getting Wallet Balance Data')
  const chain = EvmChain[chainName]
  console.log(chain)
  const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain
  })

  const native = nativeBalance.result.balance.ether
  return native
}

export const getTokens = async (chainName, address) => {
  console.log('Getting Wallet Tokens Data')
  const chain = EvmChain[chainName]
  const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain
  })

  const tokens = tokenBalances.result.map((token) => {
    return {
      name: token.toJSON().token.name,
      tokenAddress: token.toJSON().token.contractAddress,
      symbol: token.toJSON().token.symbol,
      balance: token.toJSON().value,
      decimal: token.toJSON().token.decimals
    }
  })

  return { tokens }
}

export const getTokenTransfers = async (chainName, address, res) => {
  console.log('Getting Wallet Token Transfers Data')
  const chain = EvmChain[chainName]

  const tokenTransfers = await Moralis.EvmApi.token.getWalletTokenTransfers({
    address,
    chain
  })
  const transfers = await Promise.all(tokenTransfers.result.map(async (transfer, i) => {
    await delay(1000 + (i * 1000))
    console.log('Executing call ' + i)
    let tokenData = await Moralis.EvmApi.token.getTokenMetadata({
      addresses: [transfer.toJSON().address],
      chain
    })

    tokenData = tokenData.toJSON()[0].token
    res.write(JSON.stringify({
      name: tokenData.name,
      tokenAddress: transfer.toJSON().address,
      symbol: tokenData.symbol,
      decimal: tokenData.decimals,
      fromAddress: transfer.toJSON().fromAddress,
      toAddress: transfer.toJSON().toAddress,
      amount: transfer.toJSON().value,
      transactionHash: transfer.toJSON().transactionHash,
      type: transfer.toJSON().fromAddress === address ? 'Sent' : 'Received'
    }) + '\r\n')
  }))

  return transfers
}

export const getNFTs = async (chainName, address) => {
  console.log('Getting Wallet NFTs Data')

  const chain = EvmChain[chainName]
  const nftsBalances = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    chain
  })

  // console.log(nftsBalances.result)

  const nfts = nftsBalances.result.map((nft) => {
    return {
      name: nft.toJSON().name,
      symbol: nft.toJSON().symbol,
      tokenId: nft.toJSON().tokenId,
      amount: nft.toJSON().amount,
      contractType: nft.toJSON().contractType,
      tokenAddress: nft.toJSON().tokenAddress,
      tokenUri: nft.toJSON().tokenUri,
      tokenMetadata: nft.toJSON().metadata
    }
  })

  return { nfts }
}

export const getNftTransfers = async (chainName, address, res) => {
  const chain = EvmChain[chainName]
  const nftsTransfers = await Moralis.EvmApi.nft.getWalletNFTTransfers({
    address,
    chain
  })

  console.log('Getting Wallet NFT transfers Data')
  const transfers = await Promise.all(nftsTransfers.result.map(async (transfer, i) => {
    await delay(1000 + (i * 1000))
    console.log('Executing call ' + i)
    if (!isNaN(transfer.toJSON().tokenId)) {
      try {
        const options = {
          method: 'GET',
          url: `https://deep-index.moralis.io/api/v2/nft/${transfer.toJSON().tokenAddress}/${transfer.toJSON().tokenId}`,
          params: { chain: chain._value, format: 'decimal' },
          headers: { accept: 'application/json', 'X-API-Key': config.MORALIS.API_KEY }
        }
        const nftDetails = (await axios.request(options)).data
        res.write(JSON.stringify({
          name: nftDetails.name,
          symbol: nftDetails.symbol,
          tokenId: transfer.toJSON().tokenId,
          amount: transfer.toJSON().amount,
          contractType: transfer.toJSON().contractType,
          tokenAddress: transfer.toJSON().tokenAddress,
          fromAddress: transfer.toJSON().fromAddress,
          toAddress: transfer.toJSON().toAddress,
          transactionHash: transfer.toJSON().transactionHash,
          type: transfer.toJSON().fromAddress === address ? 'Sent' : 'Received'

        }) + '\r\n')
      } catch (err) {

      }
    }
  }))

  return transfers
}

export const getTransfersData = async (chainName, address) => {
  const chain = EvmChain[chainName]
  const transactions = await Moralis.EvmApi.transaction.getWalletTransactions({
    address,
    chain
  })

  const nftsTransfers = await Moralis.EvmApi.nft.getWalletNFTTransfers({
    address,
    chain
  })

  const tokenTransfers = await Moralis.EvmApi.token.getWalletTokenTransfers({
    address,
    chain
  })

  console.log({ totalNftTransfers: nftsTransfers.result.length, totalTokenTransfers: tokenTransfers.result.length, totalTransactions: transactions.result.length })

  return { totalNftTransfers: nftsTransfers.result.length, totalTokenTransfers: tokenTransfers.result.length, totalTransactions: transactions.result.length }
}

export const getNativeTransactions = async (chainName, address, res) => {
  console.log('Getting Native Transactions')

  const chain = EvmChain[chainName]
  const transactions = await Moralis.EvmApi.transaction.getWalletTransactions({
    address,
    chain
  })

  const transfers = await Promise.all(transactions.result.map(async (transfer, i) => {
    await delay(1000 + (i * 1000))
    console.log('Executing call ' + i)
    res.write(JSON.stringify({
      fromAddress: transfer.toJSON().from,
      toAddress: transfer.toJSON().to,
      amount: transfer.toJSON().value / 10 ** 18,
      transactionHash: transfer.toJSON().hash,
      timestamp: transfer.toJSON().blockTimestamp
    }) + '\r\n')
  }))
}

// getNativeTransfers('CRONOS', '0x706Fd6E953523B3DCBAC03F7DFd46b1E6b08D23A', {})

export const getChainExplorerLink = async (chainName) => {
  const chain = EvmChain[chainName]
  console.log(chain._chainlistData.explorers[0].url)
  return chain._chainlistData.explorers[0].url
}
