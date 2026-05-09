import React from 'react';
import { Phone, Clock, Radio, Star, Zap, ArrowRight } from 'lucide-react';

const AdvertisePage: React.FC = () => {
  const whatsappNumber = '+5521971099200';
  
  const plans = [
    {
      title: 'Commercial Spot',
      duration: '30 seconds',
      price: '$5 USD',
      description: 'Pre-recorded message inserted during programming breaks. Ideal for quick promotion.',
      icon: <Zap className="w-6 h-6" />,
      highlight: false,
      message: "Hi! I'm interested in the 30s Commercial Spot on Praise FM."
    },
    {
      title: 'Live Mention',
      duration: 'During live shows',
      price: '$8 USD',
      description: 'The host mentions your brand live on air, with instant reach.',
      icon: <Star className="w-6 h-6" />,
      highlight: true,
      message: 'Hi! I want to book a Live Mention on Praise FM.'
    },
    {
      title: '1-Hour Show',
      duration: '60 minutes',
      price: '$30 USD',
      description: 'Your own music or talk show for a full hour. Choose your preferred time slot.',
      icon: <Radio className="w-6 h-6" />,
      highlight: false,
      message: "Hi! I'm interested in the 1-Hour Show on Praise FM."
    },
    {
      title: 'Monthly Package',
      duration: '4 shows/month',
      price: '$100 USD',
      description: 'Four one-hour shows throughout the month at a discounted rate.',
      icon: <Clock className="w-6 h-6" />,
      highlight: false,
      message: 'Hi! I want to sign up for the Monthly Package on Praise FM.'
    }
  ];

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Advertise on <span className="text-black">Praise FM</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 text-white/90">
            Take your brand to thousands of listeners passionate about music and faith.
          </p>
          <button
            onClick={() => openWhatsApp('Hello! I want to advertise on Praise FM. Could you send me more information?')}
            className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl"
          >
            <Phone className="w-6 h-6" />
            Chat on WhatsApp
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
          Our <span className="text-orange-500">Plans</span>
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Choose the perfect format for your campaign. All prices are negotiable via WhatsApp.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-6 border-2 transition-all hover:shadow-lg flex flex-col ${
                plan.highlight
                  ? 'border-orange-500 shadow-orange-100 dark:shadow-orange-900/20'
                  : 'border-transparent hover:border-orange-200 dark:hover:border-orange-800'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500 mb-4">
                {plan.icon}
              </div>

              <h3 className="text-xl font-bold mb-1">{plan.title}</h3>
              <p className="text-sm text-orange-500 font-bold mb-3">{plan.duration}</p>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">{plan.description}</p>

              <div className="mb-4">
                <span className="text-3xl font-black">{plan.price}</span>
                {plan.title === 'Monthly Package' && (
                  <span className="text-sm text-gray-500 block">Save $20</span>
                )}
              </div>

              <button
                onClick={() => openWhatsApp(plan.message)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 dark:bg-[#1a1a1a] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-12">
            Why advertise on <span className="text-orange-500">Praise FM</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500 mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Guaranteed Reach</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Thousands of listeners tuned in 24/7 across the globe.
              </p>
            </div>

            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500 mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Engaged Audience</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Loyal listeners who trust the station's recommendations.
              </p>
            </div>

            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Fast Results</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Flexible ad formats that fit your budget and goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to <span className="text-orange-500">grow</span> with us?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
            Click the button below and speak directly with our sales team.
          </p>
          <button
            onClick={() => openWhatsApp('Hello! I want to advertise on Praise FM. Could you send me more information?')}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-full font-black text-lg transition-all hover:scale-105 shadow-xl"
          >
            <Phone className="w-6 h-6" />
            +55 21 97109-9200
          </button>
          <p className="mt-4 text-sm text-gray-400">
            Or call the number above during business hours.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AdvertisePage;