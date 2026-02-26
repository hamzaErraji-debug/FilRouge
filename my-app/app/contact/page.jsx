"use client";

import { FiMail, FiMapPin, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(""); // ← For success/failure feedback

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Validate a single field on blur
  const handleBlur = (e) => {
    const { id, value } = e.target;
    let error = "";

    if (!value.trim()) error = `${id} is required`;
    else if (id === "email" && !/\S+@\S+\.\S+/.test(value))
      error = "Invalid email address";
    else if (id === "message" && value.trim().length < 10)
      error = "Message must be at least 10 characters";

    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  // Validate all fields on submit
  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {

      const response = await axios.post(process.env.NEXT_PUBLIC_N8N_URL, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMessage("✅ Message sent successfully! n8n workflow triggered.");
      console.log("n8n response:", response.data);
      toast.success('Email has sent successfully !')

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error triggering n8n webhook:", error);
      toast.error(' Failed to send message')
      setMessage("❌ Failed to send message. Try again later.");
    }
  };

  return (
    <>
      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 space-y-8 md:space-y-12">
        <div className="w-full pt-6">
          <div className="relative flex min-h-75 w-full flex-col items-center justify-center overflow-hidden rounded-3xl p-6 md:p-12 text-center shadow-2xl bg-[#102216]">
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: "url('/bodybuildingImage.jpg')",
              }}
            ></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center gap-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tighter text-white drop-shadow-lg">
                Get in{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-300">
                  Touch
                </span>
              </h1>
              <p className="text-lg font-medium text-gray-200 max-w-lg">
                Have questions about our AI training plans or gear? Our team is
                ready to help you unleash your potential.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-12">
          {/* Contact Form */}
          <div className="space-y-8">
            <div className="bg-[#102216] rounded-2xl p-8 border border-[#0c1b11] shadow-xl h-full">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide flex items-center gap-2">
                <FiMail className="text-green-200" /> Send us a message
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-bold text-gray-100 uppercase tracking-wider"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-xl bg-black border ${
                        errors.firstName ? "border-red-500" : "border-green-800"
                      } text-white focus:border-green-300 focus:ring-green-300 py-3 px-4 placeholder-gray-200`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-bold text-gray-100 uppercase tracking-wider"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-xl bg-black border ${
                        errors.lastName ? "border-red-500" : "border-green-800"
                      } text-white focus:border-green-300 focus:ring-green-300 py-3 px-4 placeholder-gray-200`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-bold text-gray-100 uppercase tracking-wider"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-xl bg-black border ${
                      errors.email ? "border-red-500" : "border-green-800"
                    } text-white focus:border-green-300 focus:ring-green-300 py-3 px-4 placeholder-gray-200`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-bold text-gray-100 uppercase tracking-wider"
                    htmlFor="subject"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-xl bg-black border ${
                      errors.subject ? "border-red-500" : "border-green-800"
                    } text-white focus:border-green-300 focus:ring-green-300 py-3 px-4`}
                  >
                    <option>General Inquiry</option>
                    <option>Order Support</option>
                    <option>Technical Issue</option>
                    <option>AI Coaching Feedback</option>
                    <option>Partnership</option>
                  </select>
                  {errors.subject && (
                    <p className="text-red-500 text-xs">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-bold text-gray-100 uppercase tracking-wider"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-xl bg-black border ${
                      errors.message ? "border-red-500" : "border-green-800"
                    } text-white focus:border-green-300 focus:ring-green-300 py-3 px-4 placeholder-gray-200`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-xs">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer py-4 rounded-xl bg-green-200 text-green-900 font-black uppercase tracking-wider text-base hover:bg-green-300 transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(19,236,91,0.4)]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Support & Info */}
          <div className="space-y-8 flex flex-col">
            {/* 🔥 EXACT CODE YOU PROVIDED */}
            <div className="bg-[#102216] rounded-2xl p-8 border border-green-800 shadow-xl flex flex-col justify-center gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                  Quick Support
                </h3>
                <p className="text-green-100 text-sm">
                  Need a faster response? Reach us instantly through our social
                  channels or direct messaging.
                </p>
              </div>

              <a
                className="flex items-center gap-4 p-4 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-all group"
                href="#"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                  </svg>
                </div>
                <div>
                  <span className="block text-white font-bold text-lg">
                    Chat on WhatsApp
                  </span>
                  <span className="block text-green-100 text-sm">
                    Typically replies in minutes
                  </span>
                </div>
                <FiArrowRight className="ml-auto text-green-200 group-hover:text-green-50" />
              </a>

              {/* Email Support */}
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-200/30 text-green-200">
                  <FiMail className="text-green-600 text-xl" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase text-sm mb-1">
                    Email Support
                  </h4>
                  <a
                    className="text-green-200 hover:text-green-50 transition-colors font-medium"
                    href="mailto:support@sportai.com"
                  >
                    support@sportai.com
                  </a>
                  <p className="text-xs text-green-100 mt-1">
                    For detailed inquiries and attachments
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-200/30 text-green-200">
                  <FiMapPin className="text-green-600 text-xl" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase text-sm mb-1">
                    Headquarters
                  </h4>
                  <p className="text-green-100 text-sm leading-relaxed">
                    123 Innovation Drive,
                    <br />
                    Tech Park, CA 94043
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-green-700 rounded-2xl p-8 border border-green-800 shadow-xl relative overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('/sportimage.jpg')",
                  backgroundPosition: "right 60%",
                }}
              ></div>
              <div className="absolute inset-0 bg-linear-to-r from-green-700 via-green-700/80 to-transparent"></div>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded bg-green-200 text-green-900 text-xs font-black uppercase mb-3">
                  FAQ
                </span>
                <h3 className="text-2xl font-black italic uppercase text-white mb-2">
                  Common Questions
                </h3>
                <p className="text-green-100 text-sm mb-6 max-w-xs">
                  Find instant answers to questions about shipping, returns, and AI
                  coaching programs.
                </p>
                <button className="flex items-center gap-2 text-green-200 font-bold uppercase text-sm hover:gap-3 transition-all">
                  Visit Help Center <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
