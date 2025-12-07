function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-2xl font-bold text-white">
            TailwindX
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-gray-400 hover:text-white transition">
              Documentation
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              FAQs
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Contact
            </a>
          </div>
          
          <p className="text-gray-500 text-sm">
            © 2025 TailwindX
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;