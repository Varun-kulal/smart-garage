const PartnershipRequest = require('../models/PartnershipRequest');
const Garage = require('../models/Garage');

// @desc    Submit a new partnership request
// @route   POST /api/partners
// @access  Public
exports.submitRequest = async (req, res) => {
  try {
    const { ownerName, garageName, email, phone, location, message } = req.body;

    const newRequest = await PartnershipRequest.create({
      ownerName,
      garageName,
      email,
      phone,
      location,
      message
    });

    res.status(201).json({
      success: true,
      data: newRequest,
      message: 'Partnership request submitted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all partnership requests
// @route   GET /api/partners
// @access  Admin
exports.getRequests = async (req, res) => {
  try {
    const requests = await PartnershipRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update request status (Approve/Reject)
// @route   PUT /api/partners/:id/status
// @access  Admin
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await PartnershipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = status;
    await request.save();

    // If approved, automatically create a new Garage entry
    if (status === 'Approved') {
      const existingGarage = await Garage.findOne({ name: request.garageName });
      if (!existingGarage) {
        await Garage.create({
          name: request.garageName,
          location: request.location,
          technicianName: request.ownerName,
          technicianPhone: request.phone
        });
      }
    }

    res.status(200).json({ success: true, data: request, message: `Request marked as ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a partnership request
// @route   DELETE /api/partners/:id
// @access  Admin
exports.deleteRequest = async (req, res) => {
  try {
    const request = await PartnershipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    await request.deleteOne();
    res.status(200).json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
