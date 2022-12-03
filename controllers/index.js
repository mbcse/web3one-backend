import { getBalance, getNFTs, getTokens, getNftTransfers, getTokenTransfers, getTransfersData, getNativeTransactions, getChainExplorerLink } from './moralis.js'

export const nft = async (req, res) => {
  const address = req.params.address
  const chain = req.params.chain
  const nftData = await getNFTs(chain, address)
  const explorerLink = await getChainExplorerLink(chain)
  res.json({ title: 'nft', nftData, userAddress: address, chain, explorerLink })
}

export const token = async (req, res) => {
  const address = req.params.address
  const chain = req.params.chain
  const tokenData = await getTokens(chain, address)
  const explorerLink = await getChainExplorerLink(chain)
  res.json({ title: 'token', tokenData, userAddress: address, chain, explorerLink })
}

export const nftTransfers = async (req, res) => {
  const address = req.params.address
  const chain = req.params.chain
  // const nftTransfers = await getNftTransfers(chain, address)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Transfer-Encoding', 'chunked')
  req.on('close', () => {
    res.end()
    console.log('Connection closed')
  })
  await getNftTransfers(chain, address, res)
  res.end()
}

export const tokenTransfers = async (req, res) => {
  const address = req.params.address
  const chain = req.params.chain
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Transfer-Encoding', 'chunked')
  req.on('close', () => {
    res.end()
    console.log('Connection closed')
  })
  await getTokenTransfers(chain, address, res)
  res.end()
}

export const nativeTransactions = async (req, res) => {
  const address = req.params.address
  const chain = req.params.chain
  // const nftTransfers = await getNftTransfers(chain, address)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Transfer-Encoding', 'chunked')
  req.on('close', () => {
    res.end()
    console.log('Connection closed')
  })
  await getNativeTransactions(chain, address, res)
  res.end()
}

export const transactions = async (req, res) => {
  const address = req.params.address
  const chain = req.params.chain
  const explorerLink = await getChainExplorerLink(chain)
  res.json({ title: 'Transactions', userAddress: address, chain, explorerLink })
}
