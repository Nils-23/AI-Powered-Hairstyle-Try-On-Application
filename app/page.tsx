import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scissors, Sparkles, Users, Zap, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">BarberKit</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
          </nav>
          <Link href="/app">
            <Button>Try Now</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center py-16">
        <Image src="/landing-placeholder.jpg" alt="Try on hairstyles before you cut" width={600} height={400} className="rounded-xl shadow-lg mb-8" priority />
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Try on hairstyles before you cut</h1>
        <p className="text-lg text-muted-foreground text-center mb-6">Experience your new look with AI-powered hairstyle previews</p>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose BarberKit?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade AI technology meets user-friendly design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Instant Results</h3>
                <p className="text-muted-foreground">
                  Get your AI-generated hairstyle preview in under 60 seconds. No waiting, no hassle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Realistic Previews</h3>
                <p className="text-muted-foreground">
                  Advanced AI creates photorealistic previews that show exactly how you'll look with your new style.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">For Everyone</h3>
                <p className="text-muted-foreground">
                  Perfect for barbershops, salons, and individuals. Build confidence before the cut.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to your perfect hairstyle preview</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Your Photo",
                description: "Take or upload a clear selfie. Our AI works best with front-facing photos.",
                icon: "📸",
              },
              {
                step: "2",
                title: "Choose a Style",
                description: "Browse our curated collection of trending hairstyles and select your favorite.",
                icon: "✂️",
              },
              {
                step: "3",
                title: "Get Your Preview",
                description: "Watch as AI creates a realistic preview of you with your chosen hairstyle.",
                icon: "✨",
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground mx-auto mt-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Trusted by Professionals</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of barbers and clients who use BarberKit daily
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Mike's Barbershop",
                location: "New York, NY",
                review: "BarberKit has revolutionized how we consult with clients. No more miscommunication!",
                rating: 5,
              },
              {
                name: "Sarah Chen",
                location: "Los Angeles, CA",
                review: "I finally found the perfect hairstyle for my face shape. The AI is incredibly accurate.",
                rating: 5,
              },
              {
                name: "Elite Cuts Salon",
                location: "Chicago, IL",
                review: "Our clients love seeing the preview before we start cutting. Confidence booster!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.review}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to See Your New Look?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who've found their perfect hairstyle with BarberKit. Try it free today!
            </p>
          </div>

          <Link href="/app">
            <Button size="lg" className="text-lg px-8 py-6">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Scissors className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">BarberKit</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered hairstyle previews for the modern world.</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2 text-sm">
                <Link href="/app" className="block hover:text-primary">
                  Try Now
                </Link>
                <Link href="#features" className="block hover:text-primary">
                  Features
                </Link>
                <Link href="#pricing" className="block hover:text-primary">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="/help" className="block hover:text-primary">
                  Help Center
                </Link>
                <Link href="/contact" className="block hover:text-primary">
                  Contact Us
                </Link>
                <Link href="/api-docs" className="block hover:text-primary">
                  API Docs
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link href="/privacy" className="block hover:text-primary">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block hover:text-primary">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="block hover:text-primary">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BarberKit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
