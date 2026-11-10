import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Car,
  Wrench,
  ShoppingBag,
  Info,
  CheckCircle2,
  ChevronRight,
  Search,
  ChevronLeft,
  X,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle,
  MapPin,
  User
} from 'lucide-react';

// === CATEGORIES DATA ===
const CATEGORIES = [
  { id: 'ac', name: 'AC Service & Repair', icon: WindIcon },
  { id: 'battery', name: 'Batteries', icon: BatteryChargingIcon },
  { id: 'tyres', name: 'Tyres & Wheel Care', icon: DiscIcon },
  { id: 'denting', name: 'Denting & Painting', icon: PaintbrushIcon },
  { id: 'detailing', name: 'Detailing Services', icon: SparklesIcon }
];

// Fallback icons defined locally to ensure no missing lucide imports
function WindIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.8 19.6A2 2 0 1 0 14 16H2M17.5 15.6A2 2 0 1 0 18 12H2M9.8 8.4A2 2 0 1 1 8 12H2" />
    </svg>
  );
}

function BatteryChargingIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M21 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2M10 7h4v10h-4zM12 11v2" />
    </svg>
  );
}

function DiscIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PaintbrushIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 22 1-1c1.4-1.4 2.4-3.2 3-5.2L18 9l-5-5-6.8 2c-2 .7-3.8 1.7-5.2 3l-1 1" />
      <path d="m19 9 1.1-1.1c.4-.4.4-1 0-1.4l-2.6-2.6c-.4-.4-1-.4-1.4 0L15 5" />
      <path d="m5 17 3 3" />
      <path d="M9 13H5v4h4Z" />
    </svg>
  );
}

function SparklesIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
    </svg>
  );
}

// === 20 MOCK SERVICES WITH WORKING AUTOMOTIVE PHOTOS ===
const MOCK_IMAGE_URL = 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=600';

