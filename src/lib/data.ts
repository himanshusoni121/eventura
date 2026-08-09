// ============================================================
// Static Data — Eventura Premium Event Management
// ============================================================

export const siteConfig = {
  name: "Eventura",
  tagline: "Creating Extraordinary Experiences That Last Forever",
  description:
    "Luxury Event Planning & Management in Jodhpur, Rajasthan. From grand weddings to corporate galas, we craft unforgettable moments.",
  phone: "8279088558",
  whatsapp: "+918279088558",
  address: "Shikhargarh, Jodhpur, Rajasthan 342001",
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.6!2d73.024!3d26.297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE3JzQ5LjIiTiA3M8KwMDEnMjYuNCJF!5e0!3m2!1sen!2sin!4v1",
  officeHours: "Mon – Sat: 10:00 AM – 7:00 PM",
  serviceArea: "Jodhpur & All Rajasthan",
  social: {
    instagram: "https://www.instagram.com/himanshusoni_02/?hl=en",
    facebook: "https://facebook.com/eventura",
    youtube: "https://youtube.com/@eventura",
    linkedin: "https://linkedin.com/company/eventura",
  },
};

// ----- Navigation -----
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Plan Event", href: "/planner" },
  { label: "Contact", href: "/#contact" },
];

// ----- Services -----
export const services = [
  {
    title: "Wedding Planning",
    description:
      "From intimate ceremonies to grand celebrations, we orchestrate every detail of your dream wedding with impeccable precision.",
    icon: "Heart",
  },
  {
    title: "Corporate Events",
    description:
      "Elevate your brand with sophisticated corporate events, product launches, and conferences that leave lasting impressions.",
    icon: "Building2",
  },
  {
    title: "Birthday Parties",
    description:
      "Transform milestones into magical celebrations with bespoke themes, stunning décor, and unforgettable entertainment.",
    icon: "Cake",
  },
  {
    title: "College Festivals",
    description:
      "Bring campus events to life with electrifying stage shows, concerts, and creative festival productions.",
    icon: "GraduationCap",
  },
  {
    title: "Cultural Programs",
    description:
      "Celebrate heritage and tradition with beautifully curated cultural events that honor our rich Rajasthani legacy.",
    icon: "Palette",
  },
  {
    title: "Stage Decoration",
    description:
      "Breathtaking stage designs that set the perfect backdrop — from floral extravaganzas to modern LED installations.",
    icon: "Sparkles",
  },
  {
    title: "Sound & Lighting",
    description:
      "State-of-the-art audio-visual solutions that create immersive experiences and set the mood for every moment.",
    icon: "Music",
  },
  {
    title: "Photography",
    description:
      "Capture every emotion and detail with our team of award-winning photographers using the latest equipment.",
    icon: "Camera",
  },
  {
    title: "Videography",
    description:
      "Cinematic storytelling that turns your events into timeless films you'll cherish for generations.",
    icon: "Video",
  },
  {
    title: "Catering",
    description:
      "Exquisite culinary experiences featuring world-class chefs, diverse cuisines, and impeccable service.",
    icon: "UtensilsCrossed",
  },
  {
    title: "Entertainment",
    description:
      "From live bands to celebrity performers, we curate entertainment that keeps your guests enthralled all night.",
    icon: "PartyPopper",
  },
  {
    title: "Event Production",
    description:
      "End-to-end production management including logistics, vendor coordination, and flawless on-ground execution.",
    icon: "Clapperboard",
  },
];

// ----- Statistics -----
export const stats = [
  { label: "Events Completed", value: 50, suffix: "+" },
  { label: "Happy Clients", value: 45, suffix: "+" },
  { label: "Cities Served", value: 7, suffix: "+" },
  { label: "Professional Team", value: 25, suffix: "+" },
  { label: "Years of Experience", value: 2, suffix: "+" },
];

// ----- Portfolio -----
export type PortfolioCategory =
  | "all"
  | "destination"
  | "mehndi"
  | "reception"
  | "phere"
  | "baraat";

