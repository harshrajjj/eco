import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, MapPin, Trophy, Mic, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background animate-fade-in">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4 animate-slide-in-left">
              <div className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium mb-2 animate-bounce-in">
                AI-Powered Waste Management
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-slide-up">
                EcoSnap X – Unified Smart Waste Assistant
              </h1>
              <p className="text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
                Detect, classify, and properly dispose of waste with our AI-powered platform. Join the community making
                our planet cleaner.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 transition-all-smooth hover:scale-105"
                >
                  <Link href="/detect">
                    Start Detecting <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="transition-all-smooth hover:scale-105 bg-transparent"
                >
                  <Link href="/map">Find Recycling Centers</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center animate-slide-in-right">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-50 animate-blob"></div>
                <div className="absolute -bottom-8 right-4 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 -left-20 w-72 h-72 bg-yellow-200 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
                <div className="relative animate-scale-in">
                  <img
                    alt="EcoSnap X App Interface"
                    className="mx-auto rounded-lg shadow-xl transition-all-smooth hover:shadow-2xl"
                    src="/placeholder.svg?height=600&width=400&text=EcoSnap+X+App"
                    width="400"
                    height="600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 animate-fade-in">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-slide-up">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium">
                Core Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                All-in-One Waste Management
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                EcoSnap X combines cutting-edge AI with community engagement to revolutionize waste management.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Camera,
                title: "AI Image Detection",
                description:
                  "Detect and classify waste using your phone camera. Works with plastic, glass, metal, e-waste, and more.",
                delay: "0s",
              },
              {
                icon: Mic,
                title: "Voice Assistant",
                description:
                  "Ask questions about waste disposal and get instant, location-specific guidance in multiple languages.",
                delay: "0.1s",
              },
              {
                icon: MapPin,
                title: "Map Integration",
                description: "Find nearby recycling centers, trash bins, and report waste hotspots in your community.",
                delay: "0.2s",
              },
              {
                icon: Trophy,
                title: "Gamification & Rewards",
                description:
                  "Earn points, track eco-streaks, and compete with friends to encourage sustainable habits.",
                delay: "0.3s",
              },
              {
                icon: BarChart3,
                title: "Waste Analytics",
                description:
                  "Track types of waste reported by users in each locality with our comprehensive dashboard.",
                delay: "0.4s",
              },
              {
                icon: () => (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-green-700 dark:text-green-300"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "Community Engagement",
                description:
                  "Connect with NGOs and recyclers, report illegal dumping, and participate in community cleanup events.",
                delay: "0.5s",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm bg-card transition-all-smooth hover:shadow-lg hover:scale-105 animate-slide-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 transition-all-smooth">
                  <feature.icon className="w-6 h-6 text-green-700 dark:text-green-300" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-center text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950 animate-fade-in">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-slide-up">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Join the EcoSnap X Community
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Be part of the solution. Start detecting, reporting, and properly disposing of waste today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 animate-bounce-in" style={{ animationDelay: "0.3s" }}>
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 transition-all-smooth hover:scale-105"
              >
                <Link href="/detect">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="transition-all-smooth hover:scale-105 bg-transparent"
              >
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
