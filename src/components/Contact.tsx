"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks";
import { fadeInLeft, fadeInRight } from "@/lib/animations";
import { siteConfig, eventTypes } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Phone, MessageCircle, Mail, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { threshold: 0.1 });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const date = formData.get("date") as string;
    const eventType = formData.get("eventType") as string;
    const guests = formData.get("guests") as string;
    const message = formData.get("message") as string;

    const whatsappMessage = `*New Inquiry from ${name}*\n\n*Phone:* ${phone}\n*Date:* ${date || 'Not specified'}\n*Event Type:* ${eventType || 'Not specified'}\n*Guests:* ${guests || 'Not specified'}\n\n*Message:*\n${message}`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
    setIsSuccess(true);
    e.currentTarget.reset();
    
    // Reset after 5 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <section id="contact" ref={ref} className="section-padding bg-[var(--bg)]">
      <div className="container-custom">
        <SectionHeading 
          title="Get In Touch" 
          subtitle="Contact Us" 
          centered 
        />

        <div className="grid lg:grid-cols-2 gap-12 mt-12">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInLeft}
          >
            <div className="themed-card p-8 md:p-10 relative overflow-hidden">
              {isSuccess ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--card-bg)] z-10 p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-20 h-20 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-6 text-[#D4AF37]"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    Thank you for reaching out. Our team will get back to you within 24 hours to discuss your event.
                  </p>
                </div>
              ) : null}
              
              <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-6">
                Request a Quote
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Full Name</label>
                    <input type="text" name="name" required placeholder="John Doe" className="themed-input" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Phone Number</label>
                    <input type="tel" name="phone" required placeholder="+91 98765 43210" className="themed-input" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Event Date</label>
                    <input type="date" name="date" className="themed-input" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Event Type</label>
                    <select name="eventType" className="themed-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238a8a9a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:0.75rem]">
                      <option value="" disabled defaultValue="">Select Event Type</option>
                      {eventTypes.map((type, i) => (
                        <option key={i} value={type.label}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Estimated Guests</label>
                    <select name="guests" className="themed-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238a8a9a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:0.75rem]">
                      <option value="" disabled defaultValue="">Select Guest Count</option>
                      <option value="50-100">50 - 100</option>
                      <option value="100-250">100 - 250</option>
                      <option value="250-500">250 - 500</option>
                      <option value="500-1000">500 - 1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Message</label>
                  <textarea 
                    name="message"
                    rows={4} 
                    required 
                    placeholder="Tell us about your event vision..." 
                    className="themed-input resize-none"
                  />
                </div>
                
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center mt-2">
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInRight}
            className="flex flex-col h-full space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`} className="glass-card p-6 flex flex-col items-center text-center hover:border-[#D4AF37]/50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-4">
                  <Phone size={24} />
                </div>
                <h4 className="font-heading font-bold text-[var(--text-primary)] mb-1">Phone</h4>
                <p className="text-[var(--text-secondary)] text-sm">{siteConfig.phone}</p>
                <span className="text-[#D4AF37] text-xs font-semibold mt-2">Call Now</span>
              </a>
              
              <a href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="glass-card p-6 flex flex-col items-center text-center hover:border-[#25D366]/50 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] mb-4 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <MessageCircle size={24} />
                </div>
                <h4 className="font-heading font-bold text-[var(--text-primary)] mb-1">WhatsApp</h4>
                <p className="text-[var(--text-secondary)] text-sm">Chat with us</p>
                <span className="text-[#25D366] text-xs font-semibold mt-2">Open Chat</span>
              </a>
              

              
              <div className="glass-card p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--glass-border)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                  <Clock size={24} />
                </div>
                <h4 className="font-heading font-bold text-[var(--text-primary)] mb-1">Office Hours</h4>
                <p className="text-[var(--text-secondary)] text-sm">{siteConfig.officeHours}</p>
              </div>
            </div>
            
            {/* Map */}
            <div className="flex-grow glass-card overflow-hidden relative min-h-[200px] mt-2 group rounded-xl">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
              <iframe 
                src={siteConfig.mapUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale-[50%] contrast-[1.2] group-hover:grayscale-0 transition-all duration-1000 w-full h-full"
              />
              <div className="absolute bottom-4 left-4 z-20 glass-card bg-white/90 dark:bg-black/80 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-md">
                <MapPin size={16} className="text-[#D4AF37]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">{siteConfig.address}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
