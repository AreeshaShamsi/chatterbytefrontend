import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, Inbox } from 'lucide-react';

const steps = [
  {
    title: 'Login to Chatterbyte',
    description: 'Start by signing in to your secure Chatterbyte dashboard.',
    icon: ShieldCheck,
  },
  {
    title: 'Add Your Mail Accounts',
    description: 'Connect Gmail, Outlook, or any mail ID in one click.',
    icon: Mail,
  },
  {
    title: 'View Unified Inbox',
    description: 'Access all your messages in one smart dashboard.',
    icon: Inbox,
  },
];

const ChatterbyteGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-transparent text-white px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl px-10 py-12">
        {/* Styled Title */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-12">
          
          <span className="text-white ml-2 relative inline-block">
             How Chatterbyte Works
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse rounded-full"></div>
          </span>
        </h2>

        {/* Steps */}
        <div className="flex flex-col gap-10 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;

            return (
              <div key={index} className="flex items-start gap-6 relative">
                {/* Line Connector */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-5 top-12 h-[calc(100%+10px)] w-0.5 bg-gradient-to-b from-cyan-400/20 to-blue-400/20" />
                )}

                {/* Step Icon */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-500
                    ${
                      isActive
                        ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg animate-pulse text-white'
                        : 'bg-white/10 border-white/20 text-white/50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step Text */}
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${isActive ? 'text-white' : 'text-white/70'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${isActive ? 'text-white/90' : 'text-white/50'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChatterbyteGuide;
