import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/enquiries`, formData);
      toast.success("आपका संदेश भेज दिया गया है!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Contact Us || Emergent";
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-12" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-stone-900 mb-4">
            संपर्क करें
          </h1>
          <p className="text-stone-600 text-base max-w-2xl mx-auto">
            हमसे जुड़ें, हम आपकी मदद करने के लिए हमेशा तैयार हैं
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
            <h2 className="font-heading font-semibold text-2xl text-stone-900 mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-stone-700">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2"
                  data-testid="contact-name-input"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-stone-700">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2"
                  data-testid="contact-email-input"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-stone-700">
                  Phone *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-2"
                  data-testid="contact-phone-input"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-stone-700">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-2"
                  data-testid="contact-message-input"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90"
                data-testid="contact-submit-button"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl text-stone-900 mb-2">
                    फोन
                  </h3>
                  <p className="text-stone-600">78776 43155</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl text-stone-900 mb-2">
                    Email
                  </h3>
                  <p className="text-stone-600">
                    nvpwfoundationindia@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl text-stone-900 mb-2">
                    पता
                  </h3>
                  <p className="text-stone-600">
                    नारायण निवास, बजरंग नगर, मोड़ा बालाजी रोड, दौसा, राजस्थान –
                    303303
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
