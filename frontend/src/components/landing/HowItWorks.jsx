import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Browse",
      description: "Explore our library of components and templates"
    },
    {
      number: "02",
      title: "Copy",
      description: "Click to copy the JSX code with Tailwind classes"
    },
    {
      number: "03",
      title: "Ship",
      description: "Paste into your project and customize as needed"
    }
  ];

  const numberRefs = useRef([]);

  useEffect(() => {
    numberRefs.current.forEach((num, index) => {
      if (!num) return;
      
      gsap.to(num, {
        backgroundPosition: '200% center',
        duration: 3,
        ease: 'none',
        repeat: -1,
        delay: index * 0.3
      });
    });
  }, []);

  return (
    <section className="py-32 bg-gray-900 relative border-b border-gray-800">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Simple Process
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div
                ref={el => numberRefs.current[index] = el}
                className="text-8xl font-black mb-6 bg-gradient-to-r from-white via-gray-400 to-white bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% auto',
                  backgroundPosition: '0% center'
                }}
              >
                {step.number}
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                {step.title}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;