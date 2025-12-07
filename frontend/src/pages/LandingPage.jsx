import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Showcase from '../components/landing/Showcase';
import WhyUs from '../components/landing/WhyUs';
import HowItWorks from '../components/landing/HowItWorks';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

function LandingPage() {
  return (
    <div className="bg-gray-900">
      <Hero />
      <Features />
      <Showcase />
      <WhyUs />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;