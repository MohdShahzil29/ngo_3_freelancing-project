import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Target,
  Award,
  TreePine,
  GraduationCap,
  Stethoscope,
  Scale,
} from "lucide-react";
import NarenderImage from "@/assets/Narender.jpeg";
import कृष्ण from "@/assets/कृष्ण.jpeg";
import { useEffect } from "react";
import जीतेशकुमारगुप्ता from "@/assets/जीतेश कुमार गुप्ता.jpeg";

const About = () => {
  const areasOfWork = [
    {
      icon: Users,
      title: "Women Empowerment & Gender Equality",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: GraduationCap,
      title: "Education & Skill Development",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Stethoscope,
      title: "Health, Hygiene & Nutrition",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Heart,
      title: "Child Welfare & Youth Development",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: TreePine,
      title: "Environmental Protection & Plantation",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Target,
      title: "Rural & Urban Development",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Scale,
      title: "Human Rights Awareness & Legal Aid",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Award,
      title: "Disaster Relief & Rehabilitation",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const teamMembers = [
    {
      name: "जीतेश कुमार गुप्ता",
      role: "Co-Founder",
      img: जीतेशकुमारगुप्ता,
    },

    {
      name: "नरेंद्र कुमार महावर",
      role: "चेयरमैन",
      img: NarenderImage,
    },
    {
      name: "कृष्ण कुमार",
      role: "ट्रेजर (कोषाध्यक्ष)",
      img: कृष्ण,
    },
  ];

  useEffect(() => {
    document.title = "About Us || Emergent";
  }, []);

  return (
    <div className="min-h-screen bg-stone-50" data-testid="about-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading font-bold text-4xl sm:text-5xl mb-6"
          >
            हमारे बारे में
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-3xl mx-auto leading-relaxed"
          >
            NVP (New Vision Plantation) & Welfare Foundation India - समावेशी
            सामाजिक विकास, मानव कल्याण और भारत भर में सतत प्रगति के लिए
            प्रतिबद्ध एक गैर-लाभकारी संगठन
          </motion.p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
            <h2 className="font-heading font-bold text-3xl text-stone-900 mb-6 text-center">
              NVP Welfare Foundation India
            </h2>
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
              <p>
                <strong>NVP Welfare Foundation India</strong> is a non-profit
                organization committed to inclusive social development, human
                welfare, and sustainable progress across India. Registered in
                the state of Rajasthan, the Foundation works with a
                people-centric approach to uplift underprivileged communities,
                empower women and youth, promote education, healthcare,
                environmental protection, and ensure social justice.
              </p>
              <p>
                Our organization believes that true national development is
                possible only when every individual—regardless of gender, caste,
                age, or economic background—has access to basic rights,
                education, healthcare, dignity, and opportunities for growth.
              </p>
              <p>
                NVP Welfare Foundation India actively designs and implements
                programs in the fields of women empowerment, child welfare,
                education, health & hygiene, environmental conservation, rural &
                urban development, disaster management, skill development, youth
                affairs, and human rights awareness. We collaborate with
                government bodies, local institutions, volunteers, and
                like-minded organizations to create long-lasting social impact.
              </p>
              <p>
                Our initiatives focus on awareness generation, capacity
                building, community participation, and sustainable solutions
                that improve quality of life and promote self-reliance among
                marginalized sections of society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary/5 rounded-xl p-8 border-l-4 border-primary"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                  <Target className="text-white" size={24} />
                </div>
                <h3 className="font-heading font-bold text-2xl text-stone-900">
                  Our Vision
                </h3>
              </div>
              <p className="text-stone-700 leading-relaxed">
                To build an inclusive, just, and empowered society where every
                individual can live with dignity, equality, and opportunity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-secondary/5 rounded-xl p-8 border-l-4 border-secondary"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-4">
                  <Heart className="text-white" size={24} />
                </div>
                <h3 className="font-heading font-bold text-2xl text-stone-900">
                  Our Mission
                </h3>
              </div>
              <ul className="text-stone-700 leading-relaxed space-y-2">
                <li>
                  • To promote social welfare, education, healthcare, and
                  environmental sustainability
                </li>
                <li>
                  • To empower women, children, youth, and economically weaker
                  sections
                </li>
                <li>
                  • To encourage community participation and responsible
                  citizenship
                </li>
                <li>
                  • To support government and social initiatives for holistic
                  development
                </li>
                <li>
                  • To work towards a peaceful, healthy, and progressive India
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
              Founder's Message
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-200"
          >
            <div className="grid md:grid-cols-3 gap-0">
              {/* Founder Photo */}
              <div className="md:col-span-1 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mb-6 relative">
                    <img
                      src="https://customer-assets.emergentagent.com/job_ngoboost/artifacts/sko38kqw_IMG-20260113-WA0005.jpg"
                      alt="Mukesh Kumar Mahawar"
                      className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-stone-900 mb-2">
                    Mukesh Kumar Mahawar
                  </h3>
                  <p className="text-primary font-semibold">Founder</p>
                  <p className="text-stone-600 text-sm mt-2">
                    NVP Welfare Foundation India
                  </p>
                </div>
              </div>

              {/* Founder Message */}
              <div className="md:col-span-2 p-8">
                <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
                  <p>
                    <strong>Mukesh Kumar Mahawar</strong>, the Founder of NVP
                    Welfare Foundation India, is a socially committed individual
                    with a strong vision for community development and social
                    upliftment. Inspired by the belief that service to humanity
                    is the highest form of service, he founded NVP Welfare
                    Foundation India to address social inequalities and create
                    opportunities for those in need.
                  </p>
                  <p>
                    Under his leadership, the Foundation emphasizes ethical
                    values, transparency, grassroots involvement, and long-term
                    impact. His approach focuses on empowering communities
                    through education, awareness, skill development, and
                    sustainable welfare programs rather than short-term relief.
                  </p>
                  <p>
                    Mukesh Kumar Mahawar strongly believes that collective
                    effort, compassion, and responsible action can transform
                    society and contribute to nation-building.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Members Section */}
      {/* <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-3xl text-stone-900 mb-2">
              Team Members
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              हमारी टीम के मुख्य सदस्य
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-xl border border-stone-200 p-6 flex items-center gap-4 hover:shadow-lg"
                data-testid={`team-member-${idx}`}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <h4 className="font-semibold text-stone-900">
                    {member.name}
                  </h4>
                  <p className="text-primary font-medium mt-1">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Team Members</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border rounded-xl p-6 flex items-center gap-4 hover:shadow-lg"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-primary">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas of Work */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
              Areas of Work
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              हम विभिन्न क्षेत्रों में सामाजिक कल्याण और विकास के लिए काम करते
              हैं
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {areasOfWork.map((area, index) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg transition-all"
                  data-testid={`area-${index}`}
                >
                  <div
                    className={`w-12 h-12 ${area.color} rounded-full flex items-center justify-center mb-4`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                    {area.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Our Commitment
            </h2>
            <p className="text-lg leading-relaxed mb-8">
              NVP Welfare Foundation India operates on a non-profit,
              non-political, and non-religious basis. All resources and
              contributions are utilized solely for the promotion of the
              Foundation's objectives, ensuring accountability, transparency,
              and ethical governance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">Non-Profit</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">Non-Political</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">Non-Religious</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">Transparent</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
            <h2 className="font-heading font-semibold text-2xl text-stone-900 mb-6 text-center">
              संपर्क जानकारी
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">पता</h3>
                <p className="text-stone-600">
                  नारायण निवास, बजरंग नगर, मोड़ा बालाजी रोड, दौसा, राजस्थान –
                  303303
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">फोन</h3>
                <p className="text-stone-600">78776 43155</p>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">Email</h3>
                <p className="text-stone-600">nvpwfoundationindia@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
