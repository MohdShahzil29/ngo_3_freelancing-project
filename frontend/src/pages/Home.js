import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Users, HandHeart, TrendingUp, ArrowRight, CheckCircle, Newspaper, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [stats, setStats] = useState({
    total_members: 0,
    total_donations: 0,
    total_amount: 0,
    total_beneficiaries: 0,
    total_campaigns: 0
  });
  const [news, setNews] = useState([]);
  const [activities, setActivities] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchNews();
    fetchActivities();
    fetchCampaigns();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API}/news`);
      setNews(response.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API}/activities`);
      setActivities(response.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API}/campaigns`);
      setCampaigns(response.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      <section
        className="relative h-[600px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 118, 110, 0.9) 0%, rgba(15, 118, 110, 0.4) 100%), url('https://images.unsplash.com/photo-1569173675610-42c361a86e37?crop=entropy&cs=srgb&fm=jpg&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mb-6"
          >
            एक बेहतर कल का निर्माण करें
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            NVP Welfare Foundation India के साथ जुड़ें और समाज के विकास में योगदान दें। शिक्षा, स्वास्थ्य और सशक्तिकरण के क्षेत्र में हम मिलकर बदलाव ला सकते हैं।
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/donate">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8 py-3 font-semibold text-base"
                data-testid="hero-donate-button"
              >
                अभी दान करें <Heart className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-primary border-2 border-white hover:bg-primary/5 transition-all duration-300 rounded-full px-8 py-3 font-semibold text-base"
                data-testid="hero-join-button"
              >
                सदस्य बनें <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
              data-testid="stats-members"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="font-heading font-bold text-3xl text-stone-900">{stats.total_members}+</h3>
              <p className="text-stone-600 mt-2">सदस्य</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
              data-testid="stats-donations"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HandHeart className="text-secondary" size={32} />
              </div>
              <h3 className="font-heading font-bold text-3xl text-stone-900">₹{(stats.total_amount / 100000).toFixed(1)}L+</h3>
              <p className="text-stone-600 mt-2">दान राशि</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
              data-testid="stats-beneficiaries"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary" size={32} />
              </div>
              <h3 className="font-heading font-bold text-3xl text-stone-900">{stats.total_beneficiaries}+</h3>
              <p className="text-stone-600 mt-2">लाभार्थी</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
              data-testid="stats-campaigns"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-secondary" size={32} />
              </div>
              <h3 className="font-heading font-bold text-3xl text-stone-900">{stats.total_campaigns}+</h3>
              <p className="text-stone-600 mt-2">सक्रिय अभियान</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
              हमारी सेवाएं
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              समाज के विकास के लिए विभिन्न क्षेत्रों में काम कर रहे हैं
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'शिक्षा',
                description: 'गरीब बच्चों को मुफ्त शिक्षा और पुस्तकें प्रदान करना',
                image: 'https://images.unsplash.com/photo-1569173675610-42c361a86e37?crop=entropy&cs=srgb&fm=jpg&q=85'
              },
              {
                title: 'स्वास्थ्य',
                description: 'मुफ्त चिकित्सा शिविर और दवाइयां वितरण',
                image: 'https://images.unsplash.com/photo-1624903715293-afe920c6adad?crop=entropy&cs=srgb&fm=jpg&q=85'
              },
              {
                title: 'महिला सशक्तिकरण',
                description: 'महिलाओं को आत्मनिर्भर बनाने के लिए कौशल प्रशिक्षण',
                image: 'https://images.unsplash.com/photo-1637176594832-97454dc84edf?crop=entropy&cs=srgb&fm=jpg&q=85'
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-stone-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                data-testid={`service-card-${index}`}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-xl text-stone-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5"
                data-testid="view-all-services-button"
              >
                सभी सेवाएं देखें <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      {news.length > 0 && (
        <section className="py-20 bg-white" data-testid="news-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
                <Newspaper className="inline-block mr-2 text-primary" size={32} />
                ताज़ा समाचार
              </h2>
              <p className="text-stone-600">हमारी नवीनतम खबरें और अपडेट</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-stone-50 rounded-xl border border-stone-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  data-testid={`news-card-${index}`}
                >
                  {item.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-stone-500 mb-2">
                      {new Date(item.created_at).toLocaleDateString('hi-IN')}
                    </p>
                    <h3 className="font-heading font-semibold text-lg text-stone-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-3">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Activities Section */}
      {activities.length > 0 && (
        <section className="py-20 bg-stone-50" data-testid="activities-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
                <Calendar className="inline-block mr-2 text-primary" size={32} />
                हमारी गतिविधियां
              </h2>
              <p className="text-stone-600">हाल की सामाजिक गतिविधियां</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {activities.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-stone-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  data-testid={`activity-card-${index}`}
                >
                  {(item.images?.[0] || item.image_url) && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.images?.[0] || item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-stone-500 mb-2">
                      {new Date(item.created_at).toLocaleDateString('hi-IN')}
                    </p>
                    <h3 className="font-heading font-semibold text-lg text-stone-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-3">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ongoing Campaigns Section */}
      {campaigns.length > 0 && (
        <section className="py-20 bg-white" data-testid="campaigns-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
                <TrendingUp className="inline-block mr-2 text-primary" size={32} />
                चल रहे अभियान
              </h2>
              <p className="text-stone-600">हमारे फंडरेज़िंग अभियानों में योगदान करें</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {campaigns.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-stone-50 rounded-xl border border-stone-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  data-testid={`campaign-card-${index}`}
                >
                  {item.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-lg text-stone-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-2 mb-4">{item.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min((item.current_amount / item.goal_amount) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-stone-600">₹{item.current_amount || 0}</span>
                        <span className="text-stone-900 font-semibold">₹{item.goal_amount}</span>
                      </div>
                    </div>
                    
                    <Link to="/donate">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                        दान करें <Heart className="ml-2" size={16} />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
              क्यों जुड़ें हमारे साथ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'पारदर्शी कार्यप्रणाली',
              '80G टैक्स छूट',
              'प्रमाणित संगठन',
              'QR कोड वेरिफिकेशन',
              'ऑनलाइन रसीद',
              'नियमित अपडेट'
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-stone-50 rounded-lg"
                data-testid={`feature-item-${index}`}
              >
                <CheckCircle className="text-primary flex-shrink-0" size={24} />
                <span className="text-stone-800 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              आज ही शुरुआत करें
            </h2>
            <p className="text-base mb-8 text-white/90">
              आपका छोटा सा योगदान किसी के जीवन में बड़ा बदलाव ला सकता है
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8 py-3 font-semibold"
                  data-testid="cta-donate-button"
                >
                  दान करें
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary hover:bg-stone-100 border-2 border-white transition-all duration-300 rounded-full px-8 py-3 font-semibold"
                  data-testid="cta-register-button"
                >
                  सदस्य बनें
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;