export interface PortfolioItem {
  id: number;
  title: string;
  category: PortfolioCategory;
  image: string;
  description: string;
  location?: string;
  date?: string;
  servicesProvided?: string[];
  clientFeedback?: string;
  technologies?: string[];
  gallery?: string[];
}

export const portfolioCategories: { label: string; value: PortfolioCategory }[] =
  [
    { label: "All", value: "all" },
    { label: "Destination", value: "destination" },
    { label: "Mehndi", value: "mehndi" },
    { label: "Reception", value: "reception" },
    { label: "Phere", value: "phere" },
    { label: "Baraat", value: "baraat" },
  ];

// ----- Homepage Slider Items (Original Portfolio Images preserved strictly for top continuous slider) -----
export const marqueeItemsList = [
  {
    id: 101,
    title: "Marugarh Heritage Wedding",
    category: "Weddings",
    image: "/images/marugarh_event.jpg",
    description: "A magnificent wedding celebration at a heritage palace in Jodhpur.",
  },
  {
    id: 102,
    title: "Tech Summit Gala 2025",
    category: "Corporate",
    image: "/images/teach.jpeg",
    description: "An elite corporate conference with world-class stage production.",
  },
  {
    id: 103,
    title: "Royal Golden Birthday Bash",
    category: "Birthdays",
    image: "/images/birthday.jpg",
    description: "An enchanting 50th birthday celebration with a gold theme.",
  },
  {
    id: 104,
    title: "Rajasthani Folk Festival",
    category: "Cultural",
    image: "/images/folk.jpg",
    description: "A vibrant cultural festival celebrating Rajasthani folk traditions.",
  },
  {
    id: 105,
    title: "University Youth Fest Concert",
    category: "Cultural",
    image: "/images/fest.jpg",
    description: "An energetic college festival concert with live performances.",
  },
  {
    id: 106,
    title: "Annual Corporate Awards Gala",
    category: "Corporate",
    image: "/images/show.jpg",
    description: "A prestigious awards night celebrating business excellence.",
  },
  {
    id: 107,
    title: "Garden Floral Reception",
    category: "Weddings",
    image: "/images/reception.png",
    description: "An intimate garden reception with ethereal floral décor.",
  },
  {
    id: 108,
    title: "Engineering Arena Concert",
    category: "Cultural",
    image: "/images/social_chutney.png",
    description: "A high-octane rock concert production.",
  },
];

