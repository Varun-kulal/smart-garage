const Part = require('../models/Part');
const Inventory = require('../models/Inventory');

// ================= MASTER PARTS CATALOG CRUD =================

// @desc    Get all parts in catalog
// @route   GET /api/parts
// @access  Private (Both)
exports.getParts = async (req, res) => {
  try {
    const parts = await Part.find().sort({ name: 1 });
    res.json({ success: true, count: parts.length, data: parts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new part catalog entry
// @route   POST /api/parts
// @access  Private (Admin Only)
exports.createPart = async (req, res) => {
  const { name, code, description, category, imageUrl, basePrice, compatibility, quantityInStock, reorderLevel, location } = req.body;

  try {
    const codeExists = await Part.findOne({ code });
    if (codeExists) {
      return res.status(400).json({ success: false, message: `Part with code ${code} already exists` });
    }

    // Build part data object
    const partData = {
      name,
      code,
      description,
      category,
      imageUrl,
      basePrice,
      compatibility
    };
    // If an image file is uploaded, store Buffer and generate data URL
    if (req.file) {
      partData.imageData = req.file.buffer;
      const mime = req.file.mimetype;
      partData.imageUrl = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
    }
    const part = await Part.create(partData);

    // Automatically create corresponding inventory record
    const inventory = await Inventory.create({
      part: part._id,
      quantityInStock: quantityInStock || 0,
      reorderLevel: reorderLevel || 5,
      location: location || 'Main Bay'
    });

    res.status(201).json({
      success: true,
      data: {
        part,
        inventory
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update part details
// @route   PUT /api/parts/:id
// @access  Private (Admin Only)
exports.updatePart = async (req, res) => {
  const { name, code, description, category, imageUrl, basePrice, compatibility } = req.body;

  try {
    let part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ success: false, message: 'Part not found' });
    }

    part.name = name || part.name;
    part.code = code || part.code;
    part.description = description || part.description;
    part.category = category || part.category;
    part.imageUrl = imageUrl || part.imageUrl;
    part.basePrice = basePrice !== undefined ? basePrice : part.basePrice;
    part.compatibility = compatibility || part.compatibility;

    const updatedPart = await part.save();
    res.json({ success: true, data: updatedPart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update part image
// @route   PUT /api/parts/:id/image
// @access  Private (Admin Only)
exports.updatePartImage = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ success: false, message: 'Part not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    part.imageData = req.file.buffer;
    const mime = req.file.mimetype;
    part.imageUrl = `data:${mime};base64,${req.file.buffer.toString('base64')}`;

    const updatedPart = await part.save();
    res.json({ success: true, data: updatedPart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Delete part from catalog and inventory
// @route   DELETE /api/parts/:id
// @access  Private (Admin Only)
exports.deletePart = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ success: false, message: 'Part not found' });
    }

    // Cascade delete inventory record
    await Inventory.deleteOne({ part: part._id });
    await Part.findByIdAndDelete(part._id);

    res.json({ success: true, message: 'Part catalog and inventory record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= STOCK / INVENTORY CONTROLS =================

// @desc    Get all inventory items (with populated part data)
// @route   GET /api/inventory
// @access  Private (Both)
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate('part')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: inventory.length, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update stock details for a part
// @route   PUT /api/inventory/:id
// @access  Private (Admin Only)
exports.updateStock = async (req, res) => {
  const { quantityInStock, reorderLevel, location } = req.body;

  try {
    let inventory = await Inventory.findById(req.params.id).populate('part');

    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Inventory record not found' });
    }

    inventory.quantityInStock = quantityInStock !== undefined ? quantityInStock : inventory.quantityInStock;
    inventory.reorderLevel = reorderLevel !== undefined ? reorderLevel : inventory.reorderLevel;
    inventory.location = location || inventory.location;

    const updatedInventory = await inventory.save();

    res.json({ success: true, data: updatedInventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an inventory record (admin only)
// @route   DELETE /api/inventory/:id
// @access  Private (Admin Only)
exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Inventory record not found' });
    }
    await Inventory.findByIdAndDelete(inventory._id);
    res.json({ success: true, message: 'Inventory record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inventory parts for shop (user view)
// @route   GET /api/inventory/shop/parts
// @access  Private (User)
exports.getShopParts = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('part');
    res.json({ success: true, count: inventory.length, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
