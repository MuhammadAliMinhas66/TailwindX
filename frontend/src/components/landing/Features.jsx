function Features() {
  const features = [
    {
      title: "Ready to Use",
      description: "Copy and paste components directly into your project. No setup required."
    },
    {
      title: "Tailwind Only",
      description: "Pure utility classes. No custom CSS or external dependencies."
    },
    {
      title: "Fully Responsive",
      description: "Every component works flawlessly on all screen sizes."
    },
    {
      title: "Customizable",
      description: "Easy to modify and adapt to match your brand and style."
    },
    {
      title: "Ready to Use",
      description: "Copy and paste components directly into your project. No setup required."
    },
    {
      title: "Tailwind Only",
      description: "Pure utility classes. No custom CSS or external dependencies."
    },
    {
      title: "Fully Responsive",
      description: "Every component works flawlessly on all screen sizes."
    },
    {
      title: "Customizable",
      description: "Easy to modify and adapt to match your brand and style."
    }
  ];

  return (
    <section className="py-32 bg-gray-950 overflow-hidden border-y border-gray-800">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10"></div>
        
        <div className="flex animate-scroll-left">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-96 mx-4 p-8 bg-gray-900 border border-gray-800 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;