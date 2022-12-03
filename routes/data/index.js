import express from 'express'
import * as dataController from '../../controllers/index.js'
const router = express.Router()

router.get('/nft/:chain/:address', dataController.nft)
router.get('/token/:chain/:address', dataController.token)
router.get('/nftTransfers/:chain/:address', dataController.nftTransfers)
router.get('/tokenTransfers/:chain/:address', dataController.tokenTransfers)
router.get('/nativeTransactions/:chain/:address', dataController.nativeTransactions)
router.get('/transactions/:chain/:address', dataController.transactions)

export default router
