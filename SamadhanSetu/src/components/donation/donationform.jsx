import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Heart, 
  CreditCard, 
  Smartphone, 
  Wallet,
  University,
  Shield,
  CheckCircle,
  IndianRupee,
  X,
  RefreshCw,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay using UPI apps like GPay, PhonePe, Paytm' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Secure card payments' },
  { id: 'netbanking', name: 'Net Banking', icon: University, description: 'Direct bank transfer' },
  { id: 'wallet', name: 'Digital Wallet', icon: Wallet, description: 'Paytm, Mobikwik, etc.' }
];

const presetAmounts = [100, 500, 1000, 2500, 5000, 10000];

export default function DonationForm({ cause, user, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: '',
    donor_name: user?.full_name || '',
    donor_email: user?.email || '',
    donor_phone: user?.phone_number || '',
    anonymous: false,
    is_recurring: false,
    recurring_frequency: 'monthly',
    notes: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.amount || !formData.payment_method) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseInt(formData.amount) < 10) {
      setError('Minimum donation amount is ₹10');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const donationData = {
        ...formData,
        amount: parseInt(formData.amount),
        cause_type: cause.cause_type,
        cause_id: cause.id,
        cause_name: cause.name,
        transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'completed'
      };
      
      await onSuccess(donationData);
      setStep(3);
    } catch (error) {
      setError('Payment failed. Please try again.');
    }
    
    setIsProcessing(false);
  };

  const PaymentMethodCard = ({ method, selected, onSelect }) => {
    const Icon = method.icon;
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(method.id)}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
          selected 
            ? 'border-red-500 bg-red-50 shadow-lg' 
            : 'border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            selected ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{method.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{method.description}</p>
          </div>
          {selected && <CheckCircle className="w-5 h-5 text-red-500" />}
        </div>
      </motion.div>
    );
  };

  if (step === 3) {
    return (
      <Card className="bg-white shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Thank You!</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Your donation of ₹{formData.amount} to {cause.name} has been successfully processed.
          </p>
          
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-800 font-medium">
              📧 A receipt has been sent to {formData.donor_email}
            </p>
            <p className="text-sm text-green-700 mt-1">
              🧾 Tax exemption certificate will be provided if applicable
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Close
            </Button>
            <Button onClick={() => window.print()} className="flex-1 bg-green-600 hover:bg-green-700">
              Download Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Donate to {cause.name}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Donation Amount *</Label>
            <div className="grid grid-cols-3 gap-3">
              {presetAmounts.map(amount => (
                <Button
                  key={amount}
                  type="button"
                  variant={formData.amount === amount.toString() ? "default" : "outline"}
                  onClick={() => handleAmountSelect(amount)}
                  className={formData.amount === amount.toString() ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  ₹{amount.toLocaleString()}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-slate-400" />
              <Input
                placeholder="Enter custom amount"
                type="number"
                min="10"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>

          {/* Donor Information */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Your Information</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="donor_name">Full Name *</Label>
                <Input
                  id="donor_name"
                  value={formData.donor_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, donor_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="donor_phone">Phone Number</Label>
                <Input
                  id="donor_phone"
                  value={formData.donor_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, donor_phone: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="donor_email">Email Address *</Label>
              <Input
                id="donor_email"
                type="email"
                value={formData.donor_email}
                onChange={(e) => setFormData(prev => ({ ...prev, donor_email: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Payment Method *</Label>
            <div className="grid md:grid-cols-2 gap-3">
              {paymentMethods.map(method => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  selected={formData.payment_method === method.id}
                  onSelect={(id) => setFormData(prev => ({ ...prev, payment_method: id }))}
                />
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={formData.is_recurring}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_recurring: checked }))}
              />
              <Label htmlFor="recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Make this a recurring donation
              </Label>
            </div>

            {formData.is_recurring && (
              <Select
                value={formData.recurring_frequency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, recurring_frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.anonymous}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: checked }))}
              />
              <Label htmlFor="anonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Donate anonymously
              </Label>
            </div>

            <div>
              <Label htmlFor="notes">Optional Message</Label>
              <Textarea
                id="notes"
                placeholder="Add a personal message or note..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="h-20"
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Lock className="w-4 h-4" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <p className="text-xs text-blue-700">
              Your payment is processed securely through encrypted channels. We never store your payment information.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isProcessing || !formData.amount || !formData.payment_method}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 shadow-lg"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Donate ₹{formData.amount || 0}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
