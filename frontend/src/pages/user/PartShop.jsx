import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  IndianRupee,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
  X,
  Package,
  Car,
  Info,
  Truck
} from 'lucide-react';

const CATEGORIES = ['All', 'Engine', 'Battery', 'Brake Pad', 'Air Filter', 'Tire', 'Headlight', 'Radiator', 'Spark Plug', 'Fuel Injector', 'Alternator', 'Clutch Plate', 'Suspension'];

const PartShop = () => {
  const { user } = useAuth();
  const [parts, setParts] = useState([]);
  const [inventory, setInventory] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);
  
  // Tracking & Shipping state
  const [showTracking, setShowTracking] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, vehiclesRes] = await Promise.all([
        axios.get('/inventory/shop/parts'),
        axios.get('/vehicles/my')
      ]);

      if (inventoryRes.data.success) {
        const invMap = {};
        const availableParts = [];
        
        inventoryRes.data.data.forEach(inv => {
          if (inv.part?._id) {
            invMap[inv.part._id] = inv;
            availableParts.push(inv.part);
          }
        });
        
        setInventory(invMap);
        setParts(availableParts);
      }
      
      if (vehiclesRes.data.success) {
        setVehicles(vehiclesRes.data.data);
      }
    } catch (err) {
      console.error('Error loading shop data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = parts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.compatibility?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStockInfo = (partId) => {
    const inv = inventory[partId];
    if (!inv) return { qty: 0, status: 'Unknown' };
    if (inv.quantityInStock <= 0) return { qty: 0, status: 'Out of Stock' };
    if (inv.quantityInStock <= inv.reorderLevel) return { qty: inv.quantityInStock, status: 'Low Stock' };
    return { qty: inv.quantityInStock, status: 'In Stock' };
  };

  const isCompatible = (compatibility) => {
    if (!compatibility || vehicles.length === 0) return null;
    const compatLower = compatibility.toLowerCase();
    for (const v of vehicles) {
      const makeModel = `${v.make} ${v.model}`.toLowerCase();
      if (compatLower.includes(v.make.toLowerCase()) || compatLower.includes(v.model.toLowerCase()) || compatLower.includes('universal')) {
        return true;
      }
    }
    return false;
  };

  const addToCart = (part) => {
    setCart(prev => {
      const existing = prev.find(c => c._id === part._id);
      if (existing) return prev.map(c => c._id === part._id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...part, qty: 1 }];
    });
    setShowCart(true);
    setTimeout(() => setShowCart(false), 1500);
  };

  const removeFromCart = (partId) => setCart(prev => prev.filter(c => c._id !== partId));

  const updateCartQty = (partId, delta) => {
    setCart(prev => prev.map(c => {
      if (c._id === partId) {
        const newQty = c.qty + delta;
        return newQty > 0 ? { ...c, qty: newQty } : c;
      }
      return c;
    }));
  };

  const cartTotal = cart.reduce((sum, c) => sum + Math.round(c.basePrice) * c.qty, 0);

  const handleOrder = async () => {
    if (!shippingAddress.trim() || !shippingPhone.trim()) {
      alert("Please provide shipping address and phone number");
      return;
    }
    
    try {
      const orderItems = cart.map(item => ({
        _id: item._id,
        name: item.name,
        qty: item.qty,
        basePrice: item.basePrice
      }));

      const res = await axios.post('/orders', {
        items: orderItems,
        totalAmount: cartTotal,
        shippingDetails: {
          address: shippingAddress,
          phone: shippingPhone
        }
      });
      if (res.data.success) {
        setCart([]);
        setShowCart(false);
        setOrderSuccess(`🎉 Order placed successfully! Your Tracking ID is ${res.data.data.orderId}. Keep it safe to track your order.`);
        setTimeout(() => setOrderSuccess(''), 10000);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to place order');
      console.error(err);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get('/orders/user/my-orders');
      if (res.data.success) {
        const formatted = res.data.data.map(o => ({
          id: o.orderId,
          status: o.status,
          date: o.createdAt,
          items: o.items
        }));
        setMyOrders(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF3B30]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#111827] flex items-center gap-3 tracking-tight">
            <ShoppingBag className="w-8 h-8 text-[#FF3B30]" />
            Parts Marketplace
          </h1>
          <p className="text-gray-500 font-medium mt-2">Genuine OEM and performance automotive parts.</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <button onClick={() => { fetchMyOrders(); setShowTracking(true); }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-[#111827] hover:bg-gray-50 shadow-sm transition-all font-bold text-xs uppercase tracking-widest">
            <Truck className="w-4 h-4" />
            My Orders
          </button>
          {/* Cart Icon Button */}
          <button onClick={() => setShowCart(true)} className="relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#111827] border border-[#111827] text-white hover:bg-[#FF3B30] hover:border-[#FF3B30] shadow-md transition-all">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-[#111827] text-[10px] font-black flex items-center justify-center shadow-md border-2 border-[#111827]">
                {cart.reduce((s, c) => s + c.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {orderSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 text-sm rounded-r-xl flex items-center gap-3 shadow-sm font-bold"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
            <span>{orderSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle Compatibility Notice */}
      {vehicles.length > 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3 text-xs text-gray-700 shadow-sm font-medium">
          <Info className="w-5 h-5 text-[#FF3B30] flex-shrink-0" />
          <span>Showing compatibility with your vehicles: <strong className="text-[#111827] font-black">{vehicles.map(v => `${v.make} ${v.model}`).join(', ')}</strong>.</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search parts, brands, or vehicle compatibility..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide py-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#111827] text-white shadow-md border-2 border-[#111827]'
                    : 'bg-white border-2 border-gray-200 text-gray-500 hover:text-[#111827] hover:border-gray-300 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Parts Grid */}
      {filteredParts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-[#111827]">No parts found</h3>
          <p className="text-sm font-medium text-gray-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredParts.map(part => {
            const stock = getStockInfo(part._id);
            const compat = isCompatible(part.compatibility);
            const priceINR = Math.round(part.basePrice);
            const isOutOfStock = stock.status === 'Out of Stock';

            return (
              <div key={part._id} className={`bg-white rounded-2xl overflow-hidden flex flex-col group border ${compat === true ? 'border-[#FF3B30] shadow-[0_4px_20px_rgba(255,59,48,0.15)]' : 'border-gray-200 shadow-sm hover:shadow-md transition-shadow'}`}>
                {/* Product Image */}
                <div className="relative h-52 bg-gray-50 overflow-hidden border-b border-gray-100">
                  {part.imageUrl ? (
                    <img
                      src={part.imageUrl}
                      alt={part.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {compat === true && (
                      <span className="px-3 py-1.5 rounded-lg bg-[#FF3B30] text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                        <Car className="w-3.5 h-3.5" /> Fits Vehicle
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md border ${
                      stock.status === 'In Stock' ? 'bg-green-50 text-green-700 border-green-200' :
                      stock.status === 'Low Stock' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {stock.status}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1 p-6 gap-3">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{part.category}</span>
                    <h3 className="text-base font-black text-[#111827] mt-1 line-clamp-2 leading-snug group-hover:text-[#FF3B30] transition-colors">{part.name}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-2 line-clamp-2 leading-relaxed">{part.description}</p>
                  </div>

                  {/* Compatibility text */}
                  {part.compatibility && (
                    <p className="text-[11px] text-gray-500 border-t border-gray-100 pt-3 mt-auto font-medium">
                      <span className="font-black text-[#111827] uppercase tracking-widest text-[10px]">Fits: </span>{part.compatibility}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                    <div className="flex items-center gap-0.5">
                      <IndianRupee className="w-5 h-5 text-[#111827] font-black" />
                      <span className="text-xl font-black text-[#111827]">{priceINR.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPart(part)}
                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-[#111827] transition-colors border border-gray-200"
                        title="View Details"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => !isOutOfStock && addToCart(part)}
                        disabled={isOutOfStock}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                          isOutOfStock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            : 'bg-[#111827] text-white hover:bg-[#FF3B30] shadow-md border border-[#111827]'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {isOutOfStock ? 'Sold' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Part Detail Modal */}
      <AnimatePresence>
        {selectedPart && (
          <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="relative h-64 bg-gray-50 flex items-center justify-center p-8 border-b border-gray-100">
                {selectedPart.imageUrl ? (
                  <img src={selectedPart.imageUrl} alt={selectedPart.name} className="max-h-full object-contain mix-blend-multiply" />
                ) : (
                  <Package className="w-20 h-20 text-gray-300" />
                )}
                <button onClick={() => setSelectedPart(null)} className="absolute top-4 right-4 p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#111827] transition-colors shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedPart.category}</span>
                  <h2 className="text-2xl font-black text-[#111827] mt-1 leading-snug">{selectedPart.name}</h2>
                  <p className="text-sm text-gray-600 font-medium mt-3 leading-relaxed">{selectedPart.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Part Code</p>
                    <p className="text-[#111827] font-black font-mono mt-1 text-base">{selectedPart.code}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Price</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      <IndianRupee className="w-4 h-4 text-[#FF3B30] font-black" />
                      <p className="text-[#111827] font-black text-xl">{Math.round(selectedPart.basePrice).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
                {selectedPart.compatibility && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-1.5">Vehicle Compatibility</p>
                    <p className="text-[#111827] font-bold">{selectedPart.compatibility}</p>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setSelectedPart(null)} className="flex-1 py-4 rounded-xl bg-white border-2 border-gray-200 text-[#111827] text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
                    Close
                  </button>
                  <button
                    onClick={() => { addToCart(selectedPart); setSelectedPart(null); }}
                    disabled={getStockInfo(selectedPart._id).status === 'Out of Stock'}
                    className="flex-1 bg-[#111827] hover:bg-[#FF3B30] text-white py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tracking Modal */}
      {showTracking && (
        <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-lg text-[#111827] flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#FF3B30]" />
                Track Your Order
              </h3>
              <button onClick={() => { setShowTracking(false); setTrackingResult(null); setTrackingId(''); }} className="text-gray-400 hover:text-[#111827] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {myOrders.length === 0 ? (
                  <p className="text-sm font-medium text-gray-500 text-center py-8">No orders found.</p>
                ) : (
                  myOrders.map(order => (
                    <div key={order.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-4">
                      <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Order ID: {order.id}</span>
                          <span className="text-xs font-bold text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'Processing' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          order.status === 'Delivered' ? 'bg-green-50 text-green-600 border border-green-100' :
                          'bg-gray-50 text-gray-600 border border-gray-100'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Order Items</span>
                        {order.items?.map(item => (
                          <div key={item._id} className="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <span className="text-base font-black text-[#111827]">{item.name}</span>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">Qty: {item.qty}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-sm flex justify-end z-50 font-sans" onClick={() => setShowCart(false)}>
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white border-l border-gray-200 w-full max-w-md h-full flex flex-col shadow-2xl" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="font-black text-2xl text-[#111827] flex items-center gap-3 tracking-tight">
                  <ShoppingCart className="w-7 h-7 text-[#FF3B30]" />
                  Your Cart
                </h2>
                <button onClick={() => setShowCart(false)} className="p-2.5 rounded-xl text-gray-500 hover:text-[#111827] hover:bg-white border border-transparent hover:border-gray-200 transition-all bg-white shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 border border-gray-200 shadow-sm">
                    <ShoppingCart className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-[#111827] font-black text-2xl tracking-tight">Cart is empty</p>
                  <p className="text-sm font-medium text-gray-500 mt-2 max-w-[250px]">Browse the catalog and add parts to order</p>
                  <button onClick={() => setShowCart(false)} className="mt-8 bg-[#111827] text-white hover:bg-[#FF3B30] text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-colors shadow-md">Browse Parts</button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                    {cart.map(c => (
                      <div key={c._id} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-2">
                          {c.imageUrl ? (
                            <img src={c.imageUrl} alt={c.name} className="w-full h-full object-contain mix-blend-multiply" />
                          ) : (
                            <Package className="w-8 h-8 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="text-sm font-black text-[#111827] truncate">{c.name}</h4>
                          <div className="flex items-center gap-0.5 mt-2">
                            <IndianRupee className="w-4 h-4 text-[#FF3B30] font-black" />
                            <span className="text-lg font-black text-[#111827]">{Math.round(c.basePrice).toLocaleString('en-IN')}</span>
                            <div className="flex items-center gap-2 ml-4 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                              <button onClick={() => updateCartQty(c._id, -1)} className="w-6 h-6 flex items-center justify-center text-[#111827] font-black hover:bg-white rounded-md transition-colors shadow-sm">-</button>
                              <span className="text-xs font-bold w-4 text-center">{c.qty}</span>
                              <button onClick={() => updateCartQty(c._id, 1)} className="w-6 h-6 flex items-center justify-center text-[#111827] font-black hover:bg-white rounded-md transition-colors shadow-sm">+</button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(c._id)} className="text-gray-400 hover:text-red-600 p-2.5 transition-colors flex-shrink-0 self-start bg-gray-50 border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-xl shadow-sm">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 p-6 bg-white space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Shipping Address</label>
                        <textarea
                          rows={2}
                          value={shippingAddress}
                          onChange={e => setShippingAddress(e.target.value)}
                          placeholder="Enter your delivery address"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all font-bold text-sm resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={shippingPhone}
                          onChange={e => setShippingPhone(e.target.value)}
                          placeholder="Enter phone number"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all font-bold text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <span className="text-gray-500 font-black text-xs uppercase tracking-widest">Total Amount</span>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-6 h-6 text-[#FF3B30] font-black" />
                        <span className="text-3xl font-black text-[#111827]">{cartTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <button onClick={handleOrder} className="w-full py-4 bg-[#111827] hover:bg-[#FF3B30] text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-gray-200 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Place Order
                    </button>
                    <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-widest">Our team will confirm availability within 24h</p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PartShop;