const PACKAGES = {
  ac: [
    {
      id: 'pkg-ac-regular',
      name: 'Regular AC Service',
      desc: 'Takes 4 hours • 500 Kms or 1 Month Warranty • Every 5,000 Kms or 3 Months (Recommended)',
      price: 3888,
      duration: '4 hours',
      warranty: '500 Kms / 1 Month',
      bullets: [
        'AC Vent Cleaning',
        'AC Inspection & Gas check',
        'AC Gas Top-up (up to 400g)',
        'Condenser Cleaning',
        'AC Cabin Filter Cleaning'
      ],
      tag: 'FREE AC UNIT INSPECTION',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Vikram Singh',
      mechanicPhone: '9876556934',
      garageName: 'Speedy Auto Repair',
      garageLocation: '12 Main St, Mangalore'
    },
    {
      id: 'pkg-ac-high',
      name: 'High Performance AC Service',
      desc: 'Takes 8 hours • 1,000 Kms or 1 Month Warranty • Every 10,000 Kms or 1 Year (Recommended)',
      price: 6999,
      duration: '8 hours',
      warranty: '1,000 Kms / 1 Month',
      bullets: [
        'AC Vent & Duct Disinfection',
        'Complete AC Gas Refill & Leak Test',
        'Compressor Oil Top-up',
        'Condenser Washing',
        'Cooling Coil Deep Cleaning'
      ],
      tag: 'RECOMMENDED',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Arjun Patel',
      mechanicPhone: '9876563886',
      garageName: 'Apex Garage',
      garageLocation: '45 Cross Rd, Kasaragod'
    },
    {
      id: 'pkg-ac-cooling',
      name: 'Cooling Coil Replacement',
      desc: 'Takes 5 hours • 1 Year Warranty • Dashboard dismantling & leak testing included',
      price: 4500,
      duration: '5 hours',
      warranty: '1 Year Warranty',
      bullets: [
        'Dashboard Assembly Dismantling',
        'Brand New Cooling Coil Fitting',
        'AC Gas Charging (R134a)',
        'AC System Leakage Check',
        'Cooling Efficiency Testing'
      ],
      tag: 'OEM GRADE PARTS',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Deepak Kumar',
      mechanicPhone: '9876553776',
      garageName: 'Pioneer Auto Care',
      garageLocation: '88 Ring Rd, Udupi'
    },
    {
      id: 'pkg-ac-leak',
      name: 'AC Leakage Test & Repair',
      desc: 'Takes 3 hours • 90 Days Warranty • Nitrogen pressure test mapping',
      price: 2100,
      duration: '3 hours',
      warranty: '90 Days Warranty',
      bullets: [
        'System Nitrogen Pressure Test',
        'Electronic Leak Detector Check',
        'AC Dye Tracer Injection',
        'O-Ring and Valve Seal Replacement',
        'Expansion Valve Service'
      ],
      tag: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Rohan Sharma',
      mechanicPhone: '9876540557',
      garageName: 'Urban Mechanic Center',
      garageLocation: '102 Tech Park, Manipal'
    }
  ],
  battery: [
    {
      id: 'pkg-bat-amaron-55',
      name: 'Amaron (55 Months Warranty)',
      desc: '35 Amp Hour • Free of Cost Doorstep Installation • Old Battery Price Included',
      price: 3888,
      duration: '1 hour',
      warranty: '55 Months',
      bullets: [
        'Free Pickup & Drop',
        'Free Installation at Doorstep',
        'Old Battery Buyback Included',
        'Expert Alternator Charge Test'
      ],
      tag: 'RECOMMENDED',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Amit Verma',
      mechanicPhone: '9876570343',
      garageName: 'Elite Motors',
      garageLocation: '33 Beach Rd, Mangalore'
    },
    {
      id: 'pkg-bat-amaron-go',
      name: 'Amaron Go 35 Amp',
      desc: 'Left Layout • 60 Months Warranty • Free of Cost Installation',
      price: 3500,
      duration: '1 hour',
      warranty: '60 Months',
      bullets: [
        'Premium high-cold-cranking battery',
        'Maintenance Free Design',
        'Free Alternator Output Assessment',
        'Paperless Warranty Logging'
      ],
      tag: '4.6 ★ Expert Rating',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Sandeep Nair',
      mechanicPhone: '9876540057',
      garageName: 'Titan Auto Works',
      garageLocation: '77 Hill View, Kasaragod'
    },
    {
      id: 'pkg-bat-exide-mileage',
      name: 'Exide Mileage FML0',
      desc: '38 Amp Hour • Robust plate design • Maintenance-free hybrid technology',
      price: 4200,
      duration: '1 hour',
      warranty: '48 Months',
      bullets: [
        'High Vibration Resistance',
        'Special Paste Formulation for long life',
        'Old Battery Exchange Rebate',
        'Corrosion-free Terminal Spraying'
      ],
      tag: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Ravi Teja',
      mechanicPhone: '9876570259',
      garageName: 'Precision Car Care',
      garageLocation: '90 Center St, Udupi'
    },
    {
      id: 'pkg-bat-jumpstart',
      name: 'Emergency Jumpstart Service',
      desc: 'Instant 30 mins dispatch • Battery voltage diagnostics included',
      price: 499,
      duration: '30 mins',
      warranty: 'Immediate Fix',
      bullets: [
        'Heavy-Duty Jumper Starter Hookup',
        'Battery Diagnostics Report',
        'Alternator Charger Current Check',
        'Electrical Leakage Scan'
      ],
      tag: '24/7 SUPPORT',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Karan Johar',
      mechanicPhone: '9876553649',
      garageName: 'NextGen Auto Shop',
      garageLocation: '22 North Ave, Manipal'
    }
  ],
  tyres: [
    {
      id: 'pkg-tyre-align',
      name: 'Wheel Alignment & Balancing',
      desc: 'Takes 1.5 hours • Prevents uneven tire wear & steering pulls',
      price: 999,
      duration: '1.5 hours',
      warranty: '30 Days',
      bullets: [
        'Laser-Guided 3D Wheel Alignment',
        'High Precision Wheel Balancing',
        'Tyre Rotation (Cross Pattern)',
        'Tread Depth Inspection & Pressure check'
      ],
      tag: 'RECOMMENDED',
      image: '/images/tyre_1.png',
      mechanicName: 'Manish Pandey',
      mechanicPhone: '9876520377',
      garageName: 'Royal Garage',
      garageLocation: '15 South Blvd, Mangalore'
    },
    {
      id: 'pkg-tyre-puncture',
      name: 'Tyre Puncture Repair',
      desc: 'Takes 30 mins • High grade rubber seal plugging',
      price: 299,
      duration: '30 mins',
      warranty: 'N/A',
      bullets: [
        'Tubeless Puncture Plugging',
        'Valves and Rim Sealing Check',
        'Digital Tire Pressure Top-up',
        'Wheel Weights Re-balancing'
      ],
      tag: 'QUICK FIX',
      image: '/images/tyre_2.png',
      mechanicName: 'Vinay Kumar',
      mechanicPhone: '9876582476',
      garageName: 'ProFix Auto',
      garageLocation: '66 West Dr, Kasaragod'
    },
    {
      id: 'pkg-tyre-yokohama',
      name: 'Yokohama BlueEarth AE50',
      desc: 'Quiet drive tread technology • Premium grip and fuel efficiency rating',
      price: 5600,
      duration: '1 hour',
      warranty: '5 Years Warranty',
      bullets: [
        ' Yokohama Premium Radial (1 Unit)',
        'Free Mounting & Gas Inflation',
        'Advanced Fuel Saving Compound',
        'Excellent Braking on Wet Surfaces'
      ],
      tag: 'PREMIUM TYRES',
      image: '/images/tyre_1.png',
      mechanicName: 'Aditya Rao',
      mechanicPhone: '9876522265',
      garageName: 'Metro Service Station',
      garageLocation: '11 East End, Udupi'
    },
    {
      id: 'pkg-tyre-rotation',
      name: 'Complete Tyre Care Package',
      desc: 'Best Value Bundle • 4-wheel alignment and balancing',
      price: 1599,
      duration: '2 hours',
      warranty: '60 Days',
      bullets: [
        'Laser 3D Wheel Alignment',
        'Computerised 4-Wheel Balancing',
        'Nitrogen Gas Refill (All tyres)',
        'Rust Cleaning from Wheel Hubs'
      ],
      tag: 'VALUE BUNDLE',
      image: '/images/tyre_2.png',
      mechanicName: 'Surya Pratap',
      mechanicPhone: '9876517628',
      garageName: 'Dynamic Auto Point',
      garageLocation: '44 Horizon Way, Manipal'
    }
  ],
  denting: [
    {
      id: 'pkg-dent-bumper',
      name: 'Front Bumper Denting & Painting',
      desc: 'Takes 24 hours • 2 Years Paint Warranty • Nippon Color Matching',
      price: 2499,
      duration: '24 hours',
      warranty: '2 Years Paint Warranty',
      bullets: [
        'Scratch Removal & Dent Pulling',
        'Grade-A Primer & Paint Booth Coating',
        'Nippon Paint Finish with Clear Gloss',
        'OEM Bumper Fitment Alignment check'
      ],
      tag: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Nikhil Jain',
      mechanicPhone: '9876539030',
      garageName: 'Supreme Car Service',
      garageLocation: '89 Bay View, Mangalore'
    },
    {
      id: 'pkg-dent-door',
      name: 'Single Door Panel Restoration',
      desc: 'Takes 24 hours • Paint matching technology • Scratch & dent removal',
      price: 1999,
      duration: '24 hours',
      warranty: '2 Years Warranty',
      bullets: [
        'Panel Shrinking & Dent Extraction',
        'Polyester Body Filler Surfacing',
        'Anti-Corrosive Primer Layering',
        'Clearcoat Gloss Painting'
      ],
      tag: 'EXPERT WORK',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Rahul Dravid',
      mechanicPhone: '9876531146',
      garageName: 'Alpha Motors',
      garageLocation: '23 River Side, Kasaragod'
    },
    {
      id: 'pkg-dent-scratch',
      name: 'Full Body Scratch Removal',
      desc: 'Takes 6 hours • Compounding & dual action orbital polishing',
      price: 3500,
      duration: '6 hours',
      warranty: 'N/A',
      bullets: [
        'Dual-Action Compounding Buff',
        'Micro-Scratch Fill-in Compound',
        'Carnauba Wax Sealant Protection',
        'High-Gloss Gloss Booster Glossing'
      ],
      tag: 'HOT SELLER',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Gaurav Chopra',
      mechanicPhone: '9876580440',
      garageName: 'Velocity Garage',
      garageLocation: '55 Valley Rd, Udupi'
    },
    {
      id: 'pkg-dent-alloy',
      name: 'Alloy Wheel Refurbishing (4 Wheels)',
      desc: 'Curb rash removal • Thermal spray paint painting',
      price: 4800,
      duration: '12 hours',
      warranty: '1 Year Warranty',
      bullets: [
        'Curb Rash Edge Grinding',
        'Aero-Grade Refinishing Paint',
        'Oven-Baked Thermal Curing',
        'Dust and Salt Shield Clearcoat'
      ],
      tag: 'UPGRADE STYLE',
      image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Prakash Raj',
      mechanicPhone: '9876568323',
      garageName: 'Prime Auto Repair',
      garageLocation: '78 Pine Ln, Manipal'
    }
  ],
  detailing: [
    {
      id: 'pkg-det-ceramic',
      name: 'Eco Shield Ceramic Coating',
      desc: 'Takes 2 days • 3 Years Gloss Warranty • 9H hardness protection',
      price: 14999,
      duration: '2 days',
      warranty: '3 Years Warranty',
      bullets: [
        'Dual Layer 9H Nano Ceramic Coating',
        'Exquisite Clay Bar Decontamination',
        'Multi-stage Paint Correction Buffing',
        'UV Ray, Bird Dropping & Swirl Mark Resistance'
      ],
      tag: 'PREMIUM CARE',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Dinesh Karthik',
      mechanicPhone: '9876581411',
      garageName: 'Eco Shield Auto',
      garageLocation: '40 Green Way, Mangalore'
    },
    {
      id: 'pkg-det-interior',
      name: 'Deep Clean Interior Spa',
      desc: 'Takes 5 hours • Complete detailing & leather sanitizing',
      price: 2499,
      duration: '5 hours',
      warranty: 'N/A',
      bullets: [
        'High-Pressure Upholstery Extraction',
        'Steam Disinfection (All seats/AC vents)',
        'Dashboard & Trim Conditioning',
        'Deep Carpet Vacuuming & Shampooing'
      ],
      tag: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Varun Dhawan',
      mechanicPhone: '9876566639',
      garageName: 'Ultimate Detailing',
      garageLocation: '99 Wash St, Kasaragod'
    },
    {
      id: 'pkg-det-rubbing',
      name: 'Paint Rubbing & Polishing',
      desc: 'Takes 3 hours • Revives original factory shine',
      price: 1899,
      duration: '3 hours',
      warranty: '90 Days Warranty',
      bullets: [
        'Machine Swirl-Mark Buffing',
        'Gloss Restore Glazing Polish',
        'Microfiber Hand Detailing Finish',
        'Rain-Repelling Hydrophobic Sealant'
      ],
      tag: 'GLOSS SHINE',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Mohit Suri',
      mechanicPhone: '9876565336',
      garageName: 'Crystal Clear Cars',
      garageLocation: '101 Shine Ave, Udupi'
    },
    {
      id: 'pkg-det-underbody',
      name: 'Anti-Rust Underbody Coating',
      desc: 'Bitumen-based protection coating against gravel and salt corrosion',
      price: 1500,
      duration: '2 hours',
      warranty: '5 Years Warranty',
      bullets: [
        'Steam Underbody Wash & Dry',
        'Thick Anti-Corrosive Tar Coating',
        'Road Noise Dampening Protection',
        'Critical Chassis Joint Protection'
      ],
      tag: 'ESSENTIAL SHIELD',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
      mechanicName: 'Sachin Pilot',
      mechanicPhone: '9876535100',
      garageName: 'Showroom Finish',
      garageLocation: '77 Gleam Rd, Manipal'
    }
  ]
};

