"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, AlertTriangle, Trash, Recycle } from "lucide-react"

// Map placeholder component
const MapPlaceholder = () => (
  <div className="w-full h-[500px] bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-md flex items-center justify-center relative overflow-hidden animate-fade-in">
    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
    <div className="text-center z-10 animate-slide-up">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
        <MapPin className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
      <p className="text-muted-foreground text-sm max-w-md">
        Map showing recycling centers and waste hotspots in your area
      </p>
      <div className="mt-4 flex justify-center space-x-4 animate-slide-in-left">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs">Recycling Centers</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-xs">Waste Hotspots</span>
        </div>
      </div>
    </div>

    {/* Mock location markers */}
    <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
    <div
      className="absolute top-1/2 right-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"
      style={{ animationDelay: "0.5s" }}
    ></div>
    <div
      className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"
      style={{ animationDelay: "1s" }}
    ></div>
    <div
      className="absolute top-3/4 right-1/3 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"
      style={{ animationDelay: "1.5s" }}
    ></div>

    {/* Interactive overlay */}
    <div className="absolute inset-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-all-smooth cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100">
      <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium">Click to interact with map</p>
      </div>
    </div>
  </div>
)

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("recycling")

  // Mock data for recycling centers
  const recyclingCenters = [
    {
      id: 1,
      name: "City Recycling Center",
      address: "123 Green St, Eco City",
      distance: "0.8 miles",
      types: ["Plastic", "Glass", "Paper", "Metal"],
      coordinates: [40.7128, -74.006],
    },
    {
      id: 2,
      name: "Community Drop-off Station",
      address: "456 Earth Ave, Eco City",
      distance: "1.2 miles",
      types: ["E-Waste", "Batteries", "Plastic"],
      coordinates: [40.7138, -74.005],
    },
    {
      id: 3,
      name: "Green Planet Recyclers",
      address: "789 Sustainable Blvd, Eco City",
      distance: "2.5 miles",
      types: ["Glass", "Metal", "Cardboard"],
      coordinates: [40.7148, -74.007],
    },
  ]

  // Mock data for waste hotspots
  const wasteHotspots = [
    {
      id: 1,
      location: "Riverside Park",
      address: "Near the east entrance",
      reportedBy: "EcoUser123",
      date: "2023-04-15",
      status: "Reported",
      wasteType: "Plastic Litter",
      coordinates: [40.7138, -74.008],
    },
    {
      id: 2,
      location: "Downtown Alley",
      address: "Between Main St and Oak St",
      reportedBy: "GreenWarrior",
      date: "2023-04-10",
      status: "Cleanup Scheduled",
      wasteType: "Illegal Dumping",
      coordinates: [40.7158, -74.004],
    },
  ]

  // Filter locations based on search query
  const filteredLocations =
    activeTab === "recycling"
      ? recyclingCenters.filter(
          (center) =>
            center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            center.types.some((type) => type.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      : wasteHotspots.filter(
          (hotspot) =>
            hotspot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotspot.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotspot.wasteType.toLowerCase().includes(searchQuery.toLowerCase()),
        )

  return (
    <div className="container py-8 md:py-12 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 animate-slide-up">Recycling Map</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6 animate-slide-in-left">
          <Card>
            <CardHeader>
              <CardTitle>Find Locations</CardTitle>
              <CardDescription>Search for recycling centers or report waste hotspots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by name, address, or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="transition-all-smooth focus:scale-105"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="transition-all-smooth hover:scale-110 bg-transparent"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <Tabs defaultValue="recycling" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recycling" className="transition-all-smooth">
                      <Recycle className="mr-2 h-4 w-4" />
                      Recycling Centers
                    </TabsTrigger>
                    <TabsTrigger value="hotspots" className="transition-all-smooth">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Waste Hotspots
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location, index) => (
                      <Card
                        key={location.id}
                        className="p-3 transition-all-smooth hover:shadow-lg hover:scale-105 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {activeTab === "recycling" ? (
                          // Recycling center card
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{(location as any).name}</h3>
                                <p className="text-sm text-muted-foreground">{(location as any).address}</p>
                              </div>
                              <Badge variant="outline" className="animate-fade-in">
                                {(location as any).distance}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(location as any).types.map((type: string, typeIndex: number) => (
                                <Badge
                                  key={type}
                                  variant="secondary"
                                  className="text-xs animate-scale-in"
                                  style={{ animationDelay: `${typeIndex * 0.1}s` }}
                                >
                                  {type}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex justify-end mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs transition-all-smooth hover:scale-110"
                              >
                                <MapPin className="h-3 w-3 mr-1" />
                                Directions
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Waste hotspot card
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{(location as any).location}</h3>
                                <p className="text-sm text-muted-foreground">{(location as any).address}</p>
                              </div>
                              <Badge
                                variant={(location as any).status === "Reported" ? "destructive" : "outline"}
                                className="animate-fade-in"
                              >
                                {(location as any).status}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">
                              <span className="text-muted-foreground">Type: </span>
                              {(location as any).wasteType}
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Reported: </span>
                              {(location as any).date}
                            </p>
                            <div className="flex justify-end mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs transition-all-smooth hover:scale-110"
                              >
                                <Trash className="h-3 w-3 mr-1" />
                                Volunteer
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground animate-fade-in">
                      No {activeTab === "recycling" ? "recycling centers" : "waste hotspots"} found
                    </p>
                  )}
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 transition-all-smooth hover:scale-105">
                  {activeTab === "recycling" ? "Add Missing Recycling Center" : "Report New Waste Hotspot"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 animate-slide-in-right">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Interactive Map</CardTitle>
              <CardDescription>Find recycling centers and waste hotspots near you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full rounded-md overflow-hidden">
                <MapPlaceholder />
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg animate-slide-up">
                <h4 className="font-medium mb-2">Map Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time location tracking</li>
                  <li>• Interactive markers for recycling centers and waste hotspots</li>
                  <li>• Route planning to nearest facilities</li>
                  <li>• Community reporting system</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
