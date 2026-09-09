import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  Calendar, 
  CreditCard, 
  Download, 
  MapPin, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await orderService.getUserOrders();
        setOrders(data);
        if (data.length > 0) {
          setExpandedOrderId(data[0].id); // Expand most recent order by default
        }
      } catch (err) {
        console.error("Error loading order history", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleDownloadInvoice = (orderId) => {
    addToast(`Downloading Tax Invoice for #${orderId}...`, 'info');
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  if (loading) {
    return <LoadingSpinner text="Fetching your order history..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-[#FAF6EF] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white border border-[#E8DFD3] flex items-center justify-center text-stone-400 mb-6 shadow-subtle">
          <Package className="w-10 h-10 text-[#2B241D]/40" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B241D]">
          No Previous Orders Found
        </h2>
        <p className="text-sm text-stone-500 max-w-md mt-2 mb-8 font-sans">
          You haven't placed any orders with Shrikrishna Organics yet. Try our unrefined wood-pressed oils and organic essentials today.
        </p>
        <Button to="/shop" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
          Explore Our Products
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-wider font-bold text-[#B5563C] block mb-1">
            Customer Dashboard
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#2B241D]">
            My Orders & Tracking
          </h1>
          <p className="text-xs text-stone-500 font-sans mt-1">
            View live status updates, delivery courier tracking, and order receipts.
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#E8DFD3] shadow-subtle overflow-hidden transition-all"
              >
                
                {/* Order Summary Bar Header */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-6 bg-[#FAF6EF]/50 hover:bg-[#FAF6EF] border-b border-[#E8DFD3] cursor-pointer transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DFD3] flex items-center justify-center text-[#2B241D] shrink-0">
                        <Package className="w-6 h-6 text-[#B5563C]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-base text-stone-900">
                            Order #{order.id}
                          </h3>
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                : 'bg-amber-100 text-amber-900 border border-amber-200'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-stone-400" /> Placed on {order.createdAtFormatted || order.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Order Total</span>
                        <span className="text-lg font-bold font-sans text-[#2B241D]">
                          ₹{order.totalAmount}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-white border border-[#E8DFD3] text-stone-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#B5563C]" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Expanded Order Content */}
                {isExpanded && (
                  <div className="p-6 sm:p-8 space-y-8 animate-in fade-in">
                    
                    {/* Live Delivery Progress Tracker */}
                    {order.tracking && (
                      <div className="bg-[#FAF6EF] p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-[#2B241D] uppercase tracking-wider flex items-center gap-1.5">
                              <Truck className="w-4 h-4 text-[#B5563C]" /> Live Dispatch Status
                            </span>
                            <p className="text-xs text-stone-600 mt-0.5">
                              Courier: <strong>{order.tracking.courier}</strong> (AWB: <code className="font-mono text-stone-800">{order.tracking.trackingNumber}</code>)
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-stone-700 bg-white px-3 py-1 rounded-lg border border-[#E8DFD3]">
                            {order.tracking.estimatedDelivery}
                          </span>
                        </div>

                        {/* Step Progress Line */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E8DFD3]">
                          {order.tracking.timeline.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                                step.completed
                                  ? 'bg-[#B5563C] text-white'
                                  : 'bg-stone-200 text-stone-500'
                              }`}>
                                {step.completed ? '✓' : idx + 1}
                              </div>
                              <div>
                                <h5 className={`text-xs font-bold ${step.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                                  {step.title}
                                </h5>
                                <p className="text-[10px] text-stone-500">{step.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ordered Items List */}
                    <div>
                      <h4 className="font-serif font-bold text-base text-stone-900 mb-3">
                        Items in this shipment ({order.items.length})
                      </h4>

                      <div className="divide-y divide-[#E8DFD3] border border-[#E8DFD3] rounded-2xl overflow-hidden bg-white">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="p-4 flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-xl object-cover border border-[#E8DFD3] shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                                {item.name}
                              </h5>
                              <p className="text-xs text-stone-500 mt-0.5">
                                Size: <strong>{item.size}</strong> • Qty: <strong>{item.quantity}</strong>
                              </p>
                            </div>
                            <span className="text-xs sm:text-sm font-bold font-sans text-[#2B241D]">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address & Payment Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      
                      {/* Address */}
                      <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#E8DFD3] space-y-1.5 text-xs text-stone-600">
                        <span className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-[#B5563C]" /> Delivery Address
                        </span>
                        <p className="font-semibold text-stone-800">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p>Phone: {order.shippingAddress.phone}</p>
                      </div>

                      {/* Payment Details */}
                      <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#E8DFD3] space-y-1.5 text-xs text-stone-600">
                        <span className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                          <CreditCard className="w-3.5 h-3.5 text-[#B5563C]" /> Payment & Billing
                        </span>
                        <p>Method: <strong className="text-stone-800">{order.paymentMethod}</strong></p>
                        <p>Status: <strong className="text-emerald-800">{order.paymentStatus}</strong></p>
                        <p>Subtotal: ₹{order.subtotal} | Shipping: {order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}</p>
                        
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B5563C] hover:text-[#9E442B] cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Tax Invoice (PDF)
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
