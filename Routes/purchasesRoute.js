const express = require('express');
const purchaseController = require('../Controllers/purchaseController');

const router = express.Router();

router.post('/purchase', purchaseController.createPurchase);
router.get('/purchases', purchaseController.getAllPurchases);
router.get('/purchases/user/:userId', purchaseController.getPurchasesByUser);
router.delete('/purchase/:purchaseId', purchaseController.deletePurchase);
router.get('/purchase/:userId/:productId', purchaseController.getPurchaseByUserAndProduct);

module.exports = router;
