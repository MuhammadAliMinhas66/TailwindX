function WhyUs() {
  const reasons = [
    {
      title: "Save Time",
      description: "Stop building common UI patterns from scratch. Focus on what makes your product unique."
    },
    {
      title: "Battle Tested",
      description: "Components used in production by teams building real products."
    },
    {
      title: "No Lock-in",
      description: "Own the code. Modify freely. No subscriptions or vendor dependencies."
    },
    {
      title: "Always Updated",
      description: "Regular updates with new components and improvements based on community feedback."
    }
  ];

  return (
    <section className="py-32 bg-gray-950 relative border-b border-gray-800">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Why TailwindX?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built by developers, for developers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="p-10 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition"
            >
              <h3 className="text-3xl font-bold text-white mb-4">
                {reason.title}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg
          className="w-full h-32 md:h-40"
          viewBox="0 0 1440 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 Q360,20 720,80 T1440,80 L1440,160 L0,160 Z"
            fill="#111827"
            className="animate-morph-1"
          />
          <path
            d="M0,100 Q360,40 720,100 T1440,100 L1440,160 L0,160 Z"
            fill="#1F2937"
            className="animate-morph-2"
            opacity="0.7"
          />
          <path
            d="M0,120 Q360,60 720,120 T1440,120 L1440,160 L0,160 Z"
            fill="#111827"
            className="animate-morph-3"
            opacity="0.4"
          />
        </svg>
      </div>
    </section>
  );
}

export default WhyUs;