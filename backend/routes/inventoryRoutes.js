const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Multer middleware for image upload
const {
  getParts,
  createPart,
  updatePart,
  deletePart,
  getInventory,
  getShopParts,
  updateStock,
  deleteInventory,
  updatePartImage
} = require('../controllers/inventoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

// Master Catalog Routes
router.route('/parts')
  .get(getParts)
  .post(adminOnly, upload.single('image'), createPart);

router.route('/parts/:id')
  .put(adminOnly, updatePart)
  .delete(adminOnly, deletePart);

router.route('/parts/:id/image')
  .put(adminOnly, upload.single('image'), updatePartImage);


// Inventory Stock Routes
router.route('/')
  .get(getInventory);

// Shop Parts Route (User view)
router.route('/shop/parts')
  .get(getShopParts);

router.route('/:id')
  .put(adminOnly, updateStock)
  .delete(adminOnly, deleteInventory);

module.exports = router;
