import { useEffect, useState } from "react";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API}/campaigns`);
      setCampaigns(response.data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };

  useEffect(() => {
    document.title = "Campaigns || Emergent";
  }, []);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${BACKEND_URL}${url}`;
  };

  return (
    <div
      className="min-h-screen bg-stone-50 py-12"
      data-testid="campaigns-page"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-stone-900 mb-4">
            सक्रिय अभियान
          </h1>
          <p className="text-stone-600 text-base max-w-2xl mx-auto">
            चल रहे अभियानों में योगदान दें
          </p>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-600">
              कोई सक्रिय अभियान नहीं है। जल्द ही नए अभियान शुरू होंगे।
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-200"
                data-testid={`campaign-${index}`}
              >
                {campaign.image_url && (
                  <img
                    // src={campaign.image_url}
                    src={getImageUrl(campaign.image_url)}
                    alt={campaign.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-xl text-stone-900 mb-2">
                    {campaign.title}
                  </h3>
                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                    {campaign.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-stone-600">Raised</span>
                      <span className="font-semibold text-stone-900">
                        ₹{campaign.current_amount.toLocaleString()} / ₹
                        {campaign.goal_amount.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (campaign.current_amount / campaign.goal_amount) * 100
                      }
                      className="h-2"
                    />
                  </div>

                  <p className="text-sm text-stone-500">
                    {Math.round(
                      (campaign.current_amount / campaign.goal_amount) * 100,
                    )}
                    % completed
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
