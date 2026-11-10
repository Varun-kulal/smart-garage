const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');
const Inventory = require('../models/Inventory');

// @desc    Get dashboard metrics and chart statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin Only)
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Core Card Metrics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVehicles = await Vehicle.countDocuments();
    const totalServicesCatalog = await Service.countDocuments();
    const totalServiceRequests = await ServiceRequest.countDocuments();

    // Sum of inventory items
    const inventoryItems = await Inventory.find();
    const totalInventoryCount = inventoryItems.reduce((acc, curr) => acc + curr.quantityInStock, 0);

    // Sum of revenue from completed services
    const completedServices = await ServiceRequest.find({ status: 'Completed' });
    const totalRevenue = completedServices.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);

    // 2. Chart Data: Monthly Revenue (Last 6 Months)
    // For demo purposes, we will return dynamic monthly data based on DB or standard values if DB is fresh.
    const revenueData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    for (let i = 5; i >= 0; i--) {
      const targetMonthIndex = (currentMonth - i + 12) % 12;
      const targetMonthName = months[targetMonthIndex];
      
      // Calculate matching revenue in database
      const startOfMonth = new Date();
      startOfMonth.setMonth(startOfMonth.getMonth() - i);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      const monthCompleted = await ServiceRequest.find({
        status: 'Completed',
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });
      const monthRev = monthCompleted.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);

      revenueData.push({
        month: targetMonthName,
        revenue: monthRev || 0
      });
    }

    // 3. Chart Data: Service Category Trends (Distribution of service requests)
    const categoryCounts = await ServiceRequest.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      { $unwind: '$serviceDetails' },
      {
        $group: {
          _id: '$serviceDetails.category',
          count: { $sum: 1 }
        }
      }
    ]);

    const serviceTrends = categoryCounts.map(item => ({
      category: item._id,
      count: item.count
    }));


    // 5. Low Stock Warnings
    const lowStockInventory = await Inventory.find({
      $expr: { $lte: ["$quantityInStock", "$reorderLevel"] }
    }).populate('part');

    const lowStockItems = lowStockInventory.map(item => ({
      partName: item.part?.name || 'Unknown Part',
      partCode: item.part?.code || 'N/A',
      quantity: item.quantityInStock,
      reorderLevel: item.reorderLevel
    }));

    res.json({
      success: true,
      data: {
        cards: {
          totalUsers,
          totalVehicles,
          totalServicesCatalog,
          totalServiceRequests,
          totalRevenue,
          totalInventoryCount
        },
        charts: {
          revenue: revenueData,
          serviceTrends
        },
        inventory: {
          lowStockItems
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
