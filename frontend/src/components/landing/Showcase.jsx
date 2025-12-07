function Showcase() {
  const components = [
    { name: "Buttons", count: 24 },
    { name: "Cards", count: 18 },
    { name: "Forms", count: 32 },
    { name: "Navigation", count: 12 },
    { name: "Modals", count: 16 },
    { name: "Tables", count: 10 }
  ];

  return (
    <section className="py-32 bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 animate-fade-in">
            Component Library
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-delay">
            A comprehensive collection of UI components for every use case
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {components.map((item, index) => (
            <a
              key={index}
              href="/components"
              className="p-8 bg-gray-950 border border-gray-800 rounded-2xl hover:border-gray-700 hover:scale-105 transition-all duration-300 group text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {item.count} components
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Showcase;