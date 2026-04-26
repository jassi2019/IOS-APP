"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.taiyarineetki.app";
const APP_STORE_URL = "https://apps.apple.com/app/taiyari-neet-ki/id6740091521";

const features = [
  {
    icon: "📚",
    title: "Complete NEET Syllabus",
    desc: "Physics, Chemistry & Biology — all chapters covered with detailed notes and explanations.",
  },
  {
    icon: "🧪",
    title: "Practice Questions",
    desc: "Thousands of MCQs with detailed solutions to strengthen your concepts.",
  },
  {
    icon: "📊",
    title: "Track Your Progress",
    desc: "Monitor your preparation with chapter-wise progress tracking and analytics.",
  },
  {
    icon: "🎯",
    title: "Topic-wise Learning",
    desc: "Study at your own pace with organized topic-wise content structure.",
  },
  {
    icon: "📱",
    title: "Learn Anywhere",
    desc: "Study on the go with our mobile app — available on Android and iOS.",
  },
  {
    icon: "🏆",
    title: "Exam Ready",
    desc: "Get fully prepared with our curated content designed by NEET experts.",
  },
];

const stats = [
  { value: "50,000+", label: "Students" },
  { value: "10,000+", label: "Questions" },
  { value: "500+", label: "Topics" },
  { value: "4.8★", label: "App Rating" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    city: "Jaipur",
    text: "This app helped me crack NEET in my first attempt! The content is so well organized.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    city: "Delhi",
    text: "Best NEET preparation app. The practice questions are very close to actual exam pattern.",
    rating: 5,
  },
  {
    name: "Ananya Gupta",
    city: "Lucknow",
    text: "I improved my Biology score by 40 marks after using this app for just 2 months!",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Is this app free?",
    a: "Yes! You can access basic content for free. Premium subscription unlocks all chapters, practice sets, and advanced features.",
  },
  {
    q: "Which subjects are covered?",
    a: "We cover all three NEET subjects — Physics, Chemistry, and Biology (Botany & Zoology) as per the latest NTA syllabus.",
  },
  {
    q: "Can I use this on both Android and iPhone?",
    a: "Yes! Taiyari NEET Ki is available on both Google Play Store and Apple App Store.",
  },
  {
    q: "How is the content created?",
    a: "Our content is curated by experienced NEET faculty and toppers, ensuring accuracy and exam relevance.",
  },
  {
    q: "Do I need internet to study?",
    a: "You need internet to download content, but once loaded, you can study offline.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Taiyari NEET Ki — Best NEET Preparation App 2026 | Free Study Material</title>
        <meta
          name="description"
          content="Taiyari NEET Ki is India's best NEET preparation app. Free study material, 10,000+ MCQs, chapter-wise notes for Physics, Chemistry & Biology. Download now!"
        />
        <meta name="keywords" content="NEET preparation app, NEET 2026, NEET study material, NEET MCQ, NEET physics, NEET chemistry, NEET biology, best NEET app, free NEET app, NEET practice questions, medical entrance exam" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Taiyari NEET Ki — Best NEET Preparation App" />
        <meta property="og:description" content="India's #1 NEET preparation app with 10,000+ MCQs, detailed notes & progress tracking. Download free!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://taiyarineetki.com" />
        <meta property="og:image" content="https://taiyarineetki.com/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://taiyarineetki.com" />
      </Head>

      <div className="min-h-screen bg-[#0a0e1a] text-white overflow-x-hidden">
        {/* Navbar */}
        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled
              ? "bg-[#0a0e1a]/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-500/30">
                T
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Taiyari NEET Ki
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">Reviews</a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Download App
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
            <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-indigo-300">Trusted by 50,000+ NEET Aspirants</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  NEET Ki Taiyari,{" "}
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Ab Hogi Asaan!
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                India ka sabse trusted NEET preparation app. Complete syllabus,
                10,000+ practice questions, aur detailed solutions — sab ek hi app mein.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-white hover:bg-gray-100 text-black px-6 py-3.5 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302-2.302 2.302L15.396 12l2.302-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">Get it on</div>
                    <div className="text-base font-bold -mt-0.5">Google Play</div>
                  </div>
                </a>

                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-white hover:bg-gray-100 text-black px-6 py-3.5 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">Download on the</div>
                    <div className="text-base font-bold -mt-0.5">App Store</div>
                  </div>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                  >
                    <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 sm:px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-600/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Features</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Everything You Need to Crack NEET
              </h2>
              <p className="text-gray-400 mt-4 max-w-xl mx-auto">
                Our app is designed to give you the best preparation experience with features that actually matter.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">How It Works</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-white">
                Start in 3 Simple Steps
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Download App", desc: "Get the app from Play Store or App Store — it's free!" },
                { step: "02", title: "Choose Subject", desc: "Pick Physics, Chemistry or Biology and start learning." },
                { step: "03", title: "Start Studying", desc: "Read notes, solve MCQs, and track your progress daily." },
              ].map((s, i) => (
                <div key={i} className="text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xl font-bold mb-5 shadow-lg shadow-indigo-500/30">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t border-dashed border-indigo-500/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 px-4 sm:px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Testimonials</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-white">
                Students Love Us
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:border-indigo-500/20 transition-all"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="text-yellow-400 text-sm">&#9733;</span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                    <span
                      className={`text-indigo-400 text-xl transition-transform duration-200 flex-shrink-0 ${
                        openFaq === i ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px]" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Start Your NEET Journey?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Join 50,000+ students who are already preparing smarter with Taiyari NEET Ki.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 text-lg w-full sm:w-auto"
              >
                Download for Android
              </a>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:scale-105 text-lg w-full sm:w-auto"
              >
                Download for iOS
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-sm font-bold">
                    T
                  </div>
                  <span className="text-lg font-bold text-white">Taiyari NEET Ki</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  India ka most trusted NEET preparation app for serious aspirants.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
                  <li><a href="#testimonials" className="hover:text-indigo-400 transition-colors">Reviews</a></li>
                  <li><a href="#faq" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms-and-conditions" className="hover:text-indigo-400 transition-colors">Terms & Conditions</a></li>
                  <li><a href="/deletion-requested" className="hover:text-indigo-400 transition-colors">Delete Account</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Download</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Google Play Store</a></li>
                  <li><a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Apple App Store</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-600">
                &copy; {new Date().getFullYear()} Taiyari NEET Ki. All rights reserved.
              </p>
              <p className="text-xs text-gray-600">
                Made with ❤️ for NEET Aspirants
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
