import express from 'express'
import { insert, insertPricesAndAreas } from '../controllers/insert'

const router = express.Router()
router.post('/', insert)
router.post('/prices-areas', insertPricesAndAreas)

export default router