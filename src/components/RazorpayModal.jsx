import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, X, CreditCard, Smartphone, Building2, HelpCircle, Code } from 'lucide-react';

export default function RazorpayModal({
  isOpen,
  onClose,
  onSuccess,
  totalAmount,
  customerData,
  itemsCount
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDevNotes, setShowDevNotes] = useState(false);

  if (!isOpen) return null;

  const handleSimulateSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const mockPaymentDetails = {
        razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 12)}`,
        razorpay_order_id: `order_${Math.random().toString(36).substring(2, 14)}`,
        razorpay_signature: `sig_${Math.random().toString(36).substring(2, 20)}`,
        method: selectedMethod
      };
      onSuccess(mockPaymentDetails);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header - Branded like Razorpay / Prakriti */}
        <div className="bg-[#0C2340] text-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                ₹
              </div>
              <div>
                <h3 className="font-semibold text-base leading-tight">Razorpay Secure Checkout</h3>
                <p className="text-xs text-blue-200">ShreeKrishna Organics Pvt Ltd</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-900/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-200 uppercase tracking-wider block">Total Payable</span>
              <span className="text-2xl font-bold font-sans">₹{totalAmount}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-blue-200 block">{itemsCount} Items</span>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 justify-end">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Selection */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Select Payment Method (Demo Simulation)
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                selectedMethod === 'upi'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20'
                  : 'border-stone-200 hover:border-stone-300 text-stone-700'
              }`}
            >
              <Smartphone className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-semibold">UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                selectedMethod === 'card'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20'
                  : 'border-stone-200 hover:border-stone-300 text-stone-700'
              }`}
            >
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-semibold">Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                selectedMethod === 'netbanking'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20'
                  : 'border-stone-200 hover:border-stone-300 text-stone-700'
              }`}
            >
              <Building2 className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-semibold">NetBanking</span>
            </button>
          </div>

          {/* Form preview depending on method */}
          {selectedMethod === 'upi' && (
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
              <label className="font-medium text-stone-700 block">Virtual Payment Address (VPA / UPI ID)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-white px-3 py-2 rounded-lg border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="flex gap-2 pt-1 text-[11px] text-stone-500">
                <span className="px-2 py-0.5 bg-white rounded border border-stone-200">Google Pay</span>
                <span className="px-2 py-0.5 bg-white rounded border border-stone-200">PhonePe</span>
                <span className="px-2 py-0.5 bg-white rounded border border-stone-200">Paytm</span>
              </div>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between items-center text-stone-600">
                <span>Demo Card Mode:</span>
                <span className="font-mono text-[11px] font-semibold text-emerald-700">4111 •••• •••• 1111</span>
              </div>
              <p className="text-[11px] text-stone-500">No real card will be charged. This simulates successful card authentication.</p>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
              <p className="text-stone-600">Popular Banks: HDFC, ICICI, SBI, Axis Bank, Kotak Mahindra</p>
            </div>
          )}

          {/* Primary Action */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSimulateSuccess}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Simulating Bank Authorization...</span>
              </div>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate Successful Payment (₹{totalAmount})</span>
              </>
            )}
          </button>

          {/* Spring Boot Backend Developer Accordion */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDevNotes(!showDevNotes)}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-medium"
            >
              <Code className="w-3.5 h-3.5 text-amber-600" />
              <span>{showDevNotes ? 'Hide Spring Boot Integration Notes' : 'How this connects to Java Spring Boot REST API'}</span>
            </button>

            {showDevNotes && (
              <div className="mt-2.5 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-2 font-mono leading-relaxed">
                <p className="font-sans font-bold text-amber-900">Backend Flow (Spring Boot + Razorpay Java SDK):</p>
                <ol className="list-decimal list-inside space-y-1 font-sans text-[11px] text-amber-900/90">
                  <li><strong>POST /api/payment/create-order:</strong> Backend initializes order with RazorpayClient and returns <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">order_id</code>.</li>
                  <li><strong>Checkout:</strong> Frontend passes returned <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">order_id</code> to Razorpay SDK.</li>
                  <li><strong>POST /api/payment/verify:</strong> Backend verifies HMAC SHA256 signature using Razorpay secret and marks order as <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">PAID</code>.</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <span>Demo Payment Mode</span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 font-medium underline"
          >
            Cancel & Return
          </button>
        </div>
      </div>
    </div>
  );
}
