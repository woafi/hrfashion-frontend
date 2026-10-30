"use client";

import Link from "next/link";
import { CiFacebook, CiInstagram } from "react-icons/ci";
import { ImPinterest2 } from "react-icons/im";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";

export function Footer() {
  return (
    <footer className="bg-card border-t border-card-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <StaggerItem className="col-span-1 md:col-span-1">
            <h3 className="text-lg tracking-widest uppercase font-semibold mb-6">HR Fashion</h3>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Elevating everyday aesthetics. A modern fashion label born in Dhaka, blending timeless elegance with contemporary minimalism.
            </p>
          </StaggerItem>

          <StaggerItem>
            <h4 className="text-sm uppercase font-semibold tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-muted">
              {[
                { href: "/", label: "Home" },
                { href: "/collections", label: "Collections" },
                { href: "/careers", label: "Careers" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative inline-block hover:text-foreground transition-colors duration-200 group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h4 className="text-sm uppercase font-semibold tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li>
                <a href="mailto:hrfasionofficial0@gmail.com" className="hover:text-foreground transition-colors">
                  hrfasionofficial0@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+8801716944281" className="hover:text-foreground transition-colors">
                  +880 1716 944281
                </a>
              </li>
              <li className="leading-relaxed">
                House # 107, Level #05 Biruttam C.R Datta Road<br />
                Bangladesh
              </li>
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h4 className="text-sm uppercase font-semibold tracking-wider mb-6">Social</h4>
            <div className="flex gap-4">
              {[
                { href: "https://instagram.com", Icon: CiInstagram, label: "Instagram" },
                { href: "https://facebook.com", Icon: CiFacebook, label: "Facebook" },
                { href: "https://pinterest.com", Icon: ImPinterest2, label: "Pinterest" },
              ].map(({ href, Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="p-2 border border-card-border rounded-full hover:border-accent hover:text-accent transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </StaggerItem>
        </StaggerContainer>

        <ScrollReveal>
          <div className="border-t border-card-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted gap-4">
            <p>&copy; {new Date().getFullYear()} HR Fashion. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
