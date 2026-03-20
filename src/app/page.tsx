import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AppExplainer from "@/components/AppExplainer";
import WhyXVault from "@/components/WhyXVault";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AppExplainer />
        <WhyXVault />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