// ----- Portfolio Gallery (Exclusively 5 High-Quality Requested Events) -----
export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Palace Destination Wedding",
    category: "destination",
    image: "/images/venue.jpg",
    description: "An illuminated octagonal royal gazebo mandap at night set in a grand palace courtyard with gold warm lanterns.",
    location: "Umaid Bhawan Palace, Jodhpur",
    date: "December 2024",
    servicesProvided: ["Palace Destination Planning", "Architectural Illumination", "Royal Hospitality"],
    clientFeedback: "Eventura transformed our destination wedding into a majestic fairy tale. The night illuminations were world-class!",
    technologies: ["Custom Ambient Illumination", "Heritage Decor Mapping"],
    gallery: ["/images/venue.jpg"],
  },
  {
    id: 2,
    title: "Royal Mehndi Ceremony",
    category: "mehndi",
    image: "/images/mehndi.jpg",
    description: "Intricate bridal & bridesmaid henna design setup with traditional silk attires and royal embellishments.",
    location: "Ajit Bhawan, Jodhpur",
    date: "March 2025",
    servicesProvided: ["Mehndi Lounge Setup", "Artist Management", "Floral Accents"],
    clientFeedback: "The Mehndi decor and arrangement was full of authentic tradition and color. Our guests loved every minute!",
    technologies: ["Custom Soft Lighting", "Aesthetic Lounge Modulars"],
    gallery: ["/images/mehndi.jpg"],
  },
  {
    id: 3,
    title: "Grand Reception Dance",
    category: "reception",
    image: "/images/reception.jpg",
    description: "A romantic couple stage performance in gold lehenga and black tuxedo with a starry lights backdrop and fog effects.",
    location: "The Oberoi Udaivilas, Udaipur",
    date: "November 2024",
    servicesProvided: ["Stage Production", "Sparkler FX", "Audio Engineering"],
    clientFeedback: "Our reception dance looked straight out of a movie! Unbelievable production quality by Eventura.",
    technologies: ["Low Fog FX", "Starry LED Backdrop"],
    gallery: ["/images/reception.jpg"],
  },
  {
    id: 4,
    title: "Royal Floral Phere Mandap",
    category: "phere",
    image: "/images/phere.jpg",
    description: "Bespoke four-pillar floral canopy mandap with bride in traditional red lehenga and groom in beige sherwani during Phere.",
    location: "Taj Hari Mahal, Jodhpur",
    date: "January 2025",
    servicesProvided: ["Phere Mandap Styling", "Fresh Floral Architecture", "Ritual Coordination"],
    clientFeedback: "The Phere setup was breathtaking. Fresh flowers, sacred aura, and perfect timing for every ritual.",
    technologies: ["Fresh Floral Preservation Systems", "Architectural Lighting"],
    gallery: ["/images/phere.jpg"],
  },
  {
    id: 5,
    title: "Royal Baraat Procession",
    category: "baraat",
    image: "/images/baarat.jpg",
    description: "A grand groom baraat entry featuring vintage cars, royal dhol, brass bands, and festive pyro celebrations.",
    location: "Indana Palace, Jodhpur",
    date: "February 2025",
    servicesProvided: ["Baraat Escort", "Vintage Car Coordination", "Pyro FX & Dhol Band"],
    clientFeedback: "The Baraat entry was royal, loud, and full of energy! Everything ran smoothly right up to the mandap gates.",
    technologies: ["Wireless Sound Systems", "Baraat Escort Protocol"],
    gallery: ["/images/baarat.jpg"],
  },
];

// ----- Why Choose Us -----
export const whyChooseUs = [
  {
    title: "Attention to Detail",
    description:
      "Every element is meticulously planned, from the grandest setup to the smallest detail.",
    icon: "Eye",
  },
  {
    title: "On-Time Delivery",
    description:
      "We pride ourselves on punctuality — your event starts exactly when planned.",
    icon: "Clock",
  },
  {
    title: "Creative Excellence",
    description:
      "Our award-winning creative team brings innovative ideas that set trends in the industry.",
    icon: "Lightbulb",
  },
  {
    title: "Budget Friendly",
    description:
      "Premium quality doesn't mean premium prices. We offer exceptional value at every level.",
    icon: "IndianRupee",
  },
  {
    title: "End-to-End Service",
    description:
      "From concept to cleanup, we handle everything so you can enjoy every moment stress-free.",
    icon: "Layers",
  },
  {
    title: "24/7 Support",
    description:
      "Our dedicated team is available round the clock to ensure seamless event execution.",
    icon: "Headphones",
  },
];

// ----- Process Steps -----
export const processSteps = [
  {
    step: 1,
    title: "Consultation",
    description:
      "We begin with a personalized consultation to understand your vision, preferences, and budget.",
    icon: "MessageCircle",
  },
  {
    step: 2,
    title: "Planning",
    description:
      "Our team crafts a detailed event plan with timelines, vendor selections, and creative concepts.",
    icon: "ClipboardList",
  },
  {
    step: 3,
    title: "Designing",
    description:
      "From mood boards to 3D renderings, we bring your event to life before it even begins.",
    icon: "PenTool",
  },
  {
    step: 4,
    title: "Vendor Coordination",
    description:
      "We coordinate with our network of premium vendors to ensure every element is world-class.",
    icon: "Users",
  },
  {
    step: 5,
    title: "Event Execution",
    description:
      "On the big day, our team ensures flawless execution with real-time management of every detail.",
    icon: "Rocket",
  },
  {
    step: 6,
    title: "Celebration",
    description:
      "Sit back and celebrate while we handle everything — creating memories that last forever.",
    icon: "Trophy",
  },
];

