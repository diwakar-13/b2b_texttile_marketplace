"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";
import {
  MdEmail,
  MdPhoneInTalk,
  MdLocationOn,
  MdMessage,
} from "react-icons/md";
import { FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const contactDetails = [
    {
      icon: <MdEmail className="w-7 h-7 text-white" />,
      title: "Email Us",
      value: "diwakarpandey410@gmail.com",
      description: "Our team will respond within 24 hours.",
      link: "mailto:diwakarpandey410@gmail.com",
    },
    {
      icon: <MdPhoneInTalk className="w-7 h-7 text-white" />,
      title: "Call Us",
      value: "+91 6307806837",
      description: "Mon-Sat, 9 AM to 6 PM (IST)",
      link: "tel:+916307806837",
    },
    {
      icon: <MdLocationOn className="w-7 h-7 text-white" />,
      title: "Visit Our Office",
      value: "Bhopal, India",
      description: "Block A, Global Trade Center",
      link: "https://maps.google.com",
    },
  ];

  const socialLinks = [
    {
      icon: <FaLinkedinIn />,
      href: "https://www.linkedin.com/in/diwakarpandey410/",
    },
    {
      icon: <FaInstagram />,
      href: "https://www.instagram.com/diwakar__007?igsh=NzltYTAxaHNkc2xu",
    },
    { icon: <FaGithub />, href: "https://github.com/diwakar-13" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Submitting your B2B inquiry...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        toast.success(
          "Inquiry sent successfully! Our team will contact you shortly.",
          {
            id: toastId,
          },
        );
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        toast.error(json.error || "Failed to send inquiry. Please try again.", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to connect to the server. Please try again.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] font-sans text-neutral-900">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-5 sm:px-8 py-10 md:py-16 space-y-16">
        {/* HEADER SECTION */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-black">
            Let's{" "}
            <span className="text-neutral-800 border-b-4 border-black">
              Connect
            </span>
          </h1>
          <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
            Have questions about our B2B textile marketplace? Need help finding
            verified mills or managing orders? We're here to help you simplify
            your fabric sourcing.
          </p>
        </div>

        {/* CONTACT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactDetails.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-7 rounded-3xl border border-black/5 shadow-sm hover:border-black/20 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-black pt-1">
                  {item.title}
                </h3>
                <p className="text-lg font-semibold text-black tracking-tight">
                  {item.value}
                </p>
                <p className="text-sm text-neutral-500 font-medium">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* FORM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 bg-white p-8 sm:p-10 rounded-3xl border border-black/5 shadow-lg items-start">
          <div className="lg:col-span-2 space-y-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-neutral-100 border border-black/10 text-black">
                <MdMessage className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                Send us a Message
              </h2>
            </div>
            <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
              Fill out the form with your details or business requirements. Our
              B2B partnership team will review your query and get back to you
              promptly.
            </p>
            <div className="pt-4 border-t border-black/5 space-y-3">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Connect with us on social media
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-neutral-700 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 bg-neutral-50 p-7 sm:p-9 rounded-3xl border border-black/5"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">
                Business Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">
                Message / Requirements *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Specify your fabric types, GSM, MOQ or business query..."
                rows="5"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition resize-none"
              ></textarea>
            </div>
            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending
                    Inquiry...
                  </>
                ) : (
                  "Send Inquiry"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="mt-16 py-8 border-t border-black/5 bg-neutral-100">
        <div className="max-w-[1280px] mx-auto px-5 text-center text-xs font-semibold text-neutral-600">
          © 2026 Textil B2B Marketplace. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
