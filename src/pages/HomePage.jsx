import React from "react";
import { useAuth } from "../context/AuthContext";
import HeroSection from "@/components/Hero";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <HeroSection />

      {/* Welcome Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {user
              ? `Welcome back, ${user.username}!`
              : "AI-Powered Stock Intelligence"}
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            {user
              ? "Continue your trading journey with AI-driven insights, real-time data, and smart recommendations."
              : "Transform your investment strategy with advanced AI analytics, real-time market data, and intelligent trading insights — all in one platform."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() =>
                (window.location.href = user ? "/dashboard" : "/signup")
              }
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-700 hover:to-green-700"
            >
              {user ? "Go to Dashboard" : "Start Free Trial"}
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("ai-agents")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-10 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            >
              Explore AI Agents
            </button>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section
        id="features"
        className="py-24 bg-gradient-to-b from-white to-blue-50/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Advanced Analytics Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools powered by artificial intelligence to elevate
              your trading decisions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📈",
                title: "Technical Analysis",
                description:
                  "Advanced indicators including RSI, MACD, Bollinger Bands, and moving averages with AI-powered pattern recognition.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: "💰",
                title: "Fundamental Analysis",
                description:
                  "Deep financial analysis with balance sheets, cash flows, income statements, and comprehensive valuation metrics.",
                gradient: "from-green-500 to-blue-500",
              },
              {
                icon: "⚖️",
                title: "Valuation Models",
                description:
                  "Professional valuation techniques including DCF, DDM, FCFE, and comparative analysis for intrinsic value assessment.",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: "📊",
                title: "Performance Analytics",
                description:
                  "Multi-year historical data analysis, trend identification, and performance benchmarking across market cycles.",
                gradient: "from-indigo-500 to-purple-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
              >
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Intelligence */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Real-time Market Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay ahead of market movements with comprehensive intelligence and
              sentiment analysis
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📰",
                title: "Live News Feed",
                description:
                  "Real-time news aggregation with AI-powered relevance scoring and impact analysis on your portfolio.",
                color: "blue",
              },
              {
                icon: "💬",
                title: "Sentiment Analysis",
                description:
                  "Advanced NLP algorithms analyzing market sentiment from news, social media, and financial reports.",
                color: "green",
              },
              {
                icon: "⭐",
                title: "Expert Insights",
                description:
                  "Consolidated analyst ratings, price targets, and institutional recommendations with confidence scoring.",
                color: "purple",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-${feature.color}-100 flex items-center justify-center text-2xl mb-6 mx-auto`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agent Ecosystem */}
      <section
        id="ai-agents"
        className="py-24 bg-gradient-to-br from-blue-50/50 to-indigo-100/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Intelligent Agent Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4">
              Our multi-agent AI system combines specialized analytical
              perspectives to deliver comprehensive market insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "🧩",
                title: "Technical Agent",
                description:
                  "Advanced pattern recognition for chart analysis, breakout detection, and technical indicator optimization.",
                badge: "Patterns",
              },
              {
                icon: "🗞️",
                title: "Sentiment Agent",
                description:
                  "Real-time sentiment analysis from news sources, social media, and financial discourse.",
                badge: "Mood",
              },
              {
                icon: "⚖️",
                title: "Risk Agent",
                description:
                  "Comprehensive risk assessment including volatility analysis, beta calculations, and portfolio stress testing.",
                badge: "Safety",
              },
              {
                icon: "💼",
                title: "Portfolio Agent",
                description:
                  "Intelligent position sizing, asset allocation optimization, and rebalancing recommendations.",
                badge: "Growth",
              },
              {
                icon: "🧠",
                title: "Master Agent",
                description:
                  "Synthesizes insights from all specialized agents to generate actionable trading recommendations.",
                badge: "Strategy",
              },
            ].map((agent, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{agent.icon}</div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                    {agent.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {agent.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {agent.description}
                </p>
              </div>
            ))}
          </div>

          {/* Paper Trading Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 shadow-2xl text-center max-w-6xl mx-auto">
            <div className="text-5xl mb-6">💰</div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Risk-Free Paper Trading
            </h3>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Practice your strategies with{" "}
              <span className="font-bold text-white">₹10,00,000</span> virtual
              capital in realistic market conditions
            </p>
            <button
              onClick={() =>
                (window.location.href = user ? "/dashboard" : "/signup")
              }
              className="px-12 py-4 bg-white text-green-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-gray-50"
            >
              Start Paper Trading
            </button>
          </div>
        </div>
      </section>

      {/* Popular Stocks */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Popular Indian Stocks
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Click any stock to begin instant AI-powered analysis
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                symbol: "RELIANCE",
                name: "Reliance Industries",
                sector: "Energy",
              },
              {
                symbol: "TCS",
                name: "Tata Consultancy Services",
                sector: "IT",
              },
              { symbol: "INFY", name: "Infosys", sector: "IT" },
              { symbol: "HDFC", name: "HDFC Bank", sector: "Banking" },
              { symbol: "ICICI", name: "ICICI Bank", sector: "Banking" },
              { symbol: "NTPC", name: "NTPC Limited", sector: "Power" },
              { symbol: "BHARTI", name: "Bharti Airtel", sector: "Telecom" },
              { symbol: "ITC", name: "ITC Limited", sector: "FMCG" },
            ].map((stock, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center"
              >
                <div className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {stock.symbol}
                </div>
                <div className="text-sm text-gray-600 mb-2">{stock.name}</div>
                <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">
                  {stock.sector}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Master AI-Powered Trading
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Comprehensive educational resources to help you understand and
            leverage our AI agent ecosystem effectively
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto text-left">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Learning Path
              </h3>
              <ul className="text-gray-600 space-y-4">
                <li className="flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 font-semibold">
                    1
                  </span>
                  Technical indicator calculation and interpretation
                </li>
                <li className="flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4 font-semibold">
                    2
                  </span>
                  Sentiment analysis from real-world data sources
                </li>
                <li className="flex items-center">
                  <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4 font-semibold">
                    3
                  </span>
                  Professional valuation methodologies and models
                </li>
                <li className="flex items-center">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-4 font-semibold">
                    4
                  </span>
                  AI recommendation synthesis and implementation
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-green-600 p-8 rounded-2xl shadow-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Start Learning Today</h3>
              <p className="mb-6 opacity-90">
                Access our comprehensive tutorial library, video courses, and
                interactive learning modules designed for traders of all levels.
              </p>
              <button className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg">
                Explore Learning Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              AI Stock Intelligence Platform
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Advanced artificial intelligence meets professional trading
              analytics
            </p>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-lg mb-2">
              Built with cutting-edge React, Tailwind CSS, and AI Technologies
            </p>
            <p className="text-sm text-gray-500">
              ⚠ For educational and research purposes only. Not financial
              advice. Trading involves risk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
