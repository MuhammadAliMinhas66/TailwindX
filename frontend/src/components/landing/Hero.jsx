import CircularText from '../CircularText';

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]"></div>
      
      <div className="absolute top-20 right-20 opacity-50 hidden lg:block">
        <CircularText 
          text="TAILWIND CSS COMPONENTS • " 
          spinDuration={15}
          onHover="speedUp"
        />
      </div>
      
      
      
      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
            Build Beautiful
            <br />
            Interfaces Faster
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-3xl mx-auto font-light">
            Production-ready Tailwind CSS components and templates.
            Copy, customize, and ship in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            
             <a href="/components"
              className="w-full sm:w-auto px-10 py-5 bg-white text-gray-950 rounded-xl hover:bg-gray-100 transition text-lg font-semibold"
            >
              Browse Components
            </a>
            
            
             <a href="/templates"
              className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white border border-gray-800 rounded-xl hover:bg-gray-800 transition text-lg font-semibold"
            >
              View Templates
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;