// ----- Testimonials -----
export const testimonials = [
  {
    id: 1,
    name: "Priya & Vikram Rathore",
    role: "Wedding",
    quote:
      "Eventura transformed our wedding into a fairy tale. Every detail was perfect — the décor, the coordination, the entertainment. Our guests are still talking about it!",
    rating: 5,
    image: "/images/portfolio-destination.jpg",
  },
  {
    id: 2,
    name: "Rajesh Sharma",
    role: "Corporate Event",
    quote:
      "The professionalism and creativity of the Eventura team is unmatched. Our annual conference was executed flawlessly, and the production quality was world-class.",
    rating: 5,
    image: "/images/marugarh_event.jpg",
  },
  {
    id: 3,
    name: "Anjali Mehta",
    role: "Birthday Party",
    quote:
      "My daughter's birthday party was absolutely magical! The theme, decorations, and activities were beyond anything I could have imagined. Thank you, Eventura!",
    rating: 5,
    image: "/images/birthday.jpg",
  },
  {
    id: 4,
    name: "Dr. Suresh Joshi",
    role: "Cultural Program",
    quote:
      "Eventura brought our cultural festival to life with incredible stage design and impeccable management. They truly understand the spirit of Rajasthani heritage.",
    rating: 5,
    image: "/images/birthday.jpg",
  },
];

// ----- FAQ -----
export const faqs = [
  {
    question: "How far in advance should I book my event?",
    answer:
      "We recommend booking at least 3-6 months in advance for weddings and large events, and 1-2 months for smaller events. However, we can accommodate shorter timelines based on availability.",
  },
  {
    question: "Do you handle destination events outside Jodhpur?",
    answer:
      "Absolutely! While we're based in Jodhpur, we manage events across all of Rajasthan, including Udaipur, Jaipur, Jaisalmer, and more. We're expanding our services pan-India.",
  },
  {
    question: "What is your pricing structure?",
    answer:
      "Our pricing is customized based on the type of event, guest count, venue, and services required. We offer packages at various price points and provide a free consultation to discuss your budget.",
  },
  {
    question: "Can you work within a specific budget?",
    answer:
      "Yes! We pride ourselves on delivering exceptional value at every budget level. During our consultation, we'll help you prioritize elements that matter most to create a stunning event within your budget.",
  },
  {
    question: "Do you provide venue recommendations?",
    answer:
      "We have partnerships with the finest venues in Rajasthan — from heritage palaces and luxury hotels to unique outdoor locations. We'll help you find the perfect setting for your vision.",
  },
  {
    question: "What makes Eventura different from other event planners?",
    answer:
      "Our attention to detail, creative excellence, and end-to-end service set us apart. We treat every event as a unique story to be told, bringing together world-class design, premium vendors, and flawless execution.",
  },
  {
    question: "Do you handle permits and legalities?",
    answer:
      "Yes, we take care of all necessary permits, licenses, and legal requirements for your event, including sound permissions, fire safety clearances, and venue compliance.",
  },
  {
    question: "Can I customize every detail of my event?",
    answer:
      "Absolutely! We believe every event should be as unique as the people hosting it. From custom themes and personalized décor to unique entertainment and bespoke menus — everything is tailored to your vision.",
  },
];

// ----- Event Types for Estimator -----
export const eventTypes = [
  { label: "Wedding", basePrice: 500000 },
  { label: "Engagement / Ring Ceremony", basePrice: 200000 },
  { label: "Reception", basePrice: 350000 },
  { label: "Sangeet / Mehendi", basePrice: 250000 },
  { label: "Corporate Event", basePrice: 300000 },
  { label: "Product Launch", basePrice: 350000 },
  { label: "Conference / Seminar", basePrice: 250000 },
  { label: "Birthday Party", basePrice: 100000 },
  { label: "Anniversary Celebration", basePrice: 150000 },
  { label: "College Festival", basePrice: 200000 },
  { label: "Cultural Program", basePrice: 150000 },
  { label: "Charity Gala / Fundraiser", basePrice: 400000 },
  { label: "Other", basePrice: 150000 },
];