// === CAR WIZARD LOGICAL DATA ===
const MANUFACTURERS = [
  { id: 'maruti', name: 'Maruti Suzuki', initials: 'MS', color: 'bg-blue-600' },
  { id: 'hyundai', name: 'Hyundai', initials: 'H', color: 'bg-indigo-700' },
  { id: 'honda', name: 'Honda', initials: 'HND', color: 'bg-red-600' },
  { id: 'tata', name: 'Tata', initials: 'TATA', color: 'bg-teal-700' },
  { id: 'ford', name: 'Ford', initials: 'F', color: 'bg-sky-800' },
  { id: 'volkswagen', name: 'Volkswagen', initials: 'VW', color: 'bg-blue-900' },
  { id: 'mahindra', name: 'Mahindra', initials: 'M&M', color: 'bg-red-700' },
  { id: 'renault', name: 'Renault', initials: 'R', color: 'bg-yellow-600' },
  { id: 'chevrolet', name: 'Chevrolet', initials: 'CHV', color: 'bg-amber-600' }
];

const MODELS = {
  maruti: ['Swift', 'WagonR', 'Baleno', 'Alto', 'Ertiga', 'Vitara Brezza', 'Celerio', 'Ritz'],
  hyundai: ['i10', 'i20', 'Creta', 'Verna', 'Venue', 'Santro', 'Elantra'],
  honda: ['City', 'Amaze', 'Civic', 'Jazz', 'Accord', 'WR-V'],
  tata: ['Nexon', 'Tiago', 'Altroz', 'Harrier', 'Safari', 'Punch'],
  ford: ['Figo', 'EcoSport', 'Endeavour', 'Aspire', 'Mustang'],
  volkswagen: ['Polo', 'Vento', 'Taigun', 'Virtus', 'Tiguan'],
  mahindra: ['Thar', 'Scorpio', 'XUV700', 'Bolero', 'XUV300'],
  renault: ['Kwid', 'Triber', 'Kiger', 'Duster'],
  chevrolet: ['Beat', 'Spark', 'Cruze', 'Sail', 'Tavera']
};

const FUEL_TYPES = ['Petrol', 'CNG', 'Diesel', 'Electric'];

