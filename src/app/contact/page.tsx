"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Loader2, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";

const CONTACT_ITEMS = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hrfasionofficial0@gmail.com",
    href: "mailto:hrfasionofficial0@gmail.com",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+880 1716 944281",
    href: "tel:+8801716944281",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "House # 107, Level #05 Biruttam C.R Datta Road\nDhaka 1213\nBangladesh",
    href: null,
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Message sent! We'll get back to you shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-4 border border-accent/30 px-4 py-1.5 rounded-full"
            >
              Get in Touch
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">We&apos;d Love to Hear From You</h1>
            <p className="text-muted uppercase tracking-widest text-sm">
              Reach out with any questions or inquiries.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-5xl mx-auto">
          
          {/* Contact Information */}
          <div className="space-y-10">
            <StaggerContainer className="space-y-6">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                <StaggerItem key={label}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex items-start gap-4 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="p-3 bg-card border border-card-border rounded-xl text-foreground shrink-0 group-hover:border-accent/50 group-hover:text-accent transition-colors duration-300 shadow-sm"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-1">
                        {label}
                      </h3>
                      {href ? (
                        <a href={href} className="text-muted hover:text-accent transition-colors text-sm leading-relaxed">
                          {value}
                        </a>
                      ) : (
                        <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{value}</p>
                      )}
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <ScrollReveal>
              <motion.div
                whileHover={{ y: -3 }}
                className="p-8 bg-card border border-card-border rounded-xl relative overflow-hidden card-glow"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-4 h-4 text-accent" />
                  <h3 className="font-serif text-lg">Customer Service Hours</h3>
                </div>
                <p className="text-sm text-muted mb-1">Sunday – Thursday: 9:00 AM – 6:00 PM (BST)</p>
                <p className="text-sm text-muted">Friday – Saturday: Closed</p>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Contact Form */}
          <ScrollReveal>
            <motion.div
              whileHover={{ boxShadow: "0 20px 60px -12px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl border border-card-border p-8 relative overflow-hidden card-glow"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <h2 className="text-2xl font-serif mb-8 relative">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5 relative">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-widest font-medium text-muted">
                      Name
                    </label>
                    <motion.input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      whileFocus={{ scale: 1.01 }}
                      className="input-focus-ring w-full px-4 py-3 bg-background border border-card-border rounded-sm text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-widest font-medium text-muted">
                      Email
                    </label>
                    <motion.input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      whileFocus={{ scale: 1.01 }}
                      className="input-focus-ring w-full px-4 py-3 bg-background border border-card-border rounded-sm text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs uppercase tracking-widest font-medium text-muted">Subject</label>
                  <motion.input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    whileFocus={{ scale: 1.01 }}
                    className="input-focus-ring w-full px-4 py-3 bg-background border border-card-border rounded-sm text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-widest font-medium text-muted">Message</label>
                  <motion.textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    whileFocus={{ scale: 1.005 }}
                    className="input-focus-ring w-full px-4 py-3 bg-background border border-card-border rounded-sm text-sm resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-shimmer w-full py-4 bg-foreground text-background font-medium uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Send Message <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
