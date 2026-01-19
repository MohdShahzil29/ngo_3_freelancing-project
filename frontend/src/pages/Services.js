import { useEffect } from "react";

const Services = () => {
  const services = [
    {
      title: "शिक्षा",
      description:
        "गरीब बच्चों को मुफ्त शिक्षा, पुस्तकें और यूनिफॉर्म प्रदान करते हैं।",
      icon: "📚",
    },
    {
      title: "स्वास्थ्य",
      description:
        "मुफ्त चिकित्सा शिविर, दवाइयां और स्वास्थ्य जागरूकता कार्यक्रम।",
      icon: "⚕️",
    },
    {
      title: "महिला सशक्तिकरण",
      description: "महिलाओं के लिए कौशल प्रशिक्षण और रोजगार के अवसर।",
      icon: "👩",
    },
    {
      title: "भोजन वितरण",
      description: "जरूरतमंद परिवारों को मुफ्त भोजन और राशन वितरण।",
      icon: "🍲",
    },
    {
      title: "वस्त्र वितरण",
      description: "गरीब लोगों को मुफ्त कपड़े और जरूरी सामान वितरण।",
      icon: "👕",
    },
    {
      title: "पर्यावरण संरक्षण",
      description: "वृक्षारोपण, स्वच्छता अभियान और पर्यावरण जागरूकता।",
      icon: "🌳",
    },
  ];

  useEffect(() => {
    document.title = "Services || Emergent";
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-12" data-testid="services-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-stone-900 mb-4">
            हमारी सेवाएं
          </h1>
          <p className="text-stone-600 text-base max-w-2xl mx-auto">
            समाज के विकास के लिए हम विभिन्न क्षेत्रों में काम कर रहे हैं
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 border border-stone-200 hover:shadow-xl transition-all"
              data-testid={`service-${index}`}
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="font-heading font-semibold text-xl text-stone-900 mb-3">
                {service.title}
              </h3>
              <p className="text-stone-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
