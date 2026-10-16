"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { services, siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

type FormData = {
  name: string; phone: string; date: string; time: string; location: string;
  guests: string; venueType: string; venueBooked: string;
  budgetRange: string; customBudget: string;
  selectedServices: string[];
  additionalInfo: string;
};

const initialData: FormData = {
  name: "", phone: "", date: "", time: "", location: "",
  guests: "", venueType: "", venueBooked: "",
  budgetRange: "", customBudget: "",
  selectedServices: [],
  additionalInfo: "",
};

const budgetRanges = [
  "Under ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹2,50,000",
  "₹2,50,000 - ₹5,00,000",
  "₹5,00,000 - ₹10,00,000",
  "Above ₹10,00,000"
];

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = 6;

  const updateFields = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      handleNext();
    } else {
      setIsSubmitting(true);
      
      const { name, phone, date, time, location, guests, venueType, venueBooked, customBudget, budgetRange, selectedServices, additionalInfo } = formData;
      const budget = customBudget ? `₹${customBudget}` : budgetRange;
      
      const whatsappMessage = `*New Event Planning Request*\n\n*Contact Details:*\nName: ${name}\nPhone: ${phone}\n\n*Event Details:*\nDate: ${date}\nTime: ${time}\nLocation: ${location}\nGuests: ${guests}\nVenue: ${venueType} (Booked: ${venueBooked})\nBudget: ${budget}\n\n*Services:* ${selectedServices.length > 0 ? selectedServices.join(', ') : 'None'}\n\n*Additional Info:* ${additionalInfo || 'None'}`;
      
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');

      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 500);
    }
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  if (isSuccess) {
    return (
      <div className="section-padding bg-[var(--bg)] min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="w-24 h-24 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-8 text-[#D4AF37]"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="font-heading text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 text-center"
        >
          Request Submitted Successfully!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-[var(--text-secondary)] text-center max-w-lg mb-8"
        >
          Thank you for trusting Eventura. Our team is reviewing your requirements and will contact you within 24 hours with a custom proposal.
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          onClick={() => { setIsSuccess(false); setStep(1); setFormData(initialData); }}
          className="btn-outline"
        >
          <span>Plan Another Event</span>
        </motion.button>
      </div>
    );
  }

  return (
    <section className="section-padding bg-[var(--bg)] relative overflow-hidden">
      <div className="container-custom max-w-4xl mx-auto relative z-10">
        
        {/* Progress Indicator */}
        <div className="mb-8 sm:mb-12 relative">
          <div className="flex justify-between relative z-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div className={cn(
                  "w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500",
                  step >= i 
                    ? "bg-gradient-to-br from-[#D4AF37] to-[#b8962f] text-[#0B0B0F] shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                    : "bg-[var(--input-bg)] text-[var(--text-muted)] border border-[var(--glass-border)]"
                )}>
                  {step > i ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : i}
                </div>
                <span className={cn(
                  "text-[10px] sm:text-xs hidden md:block font-semibold transition-colors duration-500",
                  step >= i ? "text-[#D4AF37]" : "text-[var(--text-muted)]"
                )}>
                  {i === 1 && "Details"}
                  {i === 2 && "Guests"}
                  {i === 3 && "Budget"}
                  {i === 4 && "Services"}
                  {i === 5 && "Extras"}
                  {i === 6 && "Summary"}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-3.5 sm:top-5 left-0 w-full h-[2px] bg-[var(--input-bg)] -z-10" />
          <motion.div 
            className="absolute top-3.5 sm:top-5 left-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#b8962f] -z-10"
            initial={{ width: "0%" }}
            animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Form Area */}
        <div className="glass-card gradient-border p-4 sm:p-6 md:p-10 min-h-[380px] sm:min-h-[400px] relative">
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col h-full">
            <AnimatePresence mode="wait">
              
              {step === 1 && (
                <motion.div key="step1" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow space-y-4 sm:space-y-6">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6">1. Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Full Name *</label>
                      <input required type="text" value={formData.name} onChange={e => updateFields({ name: e.target.value })} className="themed-input" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Phone Number *</label>
                      <input required type="tel" value={formData.phone} onChange={e => updateFields({ phone: e.target.value })} className="themed-input" placeholder="+91 98765 43210" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Event Date & Time *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input required type="date" value={formData.date} onChange={e => updateFields({ date: e.target.value })} className="themed-input" />
                        <input required type="time" value={formData.time} onChange={e => updateFields({ time: e.target.value })} className="themed-input" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Location / City *</label>
                      <input required type="text" value={formData.location} onChange={e => updateFields({ location: e.target.value })} className="themed-input" placeholder="e.g. Jodhpur, Rajasthan" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow space-y-6">
                  <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-6">2. Guest & Venue Info</h3>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-[var(--text-primary)]">Expected Number of Guests *</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["Under 50", "50 - 150", "150 - 500", "500+"].map(opt => (
                          <div 
                            key={opt}
                            onClick={() => updateFields({ guests: opt })}
                            className={cn(
                              "border rounded-xl p-4 text-center cursor-pointer transition-all",
                              formData.guests === opt ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]" : "border-[var(--glass-border)] bg-[var(--input-bg)] text-[var(--text-secondary)] hover:border-[#D4AF37]/50"
                            )}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-[var(--text-primary)]">Preferred Venue Type</label>
                      <div className="grid grid-cols-3 gap-4">
                        {["Indoor", "Outdoor", "Both"].map(opt => (
                          <div 
                            key={opt}
                            onClick={() => updateFields({ venueType: opt })}
                            className={cn(
                              "border rounded-xl p-3 text-center cursor-pointer transition-all",
                              formData.venueType === opt ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]" : "border-[var(--glass-border)] bg-[var(--input-bg)] text-[var(--text-secondary)] hover:border-[#D4AF37]/50"
                            )}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-[var(--text-primary)]">Is the venue already booked?</label>
                      <div className="flex gap-4">
                        {["Yes", "No, need suggestions"].map(opt => (
                          <div 
                            key={opt}
                            onClick={() => updateFields({ venueBooked: opt })}
                            className={cn(
                              "border rounded-xl p-3 px-6 text-center cursor-pointer transition-all",
                              formData.venueBooked === opt ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]" : "border-[var(--glass-border)] bg-[var(--input-bg)] text-[var(--text-secondary)] hover:border-[#D4AF37]/50"
                            )}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow space-y-6">
                  <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-6">3. Budget Estimation</h3>
                  <p className="text-[var(--text-secondary)] mb-6">Select your estimated budget range. This helps us tailor our premium services to your expectations.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgetRanges.map(range => (
                      <div 
                        key={range}
                        onClick={() => { updateFields({ budgetRange: range, customBudget: "" }) }}
                        className={cn(
                          "border rounded-xl p-5 cursor-pointer transition-all group relative overflow-hidden",
                          formData.budgetRange === range ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]" : "border-[var(--glass-border)] bg-[var(--input-bg)] hover:border-[#D4AF37]/50"
                        )}
                      >
                        {formData.budgetRange === range && (
                          <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-5 text-[#D4AF37]" size={20} />
                        )}
                        <span className={cn("font-medium", formData.budgetRange === range ? "text-[#D4AF37]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]")}>
                          {range}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-[var(--glass-border)]">
                    <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-2 block">Or Enter Custom Budget (₹)</label>
                    <input 
                      type="text" 
                      value={formData.customBudget} 
                      onChange={e => updateFields({ customBudget: e.target.value, budgetRange: "Custom" })} 
                      className="themed-input" 
                      placeholder="e.g. 15,00,000" 
                    />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow space-y-6">
                  <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-6">4. Services Required</h3>
                  <p className="text-[var(--text-secondary)] mb-6">Select all the services you need for your event.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {services.map(srv => {
                      const isSelected = formData.selectedServices.includes(srv.title);
                      return (
                        <div 
                          key={srv.title}
                          onClick={() => {
                            const newServices = isSelected 
                              ? formData.selectedServices.filter(s => s !== srv.title)
                              : [...formData.selectedServices, srv.title];
                            updateFields({ selectedServices: newServices });
                          }}
                          className={cn(
                            "border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all gap-2 h-24",
                            isSelected ? "bg-[#D4AF37]/10 border-[#D4AF37]" : "border-[var(--glass-border)] bg-[var(--input-bg)] hover:border-[#D4AF37]/50"
                          )}
                        >
                          <span className={cn("text-sm font-medium", isSelected ? "text-[#D4AF37]" : "text-[var(--text-secondary)]")}>
                            {srv.title}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow space-y-6">
                  <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-6">5. Additional Requirements</h3>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-[var(--text-primary)] block">Tell us about your theme, color preferences, or special requests.</label>
                    <textarea 
                      rows={5}
                      value={formData.additionalInfo}
                      onChange={e => updateFields({ additionalInfo: e.target.value })}
                      className="themed-input resize-none"
                      placeholder="Describe your vision here..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-[var(--text-primary)] block">Inspiration & References (Optional)</label>
                    <div className="border-2 border-dashed border-[var(--glass-border)] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[var(--input-bg)] hover:border-[#D4AF37]/50 transition-colors cursor-pointer">
                      <Upload size={32} className="text-[var(--text-muted)] mb-3" />
                      <p className="text-sm text-[var(--text-secondary)] mb-1">Click to upload or drag & drop</p>
                      <p className="text-xs text-[var(--text-muted)]">SVG, PNG, JPG or PDF (max. 5MB)</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="step6" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow space-y-6">
                  <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-6">6. Review Request</h3>
                  
                  <div className="bg-[var(--input-bg)] rounded-xl border border-[var(--glass-border)] p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Contact</p>
                        <p className="text-sm text-[var(--text-primary)]">{formData.name || "N/A"}<br/>{formData.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Event</p>
                        <p className="text-sm text-[var(--text-primary)]">{formData.date || "N/A"} at {formData.time || "N/A"}<br/>{formData.location || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Details</p>
                        <p className="text-sm text-[var(--text-primary)]">{formData.guests || "N/A"} Guests<br/>{formData.venueType || "N/A"} Venue<br/>Booked: {formData.venueBooked || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Budget</p>
                        <p className="text-sm text-[#D4AF37] font-semibold">{formData.customBudget ? `₹${formData.customBudget}` : formData.budgetRange || "N/A"}</p>
                      </div>
                    </div>
                    
                    {formData.selectedServices.length > 0 && (
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Services Requested</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.selectedServices.map(s => (
                            <span key={s} className="px-2 py-1 text-xs rounded bg-[var(--glass-border)] text-[var(--text-secondary)]">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Controls */}
            <div className="mt-8 pt-6 border-t border-[var(--glass-border)] flex items-center justify-between">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={handlePrev}
                  className="px-6 py-2 rounded-full border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-500 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={18} /> Back
                </button>
              ) : <div></div>}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={cn("btn-primary py-2.5 px-8", isSubmitting && "opacity-70 cursor-not-allowed")}
              >
                {step < totalSteps ? (
                  <><span>Next Step</span> <ChevronRight size={18} /></>
                ) : (
                  <span>{isSubmitting ? "Submitting..." : "Submit Request"}</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}
