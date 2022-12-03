import express from 'express'
import adminRoute from './admin'
import healthRoute from './health'
// import verifyAPIKey from '../middleware/verifyAPIKey.js'
// import { homepage } from '../controllers/home'

const router = express.Router()

// landing page
router.get('/', (req, res) => {
  res.send('web3one-backend')
})

// router.use('/admin', adminRoute)
router.use('/health', healthRoute)

export default router