const Services = () => {
  const navigate = useNavigate();

  // Unified State with default mock car available as requested
  const [vehicles, setVehicles] = useState([
    { _id: 'mock-veh-1', make: 'Maruti Suzuki', model: 'Alto', licensePlate: 'MS-99-XX-8623', year: 2021, vin: '1FA6P8CF5L862398765', mileage: 12000 }
  ]);
  const [dbServices, setDbServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // UI State - Left side
  const [activeCategory, setActiveCategory] = useState('ac');

  // UI State - Right side Selected/Wizard
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [cart, setCart] = useState([]); // Selected packages in cart
  const getLocalTodayDateStr = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const [bookingDate, setBookingDate] = useState(getLocalTodayDateStr());
  const [preferredTime, setPreferredTime] = useState('09:00 AM');
  const [showBookingSidebar, setShowBookingSidebar] = useState(false);
  const [selectedGarageId, setSelectedGarageId] = useState('');
  const [garages, setGarages] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State for Checkout/User Details
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [pendingPackage, setPendingPackage] = useState(null);

  // Wizard state (for creating a vehicle on the fly)
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardBrand, setWizardBrand] = useState(null);
  const [wizardModel, setWizardModel] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');

  const [wizardUserDetails, setWizardUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    otherIssues: '',
    showPickDrop: false,
    pickupLocation: '',
    isLocating: false
  });
  const [wizardError, setWizardError] = useState('');


  // Manage vehicles modal state
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);

  // Vehicle fields for manual add/edit
  const [makeInput, setMakeInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [yearInput, setYearInput] = useState(new Date().getFullYear());
  const [plateInput, setPlateInput] = useState('');
  const [vinInput, setVinInput] = useState('');
  const [mileageInput, setMileageInput] = useState(0);

  const getAvailableTimeSlots = () => {
    const allSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    if (bookingDate === getLocalTodayDateStr()) {
      const currentHour = new Date().getHours();
      const filtered = allSlots.filter(slot => {
        let [time, modifier] = slot.split(' ');
        let [hours] = time.split(':');
        hours = parseInt(hours, 10);
        if (hours === 12 && modifier === 'PM') {
          // noon
        } else if (modifier === 'PM') {
          hours += 12;
        } else if (hours === 12 && modifier === 'AM') {
          hours = 0;
        }
        return hours > currentHour;
      });
      return filtered.length > 0 ? filtered : ['No slots available today'];
    }
    return allSlots;
  };

  const availableTimeSlots = getAvailableTimeSlots();

  useEffect(() => {
    if (!availableTimeSlots.includes(preferredTime) && availableTimeSlots.length > 0) {
      setPreferredTime(availableTimeSlots[0]);
    }
  }, [bookingDate, availableTimeSlots, preferredTime]);

  const [selectedGarageFilter, setSelectedGarageFilter] = useState(localStorage.getItem('selectedGarageFilter') || '');

  useEffect(() => {
    fetchPageData();
  }, []);

  const [activeBookings, setActiveBookings] = useState([]);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const [vehRes, servRes, garageRes, bookingsRes] = await Promise.all([
        axios.get('/vehicles/my'),
        axios.get('/services'),
        axios.get('/garages'),
        axios.get('/services/bookings/my').catch(() => ({ data: { success: false } }))
      ]);

      if (vehRes.data.success) {
        const dbVehicles = vehRes.data.data;
        if (dbVehicles.length > 0) {
          const fetchedVehicles = [
            ...dbVehicles,
            { _id: 'mock-veh-1', make: 'Maruti Suzuki', model: 'Alto', licensePlate: 'MS-99-XX-8623', year: 2021, vin: '1FA6P8CF5L8623123', mileage: 12000, status: 'Approved' }
          ];
          setVehicles(fetchedVehicles);
        }
      }

      if (servRes.data.success) {
        setDbServices(servRes.data.data);
      }

      if (garageRes.data.success) {
        setGarages(garageRes.data.data);
        if (!localStorage.getItem('selectedGarageFilter') && garageRes.data.data.length > 0) {
          const allowedGarages = garageRes.data.data.filter(g => {
            const city = g.location.split(',').pop().trim().toLowerCase();
            return city === 'mangalore' || city === 'kasaragod';
          });
          if (allowedGarages.length > 0) {
            const firstGarageId = allowedGarages[0]._id;
            setSelectedGarageFilter(firstGarageId);
            localStorage.setItem('selectedGarageFilter', firstGarageId);
          }
        }
      }

      if (bookingsRes?.data?.success) {
        // Filter out completed/rejected if we only want "active" live tracker
        const active = bookingsRes.data.data.filter(b => b.status !== 'Completed' && b.status !== 'Rejected' && b.status !== 'Delivered');
        setActiveBookings(active);
      }

    } catch (err) {
      console.error('Error fetching service details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a package to cart (limit to 1 package type for direct booking simulation)
  const handleAddPackage = (pkg) => {
    setCart([pkg]);
  };

  const handleRemoveFromCart = (pkgId) => {
    setCart(prev => prev.filter(item => item.id !== pkgId));
  };

  // Brand selection in wizard
  const handleSelectBrand = (brand) => {
    setWizardBrand(brand);
    setWizardStep(2);
  };

  // Model selection in wizard
  const handleSelectModel = (model) => {
    setWizardModel(model);
    setWizardStep(3);
  };



  // User Details & Registration Submit in Modal
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setWizardError('');
    setIsSubmitting(true);

    let finalVehId = selectedVehicleId;
    const { name, email, phone, vehicleNumber } = wizardUserDetails;

    // Only validate full details if they don't have an active vehicle selected
    if (!finalVehId) {
      if (!name || !email || !phone || !vehicleNumber) {
        setWizardError('Please fill in all mandatory user details.');
        setIsSubmitting(false);
        return;
      }

      // Vehicle Number Regex Validation
      const vehicleRegex = /^[A-Za-z]{2}[\.\-\s]?\d{1,2}[\.\-\s]?[A-Za-z]{1,3}[\.\-\s]?\d{1,4}$/;
      if (!vehicleRegex.test(vehicleNumber)) {
        setWizardError('Invalid Vehicle Number. Example: KL.14.aa.1233');
        setIsSubmitting(false);
        return;
      }

      const randomSuffix = Math.floor(100 + Math.random() * 900); // 3 digits
      const mockVin = `1FA6P8CF5L${randomSuffix}1234`; // 10 + 3 + 4 = 17 chars

      try {
        const payload = {
          make: wizardBrand?.name || 'Other',
          model: wizardModel || 'Unknown',
          year: new Date().getFullYear(),
          licensePlate: vehicleNumber.toUpperCase(),
          vin: mockVin,
          mileage: 0
        };

        const res = await axios.post('/vehicles', payload);
        if (res.data.success) {
          const newVeh = res.data.data;
          // Filter out the old version if it exists, then prepend the updated one
          setVehicles(prev => [newVeh, ...prev.filter(v => v._id !== newVeh._id)]);
          finalVehId = newVeh._id;
          setSelectedVehicleId(newVeh._id);
        }
      } catch (err) {
        // Offline fallback
        const mockNewVeh = {
          _id: 'mock-auto-' + Date.now(),
          make: wizardBrand?.name || 'Other',
          model: wizardModel || 'Unknown',
          year: new Date().getFullYear(),
          licensePlate: vehicleNumber.toUpperCase(),
          vin: mockVin,
          mileage: 0
        };
        setVehicles(prev => [mockNewVeh, ...prev]);
        finalVehId = mockNewVeh._id;
        setSelectedVehicleId(mockNewVeh._id);
      }
    }

    // Now proceed to booking
    if (!bookingDate || !preferredTime) {
      setWizardError('Please select a Target Date and Time Slot.');
      setIsSubmitting(false);
      return;
    }

    const selectedDateObj = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDateObj < today) {
      setWizardError('Booking date cannot be in the past.');
      setIsSubmitting(false);
      return;
    }

    const activePkg = pendingPackage || cart[0];
    if (!activePkg) {
      setWizardError('No package selected.');
      setIsSubmitting(false);
      return;
    }

    let targetDbServiceId = '';
    const matchingService = dbServices.find(
      s => s.name.toLowerCase().includes(activePkg.name.toLowerCase()) ||
        activePkg.name.toLowerCase().includes(s.name.toLowerCase()) ||
        s.category.toLowerCase().includes(activeCategory.toLowerCase())
    );

    if (matchingService) {
      targetDbServiceId = matchingService._id;
    } else if (dbServices.length > 0) {
      targetDbServiceId = dbServices[0]._id;
    } else {
      targetDbServiceId = 'mock-serv-item';
    }

    let finalNotes = `${activePkg.name} (GoMechanic Package). Notes: ${wizardUserDetails.otherIssues || ''}`;
    if (wizardUserDetails.showPickDrop && wizardUserDetails.pickupLocation) {
      finalNotes += ` [Pick Up Location: ${wizardUserDetails.pickupLocation}]`;
    }

    if (wizardUserDetails.name) {
      finalNotes = `Customer: ${wizardUserDetails.name} | Phone: ${wizardUserDetails.phone} | Veh#: ${wizardUserDetails.vehicleNumber}\n---\n${finalNotes}`;
    }

    let matchedGarage = null;
    if (activePkg && activePkg.garageName) {
      matchedGarage = garages.find(g => g.name.toLowerCase() === activePkg.garageName.toLowerCase());
    }
    const finalGarageId = matchedGarage ? matchedGarage._id : (selectedGarageFilter || (garages.length > 0 ? garages[0]._id : 'mock-garage'));

    try {
      const payload = {
        vehicleId: finalVehId,
        serviceId: targetDbServiceId,
        garageId: finalGarageId,
        bookingDate,
        preferredTime,
        notes: finalNotes,
        totalCost: activePkg.price || 0
      };

      const mockBooking = {
        _id: 'mock-booking-' + Date.now(),
        vehicle: vehicles.find(v => v._id === finalVehId) || { make: wizardBrand?.name || 'Unknown', model: wizardModel || 'Unknown', licensePlate: wizardUserDetails.vehicleNumber || 'N/A' },
        service: dbServices.find(s => s._id === targetDbServiceId) || activePkg,
        garage: garages.find(g => g._id === payload.garageId) || { name: 'Assigned Garage' },
        bookingDate,
        preferredTime,
        status: 'Pending'
      };

      const res = await axios.post('/services/bookings', payload);
      if (res.data.success) {
        setSuccess('Your service request has been successfully booked!');
        setActiveBookings(prev => [res.data.data || mockBooking, ...prev]);
      }
    } catch (err) {
      setSuccess('Service request scheduled locally.');

      const payload = { garageId: selectedGarageFilter || (garages.length > 0 ? garages[0]._id : 'mock-garage') };
      const mockBooking = {
        _id: 'mock-booking-' + Date.now(),
        vehicle: vehicles.find(v => v._id === finalVehId) || { make: wizardBrand?.name || 'Unknown', model: wizardModel || 'Unknown', licensePlate: wizardUserDetails.vehicleNumber || 'N/A' },
        service: dbServices.find(s => s._id === targetDbServiceId) || activePkg,
        garage: garages.find(g => g._id === payload.garageId) || { name: 'Assigned Garage' },
        bookingDate,
        preferredTime,
        status: 'Pending'
      };
      setActiveBookings(prev => [mockBooking, ...prev]);
    } finally {
      // Refresh active bookings for tracker
      axios.get('/services/bookings/my').then(res => {
        if (res.data.success) {
          setActiveBookings(prev => {
            const fetched = res.data.data.filter(b => b.status !== 'Completed' && b.status !== 'Rejected' && b.status !== 'Delivered');
            const mocks = prev.filter(p => p._id && p._id.toString().startsWith('mock-booking'));
            // Remove duplicates if the backend miraculously succeeded later
            const finalMocks = mocks.filter(m => !fetched.some(f => f.bookingDate === m.bookingDate && f.preferredTime === m.preferredTime));
            return [...finalMocks, ...fetched];
          });
        }
      }).catch(() => { });

      setShowUserFormModal(false);
      setShowBookingSidebar(false);
      setPendingPackage(null);
      setIsSubmitting(false);
      setTimeout(() => setSuccess(''), 4500);
    }
  };

  const resetWizard = () => {
    setWizardUserDetails({
      name: '', email: '', phone: '', carModel: '', vehicleNumber: '', otherIssues: '', showPickDrop: false, pickupLocation: '', isLocating: false
    });
    setWizardError('');
  };

  // Create booking
  const handleCreateBooking = async () => {
    setError('');
    setSuccess('');

    if (!selectedVehicleId) {
      setError('Please select or register a vehicle first.');
      return;
    }
    if (cart.length === 0) {
      setError('Please select a service package.');
      return;
    }
    if (!selectedGarageId) {
      setError('Please select a target garage location.');
      return;
    }
    if (!bookingDate) {
      setError('Please select a target booking date.');
      return;
    }

    // Date range validation: must be future date
    const selectedDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('Booking date cannot be in the past.');
      return;
    }

    if (!preferredTime) {
      setError('Please select a preferred time slot.');
      return;
    }

    setIsSubmitting(true);

    let targetDbServiceId = '';
    const activePkgName = cart[0].name;

    const matchingService = dbServices.find(
      s => s.name.toLowerCase().includes(activePkgName.toLowerCase()) ||
        activePkgName.toLowerCase().includes(s.name.toLowerCase()) ||
        s.category.toLowerCase().includes(activeCategory.toLowerCase())
    );

    if (matchingService) {
      targetDbServiceId = matchingService._id;
    } else if (dbServices.length > 0) {
      targetDbServiceId = dbServices[0]._id;
    } else {
      targetDbServiceId = 'mock-serv-item';
    }

    let finalNotes = `${cart[0].name} (GoMechanic Package). Notes: ${notes}`;

    // Append Wizard User Details to notes if present
    if (wizardUserDetails.name) {
      finalNotes = `Customer: ${wizardUserDetails.name} | Email: ${wizardUserDetails.email} | Phone: ${wizardUserDetails.phone} | Veh#: ${wizardUserDetails.vehicleNumber}\nOther Issues: ${wizardUserDetails.otherIssues}\n---\n${finalNotes}`;
    }

    try {

      const payload = {
        vehicleId: selectedVehicleId,
        serviceId: targetDbServiceId,
        garageId: selectedGarageId,
        bookingDate,
        preferredTime,
        notes: finalNotes
      };

      const res = await axios.post('/services/bookings', payload);
      if (res.data.success) {
        setSuccess('Your service request has been successfully submitted!');
        setCart([]);
        setNotes('');
        setBookingDate('');
        setSelectedGarageId('');
        setTimeout(() => setSuccess(''), 4500);
      }
    } catch (err) {
      setSuccess('Service request scheduled locally.');
      setCart([]);
      setNotes('');
      setBookingDate('');
      setSelectedGarageId('');
      setTimeout(() => setSuccess(''), 4500);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual vehicle registration / edit handlers
  const handleOpenAddVehicle = () => {
    setEditVehicleId(null);
    setMakeInput('');
    setModelInput('');
    setYearInput(new Date().getFullYear());
    setPlateInput('');
    setVinInput('');
    setMileageInput(0);
    setShowAddVehicleModal(true);
  };

  const handleOpenEditVehicle = (v) => {
    setEditVehicleId(v._id);
    setMakeInput(v.make);
    setModelInput(v.model);
    setYearInput(v.year);
    setPlateInput(v.licensePlate);
    setVinInput(v.vin || '');
    setMileageInput(v.mileage);
    setShowAddVehicleModal(true);
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      make: makeInput,
      model: modelInput,
      year: yearInput,
      licensePlate: plateInput,
      vin: vinInput,
      mileage: mileageInput
    };

    try {
      if (editVehicleId) {
        const res = await axios.put(`/vehicles/${editVehicleId}`, payload);
        if (res.data.success) {
          setVehicles(prev => prev.map(v => v._id === editVehicleId ? res.data.data : v));
          setSuccess('Vehicle updated successfully!');
        }
      } else {
        const res = await axios.post('/vehicles', payload);
        if (res.data.success) {
          const newVeh = res.data.data;
          setVehicles(prev => [newVeh, ...prev]);
          setSelectedVehicleId(newVeh._id); // Auto select new vehicle
          setSuccess('Vehicle registered successfully!');
        }
      }
      setShowAddVehicleModal(false);
      setTimeout(() => setSuccess(''), 3500);
    } catch (err) {
      const mockSavedVeh = {
        _id: editVehicleId || 'mock-man-' + Date.now(),
        status: editVehicleId ? (vehicles.find(veh => veh._id === editVehicleId)?.status || 'Approved') : 'Pending',
        ...payload
      };
      if (editVehicleId) {
        setVehicles(prev => prev.map(v => v._id === editVehicleId ? mockSavedVeh : v));
        setSuccess('Vehicle details modified locally.');
      } else {
        setVehicles(prev => [mockSavedVeh, ...prev]);
        setSelectedVehicleId(mockSavedVeh._id);
        setSuccess('Vehicle registered locally.');
      }
      setShowAddVehicleModal(false);
      setTimeout(() => setSuccess(''), 3500);
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      if (id.startsWith('mock-')) {
        setVehicles(prev => prev.filter(v => v._id !== id));
        if (selectedVehicleId === id) {
          setSelectedVehicleId('');
        }
        setSuccess('Mock vehicle deleted locally');
        return;
      }
      const res = await axios.delete(`/vehicles/${id}`);
      if (res.data.success) {
        setVehicles(prev => prev.filter(v => v._id !== id));
        if (selectedVehicleId === id) {
          setSelectedVehicleId('');
        }
        setSuccess('Vehicle deleted successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      if (id.startsWith('mock-')) {
        setActiveBookings(prev => prev.filter(b => b._id !== id));
        setSuccess('Mock booking cancelled locally');
        return;
      }
      const res = await axios.delete(`/services/bookings/${id}`);
      if (res.data.success) {
        setActiveBookings(prev => prev.filter(b => b._id !== id));
        setSuccess('Booking cancelled successfully');
      }
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  // Helper variables for rendering
  const activeVehicle = vehicles.find(v => v._id === selectedVehicleId);
  const activeVehicleName = activeVehicle
    ? `${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.licensePlate})`
    : 'No Car Selected';

  const filteredBrands = MANUFACTURERS.filter(b =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredModels = (wizardBrand ? MODELS[wizardBrand.id] || [] : []).filter(m =>
    m.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const displayedGarages = selectedGarageFilter ? garages.filter(g => g._id === selectedGarageFilter) : garages;

  return (
    <div className="space-y-8 pb-16 bg-white min-h-screen font-sans p-2 sm:p-6 rounded-3xl relative overflow-hidden">

      {/* 1. TOP HERO/SERVICE HEADER CARD */}
      <div className="bg-[#111827] p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-gray-200">
        <div className="space-y-3 text-center md:text-left z-10">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="p-3 bg-[#FF3B30] rounded-2xl shadow-lg shadow-[#FF3B30]/30">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Smart Services & Diagnostics</h1>
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Book professional OEM packages and manage your digital garage
          </p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center z-10">
          <button
            onClick={() => setShowManageModal(true)}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest bg-white text-[#111827] hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            Manage Garage ({activeBookings.length})
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border-l-4 border-[#FF3B30] text-[#FF3B30] text-sm font-bold flex items-center gap-3 shadow-sm">
          <Info className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold flex items-center gap-3 shadow-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* 2. HORIZONTAL SERVICE CATEGORY TABS */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all duration-300 whitespace-nowrap shadow-sm border-2 ${isActive
                ? 'bg-[#111827] text-white border-[#111827]'
                : 'bg-white border-gray-200 text-gray-500 hover:text-[#111827] hover:border-gray-300'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF3B30]' : 'text-gray-400'}`} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 3. MAIN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 gap-8">

        {/* 4. LEFT SIDE - SERVICE PACKAGES SECTION */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl space-y-6 shadow-sm border border-gray-100">

            {/* LOCATION FILTER ABOVE PACKAGES */}
            {garages.length > 0 && (
              <div className="flex items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#FF3B30] flex-shrink-0" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Filter By Location:</span>
                </div>
                <select
                  value={selectedGarageFilter}
                  onChange={(e) => {
                    setSelectedGarageFilter(e.target.value);
                    localStorage.setItem('selectedGarageFilter', e.target.value);
                  }}
                  className="flex-1 max-w-xs px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold text-[#111827] focus:border-[#FF3B30] outline-none shadow-sm transition-colors cursor-pointer"
                >
                  {garages
                    .filter(g => {
                      const city = g.location.split(',').pop().trim().toLowerCase();
                      return city === 'mangalore' || city === 'kasaragod';
                    })
                    .filter((g, index, self) => {
                      const city = g.location.split(',').pop().trim().toLowerCase();
                      return index === self.findIndex(v => v.location.split(',').pop().trim().toLowerCase() === city);
                    })
                    .map(g => (
                    <option key={g._id} value={g._id}>
                      {g.location.split(',').pop().trim()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-black text-[#111827] text-xl">
                Available {CATEGORIES.find(c => c.id === activeCategory)?.name} Packages
              </h3>

            </div>

            {/* Hint message if no car chosen */}
            {!selectedVehicleId && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold flex items-center gap-3 shadow-sm">
                <Info className="w-5 h-5 flex-shrink-0 text-[#FF3B30]" />
                Please select or link a car on the right panel to activate package selection.
              </div>
            )}

            <div className="space-y-5">
              {(PACKAGES[activeCategory] || []).map(pkg => {
                const isSelected = cart.some(item => item.id === pkg.id);
                const currentGarage = selectedGarageFilter ? garages.find(g => g._id === selectedGarageFilter) : garages[0];
                const selectedCity = currentGarage ? currentGarage.location.split(',').pop().trim() : '';
                const displayLocation = pkg.garageLocation.includes(',')
                  ? `${pkg.garageLocation.split(',')[0]}, ${selectedCity}`
                  : `${pkg.garageLocation}, ${selectedCity}`;
                return (
                  <div
                    key={pkg.id}
                    className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 grid grid-cols-1 md:grid-cols-12 border ${isSelected ? 'border-[#FF3B30] shadow-[0_4px_20px_rgba(255,59,48,0.15)] ring-1 ring-[#FF3B30]' : 'border-gray-200 shadow-sm hover:shadow-md'
                      }`}
                  >
                    {/* Image / Thumbnail Area */}
                    <div className="md:col-span-4 relative h-48 md:h-full bg-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover mix-blend-multiply p-4 transition-transform duration-500 hover:scale-105"
                      />
                      {pkg.tag && (
                        <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest text-white bg-[#111827] px-2.5 py-1 rounded-md shadow-md">
                          {pkg.tag}
                        </span>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 bg-[#111827]/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 shadow-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-[#FF3B30]" />
                            <p className="text-xs font-bold text-white">{pkg.mechanicName}</p>
                          </div>
                          <p className="text-[10px] text-gray-300 font-mono">+91 {pkg.mechanicPhone}</p>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#FF3B30] mt-1 border-t border-white/10 pt-1">
                          {pkg.garageName}
                        </p>
                      </div>
                    </div>

                    {/* Core Package Details */}
                    <div className="md:col-span-8 p-6 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-lg font-black text-[#111827] leading-tight">{pkg.name}</h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">{pkg.desc}</p>

                        {/* Bullet point list */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                          {pkg.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                              <CheckCircle2 className="w-4 h-4 text-[#FF3B30] flex-shrink-0" />
                              <span className="truncate">{bullet}</span>
                            </div>
                          ))}
                        </div>

                        {/* Location and Address for Categories */}
                        {pkg.garageName && (
                          <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Available At Location:</span>
                            <div className="space-y-1.5">
                              <div className="text-xs text-gray-600 flex flex-col gap-1 leading-relaxed font-medium bg-gray-50 p-2 rounded-lg">
                                <div>
                                  <span className="font-bold text-[#111827]">{pkg.garageName}: </span>
                                  <span>{displayLocation}</span>
                                </div>
                                <iframe
                                  title="garage-location"
                                  width="100%"
                                  height="150"
                                  style={{ border: 0, borderRadius: '0.5rem', marginTop: '8px' }}
                                  loading="lazy"
                                  allowFullScreen
                                  src={`https://www.google.com/maps?q=${encodeURIComponent(pkg.garageName + ' ' + displayLocation)}&output=embed`}
                                ></iframe>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                        <span className="text-xs font-bold text-gray-500">Warranty: <strong className="text-[#111827]">{pkg.warranty}</strong></span>
                        <button
                          disabled={isSelected}
                          onClick={() => {
                            setPendingPackage(pkg);
                            setSelectedVehicleId(''); // Always force the full wizard
                            setWizardStep(1);
                            setShowUserFormModal(true);
                          }}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shadow-sm ${isSelected
                            ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-default'
                            : 'bg-white text-[#111827] hover:bg-[#111827] hover:text-white border-2 border-[#111827]'
                            }`}
                        >
                          {isSelected ? 'Selected' : 'Choose Car'}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── GARAGE MANAGEMENT MODAL ─────────────────── */}
      {showManageModal && (
        <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-xl text-[#111827] flex items-center gap-3">
                <Car className="text-[#FF3B30] w-6 h-6" />
                Registered Garage
              </h3>
              <button
                onClick={() => setShowManageModal(false)}
                className="text-gray-400 hover:text-[#111827] p-2 rounded-xl bg-white hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-black text-[#111827] uppercase tracking-widest border-b border-gray-100 pb-2">Active Service Bookings</h4>
                {activeBookings.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 p-6">
                    <Car className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-sm font-black text-[#111827]">No Active Services</h4>
                    <p className="text-xs font-bold text-gray-500 mt-1">Book a package to see live tracking here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                    {activeBookings.map(b => {
                      const steps = ['Pending', 'Approved', 'In Progress', 'Completed'];
                      const currentStepIndex = steps.indexOf(b.status);
                      const isCompleted = b.status === 'Completed';

                      return (
                        <div key={b._id} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-5">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] font-black font-mono bg-gray-100 text-[#111827] border border-gray-200 px-2.5 py-1 rounded-md shadow-sm">
                                {b.vehicle?.licensePlate || 'N/A'}
                              </span>
                              <h4 className="text-lg font-black text-[#111827] mt-3 leading-tight">
                                {b.vehicle?.make} {b.vehicle?.model}
                              </h4>
                              <p className="text-[11px] font-bold text-gray-500 mt-1.5 uppercase tracking-widest">
                                Garage: {b.garage?.name || 'Assigned Garage'}
                              </p>
                              <p className="text-[11px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">
                                Package: {b.service?.name || 'Service Package'}
                              </p>
                              <p className="text-[11px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">
                                Date: {new Date(b.bookingDate).toLocaleDateString()} | Time: {b.preferredTime}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteBooking(b._id)}
                                className="p-2 rounded-lg bg-red-50 text-red-500 hover:text-white hover:bg-red-500 border border-red-100 shadow-sm transition-colors"
                                title="Cancel Booking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* 4-Step Live Service Tracker */}
                          <div className="mt-3 pt-4 border-t border-gray-100 space-y-3">
                            <div className="flex justify-between items-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
                              <span>Status</span>
                              <span className={`${isCompleted ? 'text-green-600' : b.status === 'Rejected' ? 'text-red-600' : 'text-orange-500'
                                }`}>
                                {b.status || 'Pending'}
                              </span>
                            </div>

                            <div className="relative pt-4 pb-2">
                              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full"></div>
                              <div
                                className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 z-0 rounded-full transition-all duration-500 ${b.status === 'Rejected' ? 'bg-red-500 w-full' : 'bg-[#111827]'
                                  }`}
                                style={{ width: b.status === 'Rejected' ? '100%' : `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                              ></div>

                              <div className="flex justify-between relative z-10">
                                {steps.map((step, idx) => {
                                  const stepPassed = idx <= currentStepIndex;
                                  return (
                                    <div key={step} className="flex flex-col items-center">
                                      <div className={`w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center text-[10px] font-black shadow-sm ${stepPassed
                                        ? 'border-[#111827] text-[#111827]'
                                        : 'border-gray-200 text-gray-300'
                                        }`}>
                                        {stepPassed ? '✓' : '•'}
                                      </div>
                                      <span className={`text-[8px] font-black uppercase tracking-widest absolute -bottom-4 ${stepPassed ? 'text-[#111827]' : 'text-gray-400'
                                        }`}>
                                        {step}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD/EDIT VEHICLE MODAL ─────────────────── */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-xl text-[#111827]">
                {editVehicleId ? 'Edit Vehicle Info' : 'Register Vehicle Form'}
              </h3>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="text-gray-400 hover:text-[#111827] p-2 rounded-xl bg-white hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Make / Brand
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Toyota"
                    value={makeInput}
                    onChange={(e) => setMakeInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Corolla"
                    value={modelInput}
                    onChange={(e) => setModelInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Year Model
                  </label>
                  <input
                    type="number"
                    required
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    value={yearInput}
                    onChange={(e) => setYearInput(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    License Plate
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. KA-03-MM-1234"
                    value={plateInput}
                    onChange={(e) => setPlateInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-black font-mono text-[#111827] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  VIN (Vehicle Identification Number)
                </label>
                <input
                  type="text"
                  placeholder="17-digit character string (Optional)"
                  maxLength={17}
                  value={vinInput}
                  onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-black font-mono text-[#111827] transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Current Mileage (km)
                </label>
                <input
                  type="number"
                  min={0}
                  value={mileageInput}
                  onChange={(e) => setMileageInput(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all"
                />
              </div>

              <div className="flex gap-4 justify-end pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-xs font-black uppercase tracking-widest text-gray-600 hover:text-[#111827] hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#111827] hover:bg-[#FF3B30] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-md"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── USER DETAILS MODAL ─────────────────────── */}
      {showUserFormModal && (
        <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-black text-xl text-[#111827]">
                  Book {pendingPackage?.name}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  Step {wizardStep} of 3: {wizardStep === 1 ? 'Select Brand' : wizardStep === 2 ? 'Select Model' : 'User Details'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUserFormModal(false);
                  setPendingPackage(null);
                  setWizardStep(1);
                  setWizardBrand(null);
                  setWizardModel('');
                }}
                className="text-gray-400 hover:text-[#111827] p-2 rounded-xl bg-white hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search manufacturer..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1 scrollbar-hide py-1">
                    {filteredBrands.map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleSelectBrand(b)}
                        className="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-gray-100 hover:border-[#111827] bg-white hover:bg-gray-50 transition-all shadow-sm"
                      >
                        <div className={`w-10 h-10 rounded-full ${b.color} flex items-center justify-center text-white text-[11px] font-black mb-2 shadow-sm`}>
                          {b.initials}
                        </div>
                        <span className="text-[10px] font-black text-[#111827] text-center uppercase tracking-widest truncate w-full">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="text-xs font-bold text-gray-500 hover:text-[#111827] flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand: <strong className="text-[#111827]">{wizardBrand?.name}</strong></span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search models..."
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1 scrollbar-hide py-1">
                    {filteredModels.map(m => (
                      <button
                        key={m}
                        onClick={() => handleSelectModel(m)}
                        className="p-3.5 rounded-xl border-2 border-gray-100 hover:border-[#111827] bg-white text-left text-xs font-black text-[#111827] transition-all shadow-sm"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="text-xs font-bold text-gray-500 hover:text-[#111827] flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Model: <strong className="text-[#111827]">{wizardBrand?.name} {wizardModel}</strong></span>
                  </div>

                  {/* Target Garage Readonly Badge */}
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#FF3B30]" />
                    <div>
                      <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Garage</span>
                      <span className="font-bold text-sm text-[#111827]">
                        {pendingPackage?.garageName || (selectedGarageFilter
                          ? garages.find(g => g._id === selectedGarageFilter)?.name || 'Unknown'
                          : garages.length > 0 ? garages[0].name : 'No Garage Selected')}
                      </span>
                    </div>
                  </div>

                  {wizardError && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold shadow-sm">
                      {wizardError}
                    </div>
                  )}

                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={wizardUserDetails.name}
                        onChange={(e) => setWizardUserDetails({ ...wizardUserDetails, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                        <input
                          type="email"
                          value={wizardUserDetails.email}
                          onChange={(e) => setWizardUserDetails({ ...wizardUserDetails, email: e.target.value })}
                          placeholder="mail@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone</label>
                        <input
                          type="tel"
                          value={wizardUserDetails.phone}
                          onChange={(e) => setWizardUserDetails({ ...wizardUserDetails, phone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Vehicle Number</label>
                      <input
                        type="text"
                        value={wizardUserDetails.vehicleNumber}
                        onChange={(e) => setWizardUserDetails({ ...wizardUserDetails, vehicleNumber: e.target.value })}
                        placeholder="e.g. KL.14.AA.1233"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all uppercase placeholder:normal-case"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                          Target Date
                        </label>
                        <input
                          type="date"
                          required
                          min={getLocalTodayDateStr()}
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                          Time Slot
                        </label>
                        <select
                          required
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-colors"
                        >
                          {availableTimeSlots.map(ts => (
                            <option key={ts} value={ts} disabled={ts === 'No slots available today'}>{ts}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Other Issues (Optional)</label>
                      <textarea
                        value={wizardUserDetails.otherIssues}
                        onChange={(e) => setWizardUserDetails({ ...wizardUserDetails, otherIssues: e.target.value })}
                        placeholder="Describe any other problems..."
                        rows="2"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      {!wizardUserDetails.showPickDrop ? (
                        <div className="flex flex-col items-start gap-2">
                          <label className="text-xs font-bold text-[#111827]">Need Pick & Drop service?</label>
                          <button
                            type="button"
                            onClick={() => setWizardUserDetails({ ...wizardUserDetails, showPickDrop: true })}
                            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-black uppercase tracking-widest text-[#111827] transition-colors"
                          >
                            Add Pick & Drop
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Car Pickup Location</label>
                            <button
                              type="button"
                              onClick={() => setWizardUserDetails({ ...wizardUserDetails, showPickDrop: false, pickupLocation: '' })}
                              className="text-xs text-[#FF3B30] font-bold hover:underline"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={wizardUserDetails.pickupLocation}
                              onChange={(e) => setWizardUserDetails({ ...wizardUserDetails, pickupLocation: e.target.value })}
                              placeholder="Enter pickup address..."
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#FF3B30] outline-none text-sm font-bold text-[#111827] transition-all"
                            />
                            <button
                              type="button"
                              disabled={wizardUserDetails.isLocating}
                              onClick={() => {
                                if (navigator.geolocation) {
                                  setWizardUserDetails({ ...wizardUserDetails, isLocating: true });
                                  navigator.geolocation.getCurrentPosition(
                                    async (pos) => {
                                      let addr = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`;
                                      try {
                                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                                        const data = await res.json();
                                        if (data && data.display_name) {
                                          addr = `${data.display_name} (${addr})`;
                                        }
                                      } catch (err) { }
                                      setWizardUserDetails({ ...wizardUserDetails, pickupLocation: addr, isLocating: false });
                                    },
                                    () => {
                                      alert("GPS failed.");
                                      setWizardUserDetails({ ...wizardUserDetails, isLocating: false });
                                    }
                                  );
                                }
                              }}
                              className="whitespace-nowrap px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 text-[#FF3B30] text-sm font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                            >
                              <MapPin className="w-4 h-4" />
                              {wizardUserDetails.isLocating ? 'Locating...' : 'Use My Current Location'}
                            </button>
                          </div>

                          {wizardUserDetails.pickupLocation && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-xs font-bold text-green-600">Pickup location selected</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#111827] hover:bg-[#FF3B30] text-white text-sm font-black uppercase tracking-widest transition-all shadow-md disabled:opacity-50 mt-4"
                  >
                    {isSubmitting ? 'Processing...' : 'Register Car & Proceed'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
