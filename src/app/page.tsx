import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white selection:bg-blue-500/30 overflow-x-hidden relative font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] rounded-full bg-blue-900/30 blur-[100px] sm:blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[70%] sm:w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[100px] sm:blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] sm:w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[100px] sm:blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 md:px-12 md:py-8 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-lg sm:text-xl tracking-tighter">M</span>
          </div>
          <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Merrick Platforms
          </span>
        </div>
        {/* Nav Links Removed */}
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 sm:pt-32 pb-16 px-4 text-center max-w-6xl mx-auto">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-medium text-blue-200">The Next Generation Investment Site</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.1]">
          Invest in your <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
            financial future.
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 sm:mb-12 font-light leading-relaxed">
          Merrick Platforms is the ultimate digital asset management hub. Build wealth effortlessly by investing in <strong className="text-gray-200 font-medium">Stocks, Real Estate, and Crypto</strong> all from one unified dashboard.
        </p>

        <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/auth/register" 
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base sm:text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transform hover:-translate-y-1 text-center"
          >
            Create Portfolio
          </Link>
          <Link 
            href="/auth/login" 
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-base sm:text-lg hover:bg-white/10 transition-all backdrop-blur-sm text-center"
          >
            Access Portfolio
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-16 mt-16 sm:mt-24 pt-12 border-t border-white/10 w-full max-w-4xl mx-auto opacity-80 pb-8 sm:pb-20">
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">$500M+</span>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Assets Managed</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">120K+</span>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Active Investors</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">12%</span>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Average APY</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">24/7</span>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Expert Support</span>
          </div>
        </div>
      </main>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 w-full bg-white/5 border-t border-white/5 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by investors worldwide</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Join thousands of individuals taking control of their financial future on Merrick Platforms.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="bg-[#0f172a] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl hover:border-blue-500/30 transition-colors">
              <div className="flex text-yellow-400 mb-4 text-sm">★★★★★</div>
              <p className="text-gray-300 mb-6 font-light leading-relaxed">
                "Merrick Platforms completely transformed how I manage my real estate investments. The fraction system is brilliant and the yields are consistent."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center font-bold">M</div>
                <div>
                  <p className="font-medium text-sm text-white">Mike T.</p>
                  <p className="text-xs text-gray-500">Real Estate Investor</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0f172a] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl hover:border-indigo-500/30 transition-colors">
              <div className="flex text-yellow-400 mb-4 text-sm">★★★★★</div>
              <p className="text-gray-300 mb-6 font-light leading-relaxed">
                "The yields on crypto assets are unmatched. Highly recommend to everyone looking for a unified dashboard for their entire portfolio."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center font-bold">S</div>
                <div>
                  <p className="font-medium text-sm text-white">Sarah W.</p>
                  <p className="text-xs text-gray-500">Crypto Trader</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0f172a] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl hover:border-cyan-500/30 transition-colors">
              <div className="flex text-yellow-400 mb-4 text-sm">★★★★★</div>
              <p className="text-gray-300 mb-6 font-light leading-relaxed">
                "I've tried many platforms, but the UI and speed of withdrawals here is phenomenal. Just hit my $50k milestone today!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center font-bold">D</div>
                <div>
                  <p className="font-medium text-sm text-white">David L.</p>
                  <p className="text-xs text-gray-500">Index Fund Investor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
