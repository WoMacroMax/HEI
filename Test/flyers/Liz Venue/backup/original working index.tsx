import { useState } from "react";
import EntranceDoors from "@/components/EntranceDoors";
import GalleryCarousel from "@/components/GalleryCarousel";
import LocationCard from "@/components/LocationCard";
import QROverlay from "@/components/QROverlay";
import RSVPModal from "@/components/RSVPModal";
import SectionNavigator from "@/components/SectionNavigator";
import storeFront from "@/assets/store-front.jpeg";
import pinkGarden from "@/assets/pink-garden-bg.jpg";
import lizIcon from "@/assets/liz-venue-icon.png";
import { Sparkles, Calendar, MapPin, TableProperties, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showSite, setShowSite] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showTables, setShowTables] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);

  return (
    <>
      {!showSite && <EntranceDoors onComplete={() => setShowSite(true)} />}

      <div
        className={`min-h-screen transition-all duration-600 ${
          showSite ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Hero Section */}
        <header id="hero-section" className="relative min-h-[60vh] flex items-end overflow-hidden rounded-b-3xl pt-16 md:pt-20">
          <video
            src="https://flyers.womacromax.com/Liz%20Venue/assets/WelcomebyLiz..webm"
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(0deg, hsl(330 70% 55% / 0.8) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 container mx-auto px-6 pb-16">
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-4 drop-shadow-2xl animate-fade-up tracking-tight flex items-center justify-center gap-3 md:gap-4">
              <span>Liz</span>
              <img src={lizIcon} alt="" className="h-[0.85em] w-auto object-contain drop-shadow-lg" />
              <span>Venue</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/95 font-elegant font-semibold drop-shadow-lg animate-fade-up text-center" style={{ animationDelay: "0.1s" }}>
              4th Anniversary Celebration
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12 space-y-12">
          {/* About Section */}
          <section 
            id="about-section"
            className="bg-card rounded-2xl p-8 md:p-12 shadow-lg animate-fade-up relative overflow-hidden"
            style={{
              backgroundImage: `url(${pinkGarden})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-card/95 backdrop-blur-sm" />
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-4xl font-bold">Celebrating 4 Years of Elegance</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-lg leading-relaxed">
                <strong className="text-primary inline-flex items-center gap-1.5">
                  <span>Liz</span>
                  <img src={lizIcon} alt="" className="h-[1em] w-auto object-contain inline-block" />
                  <span>Venue</span>
                </strong> is celebrating 4 years of unforgettable events at our elegant Bayonne venue, located at <strong>512 Broadway, Bayonne, NJ 07002</strong>.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                To mark this milestone, <strong className="inline-flex items-center gap-1.5">
                  <span>Liz</span>
                  <img src={lizIcon} alt="" className="h-[1em] w-auto object-contain inline-block" />
                  <span>Venue</span>
                </strong> is hosting a special anniversary event that reflects the same warmth, creativity, and professionalism that have earned us a stellar reputation over the years. Known for transforming birthdays, weddings, baby showers, and corporate gatherings into stunning experiences, our venue offers a clean, classy, and beautifully appointed space perfect for capturing memories.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                With over 15 years of hands-on event planning expertise, Liz and her team bring visions to life with thoughtful décor, seamless service, and a commitment to making every occasion truly memorable.
              </p>
            </div>

            {/* Invitation callout */}
            <div className="mt-8 p-6 rounded-xl" style={{ 
              background: "linear-gradient(135deg, hsl(330 30% 98%) 0%, hsl(320 25% 96%) 100%)",
              borderLeft: "4px solid hsl(var(--primary))"
            }}>
              <div className="flex items-start gap-3 mb-3">
                <Calendar className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <h3 className="text-2xl font-bold text-primary">You're Invited! 🎊</h3>
              </div>
              <p className="text-foreground leading-relaxed">
                Join us for an unforgettable evening as we celebrate 4 years of elegance, creativity, and cherished memories! Whether you've been part of our journey or are just discovering the magic, we'd be honored to have you with us. Kindly RSVP below to reserve your spot and help us toast to 4 amazing years of unforgettable events—and the many more to come!
              </p>
            </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section 
            id="gallery-section"
            className="bg-card rounded-2xl p-8 md:p-12 shadow-lg animate-fade-up relative overflow-hidden"
            style={{
              backgroundImage: `url(${pinkGarden})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-card/95 backdrop-blur-sm" />
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-6">Our Beautiful Events</h2>
              <GalleryCarousel />
            </div>
          </section>

          {/* Location Section */}
          <section 
            id="location-section"
            className="bg-card rounded-2xl p-8 md:p-12 shadow-lg animate-fade-up relative overflow-hidden"
            style={{
              backgroundImage: `url(${pinkGarden})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-card/95 backdrop-blur-sm" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-display font-bold">Event Location</h2>
              </div>
              
              <div className="mb-6">
                <p className="text-xl font-semibold mb-2 inline-flex items-center gap-2">
                  <span>Liz</span>
                  <img src={lizIcon} alt="" className="h-[1em] w-auto object-contain inline-block" />
                  <span>Venue</span>
                </p>
                <p className="text-muted-foreground mb-1">512 Broadway</p>
                <p className="text-muted-foreground mb-4">Bayonne, NJ 07002</p>
                <p className="text-muted-foreground leading-relaxed">
                  Our beautiful venue in Bayonne has been the backdrop for countless celebrations over the past 4 years. From intimate gatherings to grand celebrations, we've created magical moments that last a lifetime. Come see where the magic happens and celebrate with us!
                </p>
              </div>

              <LocationCard />
            </div>
          </section>

          {/* Action Buttons Section */}
          <section 
            id="actions-section"
            className="bg-card rounded-2xl p-8 md:p-12 shadow-lg animate-fade-up relative overflow-hidden"
            style={{
              backgroundImage: `url(${pinkGarden})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-card/95 backdrop-blur-sm" />
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-8 text-center">Explore More</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* RSVP Button */}
                <Button
                  onClick={() => setShowRSVP(true)}
                  size="lg"
                  className="h-auto py-6 px-6 flex flex-col items-center gap-3 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 animate-float-gentle"
                  style={{ animationDelay: "0s" }}
                >
                  <Calendar className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-bold text-lg">RSVP Now</div>
                    <div className="text-xs opacity-90">Reserve Your Spot</div>
                  </div>
                </Button>

                {/* Tables & Supplies Button */}
                <Button
                  onClick={() => setShowTables(true)}
                  size="lg"
                  className="h-auto py-6 px-6 flex flex-col items-center gap-3 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 animate-float-gentle"
                  style={{ animationDelay: "0.1s" }}
                >
                  <TableProperties className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-bold text-lg">Tables & Supplies</div>
                    <div className="text-xs opacity-90">See Our Inventory</div>
                  </div>
                </Button>

                {/* Community Vibe Button */}
                <Button
                  onClick={() => setShowCommunity(true)}
                  size="lg"
                  className="h-auto py-6 px-6 flex flex-col items-center gap-3 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 animate-float-gentle"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Heart className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-bold text-lg">Bayonne Vybe</div>
                    <div className="text-xs opacity-90">Community Spirit</div>
                  </div>
                </Button>

                {/* Share Event Button */}
                <Button
                  onClick={() => setShowQR(true)}
                  size="lg"
                  className="h-auto py-6 px-6 flex flex-col items-center gap-3 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 animate-float-gentle"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Share2 className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-bold text-lg">Share Event</div>
                    <div className="text-xs opacity-90">QR Code</div>
                  </div>
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-card py-8 mt-12 border-t">
          <div className="container mx-auto px-6 text-center text-muted-foreground">
            <p className="mb-2 inline-flex items-center justify-center gap-1.5">
              <span>© 2025</span>
              <span className="inline-flex items-center gap-1.5">
                <span>Liz</span>
                <img src={lizIcon} alt="" className="h-[1em] w-auto object-contain inline-block" />
                <span>Venue</span>
              </span>
              <span>. All rights reserved.</span>
            </p>
            <p>512 Broadway, Bayonne, NJ 07002</p>
          </div>
        </footer>

        {/* Section Navigator */}
        <SectionNavigator />

        {/* Modals */}
        <RSVPModal open={showRSVP} onClose={() => setShowRSVP(false)} />
        <QROverlay open={showQR} onClose={() => setShowQR(false)} />
        
        {/* Tables Modal */}
        {showTables && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowTables(false)}>
            <div className="relative bg-card rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowTables(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">
                <span className="text-2xl">×</span>
              </button>
              <h3 className="text-3xl font-display font-bold mb-6">Tables & Supplies</h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  At <strong className="text-foreground inline-flex items-center gap-1.5">
                    <span>Liz</span>
                    <img src={lizIcon} alt="" className="h-[1em] w-auto object-contain inline-block" />
                    <span>Venue</span>
                  </strong>, we provide a comprehensive inventory of elegant tables, chairs, linens, and decor supplies to bring your vision to life.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Premium table settings and linens</li>
                  <li>Elegant chair rentals with custom covers</li>
                  <li>Centerpiece arrangements and floral displays</li>
                  <li>Lighting and backdrop options</li>
                  <li>Custom decor packages for any theme</li>
                </ul>
                <p className="text-lg leading-relaxed">
                  Contact us to discuss your event needs and explore our full range of supplies to create the perfect ambiance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Community Modal */}
        {showCommunity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCommunity(false)}>
            <div className="relative bg-card rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowCommunity(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">
                <span className="text-2xl">×</span>
              </button>
              <h3 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-primary" />
                We ARE the Vybe of Bayonne
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  For 4 years, <strong className="text-foreground inline-flex items-center gap-1.5">
                    <span>Liz</span>
                    <img src={lizIcon} alt="" className="h-[1em] w-auto object-contain inline-block" />
                    <span>Venue</span>
                  </strong> has been more than just a venue—we're woven into the fabric of the Bayonne community.
                </p>
                <p className="text-lg leading-relaxed">
                  From local celebrations to community gatherings, we've been honored to host the moments that matter most to our neighbors. Our commitment goes beyond beautiful events; it's about creating spaces where friendships flourish, families unite, and memories are made.
                </p>
                <p className="text-lg leading-relaxed">
                  We collaborate with local businesses, support community initiatives, and take pride in being a cornerstone of Bayonne's vibrant spirit. When you celebrate with us, you're not just booking a venue—you're joining a community legacy.
                </p>
                <p className="text-xl font-semibold text-primary text-center mt-6">
                  Together, we ARE the Vybe of Bayonne! 💜
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Index;