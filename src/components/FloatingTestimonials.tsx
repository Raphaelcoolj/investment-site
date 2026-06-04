'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  "Raphael just withdrew $5,000",
  "From Mike: Merrick Platform just helped me earn my first $10,000 through real estate investments",
  "Sarah deposited $2,500 into the crypto vault",
  "James just earned $400 in dividend yields",
  "Emma initiated a withdrawal of $12,000",
  "From David: The easiest way to diversify my portfolio. Just hit my $50k milestone!",
  "Michael just invested $8,000 in the real estate fund",
  "Olivia's portfolio is up 15% this week!",
  "William successfully withdrew $3,200",
  "From Sophia: I never thought investing could be this simple. Thank you Merrick Platform!",
  "Liam just deposited $15,000",
  "Isabella secured a 12% APY on her recent deposit",
  "Mason just withdrew $1,500",
  "From Ethan: Just bought my first fraction of commercial real estate. Game changer.",
  "Ava just claimed her $500 referral bonus!",
  "Noah just invested $10,000 in tech stocks",
  "From Mia: Withdrawal was super fast. Highly recommend!",
  "Lucas's real estate portfolio grew by 8% this month",
  "Charlotte deposited $4,200",
  "From Amelia: Easiest UI I've ever used for trading.",
  "Benjamin just withdrew $8,500 to his bank account",
  "Harper just earned a $250 staking reward",
  "From Elijah: The automated real estate investments are brilliant. Up 20% this year.",
  "Evelyn just deposited $50,000 into the premium tier",
  "Alexander claimed a weekly dividend of $120",
  "Abigail's crypto holdings surged 22% in the last 24 hours",
  "From Daniel: Seamless experience. Getting my friends on Merrick Platform right now.",
  "Emily just invested $3,500 in the index funds",
  "Matthew successfully withdrew $14,000",
  "Elizabeth deposited $7,800",
  "From Joseph: Love watching my wealth grow daily on this dashboard.",
  "Sofia just claimed her $1,000 signup bonus!",
  "Jackson's portfolio hit a new all-time high of $120,000",
  "Avery invested $2,000 in Ethereum",
  "From Samuel: Quick deposits, even faster withdrawals. The best platform out there.",
  "Ella just withdrew $6,300",
  "David received $350 in referral bonuses",
  "Chloe just deposited $9,100",
  "From Carter: The real estate fractions are a game changer. Thanks Merrick!",
  "Victoria's yield farming generated $800 this month",
  "Wyatt successfully withdrew $2,100",
  "Grace invested $15,000 in the blue-chip stock portfolio",
  "From Jayden: Just hit my $100k net worth goal using Merrick Platforms!",
  "Zoey just claimed a $50 daily reward",
  "John deposited $11,500",
  "Riley's account balance increased by $4,200 this week",
  "From Owen: Customer support is amazing and the yields are unmatched.",
  "Lily just withdrew $4,800",
  "Dylan invested $5,500 in commercial real estate",
  "Hannah earned $210 in staking yields",
  "From Luke: My favorite app for tracking and growing my assets.",
  "Layla just deposited $3,300",
  "Gabriel successfully withdrew $9,000",
  "Zoe's portfolio is up 18% this month",
  "From Anthony: The transparency and speed of Merrick Platforms are incredible.",
  "Penelope invested $12,500 in the crypto index",
  "Isaac claimed a $150 referral bonus",
  "Stella just deposited $6,700",
  "From Oliver: Easiest $5k I've ever made from real estate dividends.",
  "Nora just withdrew $1,900",
  "Levi received $420 in daily yields",
  "Hazel invested $4,000 in growth stocks",
  "From Sebastian: I've moved all my investments here. The UI is just too good.",
  "Aurora just claimed her $300 sign-up bonus",
  "Julian deposited $8,900",
  "Lucy's total assets surpassed $75,000 today",
  "From Mateo: Merrick Platforms changed how I view passive income.",
  "Savannah just withdrew $11,200",
  "Jack invested $6,600 in the high-yield fund",
  "Brooklyn earned $180 in dividend yields",
  "From Ryan: Fast withdrawals and incredible real estate opportunities.",
  "Bella just deposited $5,400",
  "Christopher successfully withdrew $3,800",
  "Paisley's crypto portfolio grew by 14% today",
  "From Nathan: Best platform for both crypto and traditional stocks.",
  "Skylar invested $7,200",
  "Caleb claimed a $200 weekly staking reward",
  "Ellie just withdrew $2,600",
  "From Christian: Hit $10k in profits! Thank you Merrick Platforms!",
  "Aaliyah deposited $10,500",
  "Landon's real estate dividends came in at $950 this month",
];

export default function FloatingTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Function to show a random testimonial
    const showRandomTestimonial = () => {
      const randomIndex = Math.floor(Math.random() * testimonials.length);
      setCurrentTestimonial(testimonials[randomIndex]);
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Initial timeout before first show
    const initialTimeout = setTimeout(() => {
      showRandomTestimonial();
      
      // Setup repeating interval (every 40-60 seconds)
      const interval = setInterval(() => {
        showRandomTestimonial();
      }, Math.floor(Math.random() * 20000) + 40000); // random 0-20k + 40k = 40k-60k
      
      return () => clearInterval(interval);
    }, 10000); // 10s initial delay instead of 3s so it doesn't pop up too early

    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm p-4 rounded-xl shadow-2xl bg-gray-900 border border-gray-700 transition-all duration-700 ease-in-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            MP
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-200 leading-snug">
            {currentTestimonial}
          </p>
          <p className="text-xs text-gray-500 mt-1">Just now</p>
        </div>
      </div>
    </div>
  );
}
