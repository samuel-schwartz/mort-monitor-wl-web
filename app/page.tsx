import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, Bell, DollarSign, Calendar, Home, Percent, Building2, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold">MortMonitor</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="sm:size-default">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <Badge className="mb-4 text-sm">White-Label Platform for Mortgage Brokers</Badge>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          Automated Refinancing Alerts for Your Clients
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
          Provide your clients with automated mortgage monitoring and refinancing alerts under your own brand. Stay
          top-of-mind and capture more refinancing opportunities with our white-label platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-6 sm:px-8 bg-transparent">
              Broker Login
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-16">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Brokers Choose MortMonitor</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">White-Label Branding</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Customize with your logo, colors, and domain. Your clients see your brand, not ours.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">Client Management</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Manage all your clients from one dashboard. Add properties, configure alerts, and track opportunities.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">ROI Analytics</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Track potential savings across your portfolio and demonstrate value to your clients.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-16">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Alert Types Your Clients Will Love</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border shadow-sm relative">
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Popular</Badge>
            <CardHeader>
              <DollarSign className="h-8 w-8 text-success mb-4" />
              <CardTitle className="text-lg sm:text-xl">Monthly Payment Savings</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Alert when clients can save a specific amount on monthly payments by refinancing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm relative">
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Popular</Badge>
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">Break-Even Alerts</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Notify when refinancing costs will be recouped within the desired timeframe
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <Home className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">PMI Removal</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Alert when loan-to-value ratio reaches the threshold to eliminate PMI payments
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <Percent className="h-8 w-8 text-warning mb-4" />
              <CardTitle className="text-lg sm:text-xl">Better Rate Alerts</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Notify when rates drop below current rate by the target amount
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <TrendingDown className="h-8 w-8 text-success mb-4" />
              <CardTitle className="text-lg sm:text-xl">Lifetime Interest Savings</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Alert when refinancing could save a specific amount in total interest
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <Bell className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">Multiple Properties</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Monitor alerts for multiple properties per client from one dashboard
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="h-5 w-5" />
                <span className="font-bold text-base">MortMonitor</span>
              </div>
              <p className="text-gray-400 text-sm">White-label refinancing alert platform for mortgage brokers</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Broker Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="mailto:support@mortmonitor.com" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="mailto:help@mortmonitor.com" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 MortMonitor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
