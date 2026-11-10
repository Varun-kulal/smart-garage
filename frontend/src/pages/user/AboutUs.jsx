import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench, Cpu, ShieldCheck, Users, Star, Zap, Globe, HeartHandshake
} from 'lucide-react';

// === Team data ===
const TEAM = [
  { name: 'Arjun Mehta',   role: 'Founder & CEO',         initials: 'AM' },
  { name: 'Priya Sharma',  role: 'Lead AI Engineer',      initials: 'PS' },
  { name: 'Ravi Patel',    role: 'Full-Stack Engineer',   initials: 'RP' },
  { name: 'Neha Kapoor',   role: 'Product Designer',      initials: 'NK' },
  { name: 'Vikram Singh',  role: 'Automotive Expert',     initials: 'VS' },
  { name: 'Ananya Roy',    role: 'Customer Success Lead', initials: 'AR' },
];

// === Stats ===
const STATS = [
  { value: '50,000+', label: 'Parts Catalogued',  icon: Wrench },
  { value: '12,000+', label: 'Happy Customers',   icon: Users  },
  { value: '99.2%',   label: 'AI Accuracy',       icon: Cpu    },
  { value: '4.9 Rating', label: 'Average Rating',  icon: Star   },
];

// === Values ===
const VALUES = [
  { icon: Cpu,           title: 'AI-First',       desc: 'Every decision is powered by machine-learning models trained on millions of automotive data points.' },
  { icon: ShieldCheck,   title: 'Trust & Safety',  desc: 'OEM-grade verification on every part ensures you never receive a counterfeit component.' },
  { icon: Zap,           title: 'Speed',           desc: 'Real-time inventory, instant AI recognition and same-day dispatch keep your garage running.' },
  { icon: HeartHandshake, title: 'Customer First', desc: 'Dedicated support agents available 7 days a week to assist with every query.' },
  { icon: Star,          title: 'Premium Quality', desc: 'Curated catalogue of performance and OEM parts tested against strict quality benchmarks.' },
];

// === Component ===
const AboutUs = () => {
  return (
    <div className="space-y-24 pb-16 font-sans">

      {/* === Hero === */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-16 text-center bg-[#111827] shadow-2xl">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full border-[1px] border-[#FF3B30] opacity-30"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-[#FF3B30] to-transparent rounded-full blur-[100px] opacity-20"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <span className="inline-block px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-8 bg-[#FF3B30]/10 border border-[#FF3B30]/30 text-[#FF3B30]">
            Est. 2024 . Bengaluru, India
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-8 tracking-tighter">
            Smart Garage Hub<br />
            <span className="text-[#FF3B30]">
              Automotive Intelligence.
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed mb-10 font-medium">
            Smart Garage Hub is India's pioneering AI-powered automotive intelligence platform. 
            We integrate advanced computer vision models, digital diagnostic telemetry, and real-time 
            OEM/OES supply chain cataloging to eliminate opaque pricing, fitment mismatch, and component 
            counterfeiting.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/user/shop" className="px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm text-white bg-[#FF3B30] hover:bg-red-600 transition-all duration-300 shadow-lg shadow-[#FF3B30]/30 hover:-translate-y-1">
              Explore Parts Shop
            </Link>
            <Link to="/user/ai-detect" className="px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm text-white border border-gray-600 hover:border-gray-400 hover:bg-white/5 transition-all duration-300">
              Try AI Scanner
            </Link>
          </div>
        </motion.div>
      </section>

      {/* === Stats === */}
      

      {/* === Mission === */}
      <section className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-black tracking-widest uppercase mb-4 block text-[#FF3B30]">
            Our Mission
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#111827] mb-8 leading-tight tracking-tighter">
            Standardizing Automotive Care Through Precision Technology.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6 font-medium text-lg">
            The automotive aftermarket in India faces persistent challenges including fitment mismatches, 
            counterfeit components, and volatile, untrustworthy pricing structures. Smart Garage Hub 
            mitigates these systemic inefficiencies by providing instant, AI-driven part identification, 
            verified multi-vendor sourcing networks, and a unified service scheduling portal.
          </p>
          <p className="text-gray-600 leading-relaxed font-medium text-lg">
            We envision a seamless digital aftermarket ecosystem where independent mechanics, multi-brand 
            workshops, and individual vehicle owners gain access to standardized diagnostic intelligence.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {VALUES.slice(0, 4).map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <Icon className="w-8 h-8 mb-4 text-[#111827] group-hover:text-[#FF3B30] transition-colors" />
              <h3 className="text-lg font-black text-[#111827] mb-2">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === Values === */}
      <section className="bg-gray-50 rounded-3xl p-10 sm:p-16 border border-gray-100">
        <div className="text-center mb-16">
          <span className="text-xs font-black tracking-widest uppercase mb-3 block text-[#FF3B30]">
            What We Stand For
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#111827] tracking-tighter">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-8 bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-[#FF3B30]/10 transition-colors">
                <Icon className="w-6 h-6 text-[#111827] group-hover:text-[#FF3B30] transition-colors" />
              </div>
              <h3 className="text-xl font-black text-[#111827] mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === Team === */}
     

      {/* === CTA === */}
      <section className="relative overflow-hidden rounded-3xl p-12 sm:p-20 text-center bg-[#FF3B30] shadow-2xl">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tighter">Ready to Get Started?</h2>
          <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Browse thousands of verified parts, scan your car with AI, and get same-day dispatch across India.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/user/shop" className="px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm text-[#111827] bg-white hover:bg-gray-100 transition-all duration-300 shadow-lg hover:-translate-y-1">
              Shop Parts Now
            </Link>
            <Link to="/user/ai-detect" className="px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm text-white border border-white/30 hover:bg-white/10 transition-all duration-300">
              AI Parts Scanner
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
