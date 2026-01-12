import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Shield, FileText } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_key';

const Donate = () => {
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount: '',
    purpose: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API}/donations/create-order`, formData);
      const { order_id, amount, currency, donation_id } = response.data;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        order_id: order_id,
        name: 'Star Marketing NGO',
        description: formData.purpose || 'General Donation',
        handler: async function (response) {
          try {
            await axios.post(`${API}/donations/verify-payment`, {
              order_id: order_id,
              payment_id: response.razorpay_payment_id
            });
            toast.success('Donation successful! Receipt sent to your email.');
            setFormData({
              donor_name: '',
              donor_email: '',
              donor_phone: '',
              amount: '',
              purpose: ''
            });
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.donor_name,
          email: formData.donor_email,
          contact: formData.donor_phone
        },
        theme: {
          color: '#0F766E'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2500, 5000];

  return (
    <div className="min-h-screen bg-stone-50 py-12" data-testid="donate-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-stone-900 mb-4">
            दान करें
          </h1>
          <p className="text-stone-600 text-base max-w-2xl mx-auto">
            आपका योगदान किसी की जिंदगी बदल सकता है। 80G टैक्स छूट के लिए पात्र।
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
            <h2 className="font-heading font-semibold text-2xl text-stone-900 mb-6">
              Donation Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="donor_name" className="text-stone-700">Full Name *</Label>
                <Input
                  id="donor_name"
                  name="donor_name"
                  type="text"
                  value={formData.donor_name}
                  onChange={handleChange}
                  required
                  className="mt-2"
                  data-testid="donor-name-input"
                />
              </div>

              <div>
                <Label htmlFor="donor_email" className="text-stone-700">Email *</Label>
                <Input
                  id="donor_email"
                  name="donor_email"
                  type="email"
                  value={formData.donor_email}
                  onChange={handleChange}
                  required
                  className="mt-2"
                  data-testid="donor-email-input"
                />
              </div>

              <div>
                <Label htmlFor="donor_phone" className="text-stone-700">Phone Number *</Label>
                <Input
                  id="donor_phone"
                  name="donor_phone"
                  type="tel"
                  value={formData.donor_phone}
                  onChange={handleChange}
                  required
                  className="mt-2"
                  data-testid="donor-phone-input"
                />
              </div>

              <div>
                <Label className="text-stone-700 mb-3 block">Amount (₹) *</Label>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {quickAmounts.map((amt) => (
                    <Button
                      key={amt}
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, amount: amt.toString() })}
                      className={formData.amount === amt.toString() ? 'border-primary bg-primary/5' : ''}
                      data-testid={`quick-amount-${amt}`}
                    >
                      ₹{amt}
                    </Button>
                  ))}
                </div>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="100"
                  placeholder="Enter custom amount"
                  data-testid="donor-amount-input"
                />
              </div>

              <div>
                <Label htmlFor="purpose" className="text-stone-700">Purpose (Optional)</Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows={3}
                  className="mt-2"
                  placeholder="What would you like to support?"
                  data-testid="donor-purpose-input"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary/90 text-base py-6"
                data-testid="donate-submit-button"
              >
                {loading ? 'Processing...' : `Donate ₹${formData.amount || '0'}`}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl text-stone-900 mb-2">
                    सुरक्षित भुगतान
                  </h3>
                  <p className="text-stone-600">
                    Razorpay के माध्यम से 100% सुरक्षित भुगतान। सभी प्रमुख भुगतान विधियां स्वीकृत।
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl text-stone-900 mb-2">
                    80G टैक्स छूट
                  </h3>
                  <p className="text-stone-600">
                    आपके दान पर 80G टैक्स लाभ। रसीद तुरंत ईमेल पर भेजी जाएगी।
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl text-stone-900 mb-2">
                    पारदर्शिता
                  </h3>
                  <p className="text-stone-600">
                    आपके दान का पूरा रिकॉर्ड और उपयोग की जानकारी डैशबोर्ड पर उपलब्ध।
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white rounded-xl shadow-lg p-8">
              <h3 className="font-heading font-semibold text-xl mb-4">
                आपका दान किस प्रकार मदद करता है?
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-secondary text-xl">•</span>
                  <span>₹500 - एक बच्चे की एक महीने की पुस्तकें</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-secondary text-xl">•</span>
                  <span>₹1000 - एक परिवार के लिए पौष्टिक भोजन</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-secondary text-xl">•</span>
                  <span>₹2500 - एक मरीज की दवाइयां</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-secondary text-xl">•</span>
                  <span>₹5000 - एक महिला का कौशल प्रशिक्षण</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;