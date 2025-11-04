import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import banner from "./../assets/banner.png";

const HeroSection = () => {
  const imageRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      if (!imageElement) return;

      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold pb-6 gradient-text">
          AI-Powered Investment <br /> Intelligence
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Empower your trading journey with AI-driven insights, real-time data,
          and smart recommendations — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Trading
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
            onClick={() =>
              document
                .getElementById("features")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Learn More
          </Button>
        </div>
        <div className="hero-image-wrapper mt-8">
          <div className="hero-image-wrapper mt-5 md:mt-0">
            <div ref={imageRef} className="hero-image">
              <img
                src={banner}
                width={1280}
                height={720}
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl border mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="mt-20 pt-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose AI Agent?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Automation",
                description:
                  "Automate repetitive tasks with intelligent AI agents that learn and adapt to your workflow.",
                icon: "⚡",
              },
              {
                title: "Data Analysis",
                description:
                  "Get deep insights from your data with advanced analytics and visualization tools.",
                icon: "📊",
              },
              {
                title: "24/7 Support",
                description:
                  "Your AI agents work around the clock to ensure optimal performance and results.",
                icon: "🛡️",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
