import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Search, Plus, Edit2, Trash2, Sliders, X, Check, Image, Upload, Truck } from 'lucide-react';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stock'); // 'stock' or 'catalog'
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [partOrders, setPartOrders] = useState([]);

  // Part Catalog Form modal state
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [editingPartId, setEditingPartId] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Engine');
  const [basePrice, setBasePrice] = useState(0);
  const [compatibility, setCompatibility] = useState('');
  const [description, setDescription] = useState('');
  
  // Stock Initial parameters
  const [initialQty, setInitialQty] = useState(0);
  const [initialReorder, setInitialReorder] = useState(5);
  const [initialLocation, setInitialLocation] = useState('Main Warehouse');

  // Stock Adjustment modal state
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedStockRecord, setSelectedStockRecord] = useState(null);
  const [qtyInStock, setQtyInStock] = useState(0);
  const [reorderLvl, setReorderLvl] = useState(5);
  const [stockLocation, setStockLocation] = useState('');

  // Image Upload modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPartForImage, setSelectedPartForImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = [
    'Engine', 'Battery', 'Brake Pad', 'Air Filter', 'Tire', 
    'Headlight', 'Radiator', 'Spark Plug', 'Fuel Injector', 
    'Alternator', 'Clutch Plate', 'Suspension', 'Other'
  ];

  useEffect(() => {
    fetchInventory();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders');
      if (res.data.success) {
        const formattedOrders = res.data.data.map(o => ({
          id: o.orderId,
          status: o.status,
          date: o.createdAt,
          items: o.items,
          shippingDetails: o.shippingDetails || null
        }));
        setPartOrders(formattedOrders);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setPartOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setSuccess(`Order ${orderId} updated to ${newStatus}`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await axios.delete(`/orders/${orderId}`);
      if (res.data.success) {
        setPartOrders(prev => prev.filter(o => o.id !== orderId));
        setSuccess(`Order ${orderId} deleted successfully`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete order');
      setTimeout(() => setError(''), 3000);
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/inventory');
      if (res.data.success) {
        setInventory(res.data.data);
      }
    } catch (err) {
      setError('Could not retrieve warehouse inventory.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddPart = () => {
    setEditingPartId(null);
    setName('');
    setCode('');
    setCategory('Engine');
    setBasePrice(0);
    setCompatibility('');
    setDescription('');
    setInitialQty(0);
    setInitialReorder(5);
    setInitialLocation('Main Warehouse');
    setShowCatalogModal(true);
  };

  const handleOpenEditPart = (record) => {
    const part = record.part;
    setEditingPartId(part._id);
    setName(part.name);
    setCode(part.code);
    setCategory(part.category);
    setBasePrice(part.basePrice);
    setCompatibility(part.compatibility || '');
    setDescription(part.description || '');
    setShowCatalogModal(true);
  };

  const handleOpenStockAdjust = (record) => {
    setSelectedStockRecord(record);
    setQtyInStock(record.quantityInStock);
    setReorderLvl(record.reorderLevel);
    setStockLocation(record.location || '');
    setShowStockModal(true);
  };

  const handleOpenImageUpload = (part) => {
    setSelectedPartForImage(part);
    setImageFile(null);
    setImagePreview(part?.imageUrl || '');
    setDragActive(false);
    setShowImageModal(true);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        setError('Please drop an image file (PNG/JPG/etc).');
        setTimeout(() => setError(''), 3500);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        setError('Please select an image file (PNG/JPG/etc).');
        setTimeout(() => setError(''), 3500);
      }
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select or drop an image file first.');
      setTimeout(() => setError(''), 3500);
      return;
    }

    setUploadingImage(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await axios.put(`/inventory/parts/${selectedPartForImage._id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setSuccess('Part image updated successfully!');
        fetchInventory();
        setShowImageModal(false);
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeletePart = async (partId) => {
    if (!window.confirm('Are you sure you want to remove this part from the catalog? This will delete all stock records associated.')) {
      return;
    }

    try {
      const res = await axios.delete(`/inventory/parts/${partId}`);
      if (res.data.success) {
        setSuccess('Part catalog deleted successfully.');
        setInventory(prev => prev.filter(item => item.part?._id !== partId));
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError('Failed to delete catalog item.');
      setTimeout(() => setError(''), 3500);
    }
  };

  const handleCatalogSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      name, code, category, basePrice, compatibility, description
    };

    try {
      if (editingPartId) {
        // Edit flow
        const res = await axios.put(`/inventory/parts/${editingPartId}`, payload);
        if (res.data.success) {
          setSuccess('Part catalog entry updated.');
          fetchInventory(); // refresh list
        }
      } else {
        // Create catalog AND initial inventory flow
        const res = await axios.post('/inventory/parts', {
          ...payload,
          quantityInStock: initialQty,
          reorderLevel: initialReorder,
          location: initialLocation
        });
        if (res.data.success) {
          setSuccess('Part catalog entry created & inventory provisioned!');
          fetchInventory();
        }
      }
      setShowCatalogModal(false);
      setTimeout(() => setSuccess(''), 3500);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction aborted.');
    }
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.put(`/inventory/${selectedStockRecord._id}`, {
        quantityInStock: qtyInStock,
        reorderLevel: reorderLvl,
        location: stockLocation
      });

      if (res.data.success) {
        setSuccess('Stock count updated.');
        setInventory(prev => prev.map(item => 
          item._id === selectedStockRecord._id ? { ...item, quantityInStock: qtyInStock, reorderLevel: reorderLvl, location: stockLocation } : item
        ));
        setShowStockModal(false);
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Stock adjustment failed.');
    }
  };

  const filteredInventory = inventory.filter(item => {
    const part = item.part || {};
    return (
      part.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Navigation & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        
        {/* Search & Tabs */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search code, part, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2 text-xs"
            />
          </div>
          
          <div className="flex bg-white p-1 border border-slate-200 rounded-lg">
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'stock' ? 'bg-slate-100 text-[#111827]' : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              Stock Status
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'catalog' ? 'bg-slate-100 text-[#111827]' : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              Master Catalog
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'tracking' ? 'bg-slate-100 text-[#111827]' : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              Order Tracking
            </button>
          </div>
        </div>

        <button
          onClick={handleOpenAddPart}
          className="btn-primary flex items-center gap-2 text-xs font-bold py-2.5 px-4 justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Part to Catalog</span>
        </button>
      </div>

      {/* Main Grid display */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No Catalog / Stock entries</p>
            <p className="text-xs text-slate-500 mt-1">Try registering parts or editing filters.</p>
          </div>
        ) : activeTab === 'stock' ? (
          // Stock Status View
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Image</th>
<th className="table-th">Part Details</th>
                  <th className="table-th">Bin Location</th>
                  <th className="table-th">In Stock Qty</th>
                  <th className="table-th">Alert Threshold</th>
                  <th className="table-th">Status</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredInventory.map((item) => {
                  const part = item.part || {};
                  const isLowStock = item.quantityInStock <= item.reorderLevel;
                  
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/10">
                      <td className="table-td">
                        {part.imageUrl ? (
                          <img src={part.imageUrl} alt={part.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 flex items-center justify-center text-slate-500">N/A</div>
                        )}
                      </td>
                      <td className="table-td">
                        <div>
                          <h4 className="font-bold text-[#111827]">{part.name}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">Code: {part.code} | {part.category}</span>
                        </div>
                      </td>
                      <td className="table-td font-semibold text-slate-600">{item.location}</td>
                      <td className="table-td text-[#111827] font-extrabold text-base">{item.quantityInStock}</td>
                      <td className="table-td text-slate-500 font-medium">{item.reorderLevel} units</td>
                      <td className="table-td">
                        {isLowStock ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-50 text-red-600 border border-red-200">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-green-50 text-green-600 border border-green-200">
                            ADEQUATE
                          </span>
                        )}
                      </td>
                      <td className="table-td text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenStockAdjust(item)}
                            className="inline-flex items-center gap-1.5 p-2 bg-white hover:bg-white/80 text-[#111827] border border-slate-300 rounded-lg text-xs transition-colors font-bold"
                            title="Adjust Stock"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Adjust Stock</span>
                          </button>
                          <button
                            onClick={() => handleOpenImageUpload(item.part)}
                            className="inline-flex items-center gap-1.5 p-2 bg-white hover:bg-white/80 text-[#111827] border border-slate-300 rounded-lg text-xs transition-colors font-bold"
                            title="Update Image"
                          >
                            <Image className="w-3.5 h-3.5" />
                            <span>Update Image</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'catalog' ? (
          // Master Catalog View
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Image</th>
                  <th className="table-th">Code</th>
                  <th className="table-th">Part Name</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">Base Price</th>
                  <th className="table-th">Compatibility</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredInventory.map((item) => {
                  const part = item.part || {};
                  return (
                    <tr key={part._id} className="hover:bg-slate-50/10">
                      <td className="table-td">
                        {part.imageUrl ? (
                          <img src={part.imageUrl} alt={part.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 flex items-center justify-center text-slate-500">N/A</div>
                        )}
                      </td>
                      <td className="table-td font-mono font-bold text-[#111827] uppercase">{part.code}</td>
                      <td className="table-td">
                        <div>
                          <h4 className="font-bold text-[#111827]">{part.name}</h4>
                          <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{part.description}</span>
                        </div>
                      </td>
                      <td className="table-td text-slate-600 font-semibold">{part.category}</td>
                      <td className="table-td font-extrabold text-[#111827]">₹{part.basePrice}</td>
                      <td className="table-td text-xs text-slate-500 font-medium">{part.compatibility || 'Universal'}</td>
                      <td className="table-td text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditPart(item)}
                            className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-350 hover:text-[#111827] transition-colors"
                            title="Edit Catalog Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePart(part._id)}
                            className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-350 hover:text-red-600 transition-colors"
                            title="Delete Part"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'tracking' ? (
          <div className="p-6 space-y-6 bg-slate-50 min-h-[400px]">
            {partOrders.length === 0 ? (
              <div className="text-center py-16">
                <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">No Part Orders to Track</p>
                <p className="text-xs text-slate-400 mt-1">When customers place orders, they will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {partOrders.slice().reverse().map(order => (
                  <div key={order.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-[#111827] text-lg">{order.id}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Placed: {new Date(order.date).toLocaleString()}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {order.items?.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-xs font-bold text-slate-600 border border-slate-100">
                            {item.name} <span className="text-slate-400 text-[10px]">x{item.qty}</span>
                          </span>
                        ))}
                      </div>
                      {order.shippingDetails && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Shipping Details</p>
                          <p className="text-xs text-slate-600 font-medium"><strong>Addr:</strong> {order.shippingDetails.address}</p>
                          <p className="text-xs text-slate-600 font-medium"><strong>Phone:</strong> {order.shippingDetails.phone}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <select 
                        value={order.status} 
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-[#111827] outline-none cursor-pointer px-2 py-1"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-colors border border-transparent hover:border-red-100 shadow-sm"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Catalog Entry Form modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-[#111827]">
                {editingPartId ? 'Edit Part catalog Info' : 'Add Part to Database Catalog'}
              </h3>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="text-slate-500 hover:text-[#111827] p-1 rounded-lg bg-slate-100/50 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCatalogSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Part Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="V8 Engine Assembly"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Unique Part Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ENG-V8-X"
                    value={code}
                    disabled={!!editingPartId}
                    onChange={(e) => setCode(e.target.value)}
                    className={`input-field uppercase font-mono ${editingPartId ? 'bg-slate-50 border-dark-800 text-slate-500 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Part Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field cursor-pointer bg-slate-50"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Catalog Base Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value))}
                    className="input-field"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Car Compatibility Listings
                </label>
                <input
                  type="text"
                  placeholder="Toyota Corolla, Honda Civic, universal"
                  value={compatibility}
                  onChange={(e) => setCompatibility(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Catalog Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Insert functional parameters or warranty statements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field resize-none"
                />
              </div>

              {/* Initial stock attributes (Only for Add part) */}
              {!editingPartId && (
                <div className="border-t border-slate-200 pt-4 mt-2 space-y-4">
                  <h4 className="text-xs font-bold text-[#111827] uppercase">Warehouse Provisioning attributes</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Opening Qty
                      </label>
                      <input
                        type="number"
                        value={initialQty}
                        onChange={(e) => setInitialQty(parseInt(e.target.value))}
                        className="input-field"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Low Level Lvl
                      </label>
                      <input
                        type="number"
                        value={initialReorder}
                        onChange={(e) => setInitialReorder(parseInt(e.target.value))}
                        className="input-field"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Shelf Bin
                      </label>
                      <input
                        type="text"
                        placeholder="Aisle A-1"
                        value={initialLocation}
                        onChange={(e) => setInitialLocation(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCatalogModal(false)}
                  className="btn-secondary py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 text-xs font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjust Modal */}
      {showStockModal && selectedStockRecord && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-[#111827]">Warehouse Stock Editor</h3>
                <p className="text-[10px] text-[#111827] mt-0.5">Part: {selectedStockRecord.part?.name}</p>
              </div>
              <button
                onClick={() => setShowStockModal(false)}
                className="text-slate-500 hover:text-[#111827] p-1 rounded-lg bg-slate-100/50 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Quantity In Stock
                </label>
                <input
                  type="number"
                  required
                  value={qtyInStock}
                  onChange={(e) => setQtyInStock(parseInt(e.target.value))}
                  className="input-field text-lg font-bold"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Low Stock Reorder Limit
                </label>
                <input
                  type="number"
                  required
                  value={reorderLvl}
                  onChange={(e) => setReorderLvl(parseInt(e.target.value))}
                  className="input-field"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Warehouse Location Bin
                </label>
                <input
                  type="text"
                  required
                  placeholder="Shelf B-1"
                  value={stockLocation}
                  onChange={(e) => setStockLocation(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowStockModal(false)}
                  className="btn-secondary py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 text-xs font-bold"
                >
                  Confirm Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Image Modal */}
      {showImageModal && selectedPartForImage && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-[#111827]">Update Part Image</h3>
                <p className="text-[10px] text-[#111827] mt-0.5">Part: {selectedPartForImage.name} ({selectedPartForImage.code})</p>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-slate-500 hover:text-[#111827] p-1 rounded-lg bg-slate-100/50 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImageSubmit} className="p-6 space-y-4">
              <div 
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-neon-purple bg-neon-purple/5' 
                    : 'border-slate-300 hover:border-dark-500 bg-slate-50/50'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="image-file-input"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto border border-slate-300 shadow-md"
                    />
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Selected: {imageFile ? imageFile.name : 'Current Image'}</p>
                      <label 
                        htmlFor="image-file-input" 
                        className="inline-block mt-2 text-xs text-[#111827] hover:underline cursor-pointer font-semibold"
                      >
                        Choose another image
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-500">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-xs text-slate-500">
                      <label 
                        htmlFor="image-file-input" 
                        className="text-[#111827] hover:underline cursor-pointer font-bold"
                      >
                        Click to browse
                      </label>
                      {' '}or drag & drop your image here
                    </div>
                    <p className="text-[10px] text-slate-500">Supports PNG, JPG, JPEG or WEBP</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="btn-secondary py-2 text-xs"
                  disabled={uploadingImage}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 text-xs font-bold"
                  disabled={uploadingImage || !imageFile}
                >
                  {uploadingImage ? 'Uploading...' : 'Save Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
