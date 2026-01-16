const About = () => {
  return (
    <div className="min-h-screen bg-stone-50 py-12" data-testid="about-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-stone-900 mb-4">
            हमारे बारे में
          </h1>
          <p className="text-stone-600 text-base max-w-3xl mx-auto">
            NVP Welfare Foundation India एक पंजीकृत गैर-सरकारी संगठन है जो समाज के विकास के लिए काम कर रहा है।
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-stone-200">
          <h2 className="font-heading font-semibold text-2xl text-stone-900 mb-4">हमारा विज़न</h2>
          <p className="text-stone-600 leading-relaxed">
            एक ऐसा समाज बनाना जहां हर व्यक्ति को शिक्षा, स्वास्थ्य और अवसरों तक समान पहुंच मिले।
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-stone-200">
          <h2 className="font-heading font-semibold text-2xl text-stone-900 mb-4">हमारा मिशन</h2>
          <p className="text-stone-600 leading-relaxed">
            समाज के वंचित वर्गों को शिक्षा, स्वास्थ्य, और सशक्तिकरण के माध्यम से आत्मनिर्भर बनाना।
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
          <h2 className="font-heading font-semibold text-2xl text-stone-900 mb-4">संपर्क जानकारी</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-stone-900 mb-2">पता</h3>
              <p className="text-stone-600">नारायण निवास बजरंग नगर मोड़ा बालाजी रोड दौसा राजस्थान</p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 mb-2">फोन</h3>
              <p className="text-stone-600">78776 43155</p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 mb-2">Email</h3>
              <p className="text-stone-600">info@nvpwelfare.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;