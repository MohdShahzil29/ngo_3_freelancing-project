import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    document.title = "Events || Emergent";
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-12" data-testid="events-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-stone-900 mb-4">
            आयोजन
          </h1>
          <p className="text-stone-600 text-base max-w-2xl mx-auto">
            हमारे आगामी कार्यक्रमों में शामिल हों
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-600">कोई आगामी कार्यक्रम नहीं है।</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-200"
                data-testid={`event-${index}`}
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-2xl text-stone-900 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-stone-600 mb-4">{event.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-stone-600">
                      <Calendar size={18} />
                      <span>{format(new Date(event.event_date), "PPP")}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-stone-600">
                      <MapPin size={18} />
                      <span>{event.location}</span>
                    </div>
                    {event.max_participants && (
                      <div className="flex items-center space-x-2 text-stone-600">
                        <Users size={18} />
                        <span>
                          {event.registered_count} / {event.max_participants}{" "}
                          registered
                        </span>
                      </div>
                    )}
                  </div>

                  {event.is_paid && (
                    <p className="mt-4 font-semibold text-primary">
                      Registration Fee: ₹{event.registration_fee}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
