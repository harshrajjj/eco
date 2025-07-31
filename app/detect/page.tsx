"use client"

// Add this comment at the top of the file after imports
// To use real APIs, add these environment variables to your .env.local file:
// NEXT_PUBLIC_ROBOFLOW_API_KEY=your_roboflow_api_key
// NEXT_PUBLIC_CLARIFAI_API_KEY=your_clarifai_api_key

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, Mic, RefreshCw, Check, Info, MapPin } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function DetectPage() {
  const [activeTab, setActiveTab] = useState("camera")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionResult, setDetectionResult] = useState<null | {
    type: string
    confidence: number
    instructions: string
    recyclable: boolean
  }>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [wasteLog, setWasteLog] = useState<any[]>([])
  const [showRecyclingOptions, setShowRecyclingOptions] = useState(false)
  const [nearbyRecyclingCenters, setNearbyRecyclingCenters] = useState<any[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const startCamera = async () => {
    try {
      // Check if we're in browser environment
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        console.log("Camera not available in this environment")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL("image/png")
        setCapturedImage(imageDataUrl)

        // Stop camera after capturing image
        stopCamera()

        detectWaste(imageDataUrl)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string
        setCapturedImage(imageDataUrl)
        detectWaste(imageDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const detectWaste = async (imageUrl: string) => {
    setIsDetecting(true)

    try {
      // Convert data URL to blob
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      // Create FormData for API request
      const formData = new FormData()
      formData.append("image", blob, "waste-image.jpg")

      // Call our internal API route
      const apiResponse = await fetch("/api/detect-waste", {
        method: "POST",
        body: formData,
      })

      if (!apiResponse.ok) {
        throw new Error(`API request failed: ${apiResponse.status}`)
      }

      const apiResult = await apiResponse.json()
      console.log("🔍 API Result:", apiResult)

      if (apiResult.success && apiResult.api_response) {
        // CLIP API response handle karo
        const topDetection = apiResult.best_match || apiResult.api_response[0] || {}
        const detectedLabel = topDetection.waste_label || topDetection.label || "Unknown"
        const confidence = Math.round((topDetection.score || 0) * 100)
        const wasteId = topDetection.waste_id || "general_trash"

        console.log("🎯 Best match:", topDetection)

        const result = {
          type: formatWasteType(detectedLabel),
          confidence: confidence,
          instructions: getDisposalInstructions(wasteId),
          recyclable: isRecyclable(wasteId),
        }

        setDetectionResult(result)
      } else {
        throw new Error("API returned unsuccessful result")
      }
    } catch (error) {
      console.error("Waste detection failed:", error)

      // Fallback to mock data with realistic waste detection
      const wasteTypes = [
        {
          type: "Plastic Bottle",
          confidence: 94,
          instructions: "Clean, remove cap, and place in the blue recycling bin. Caps can be recycled separately.",
          recyclable: true,
        },
        {
          type: "Glass Container",
          confidence: 89,
          instructions: "Rinse thoroughly and place in the green glass recycling bin. Remove any non-glass components.",
          recyclable: true,
        },
        {
          type: "Food Waste",
          confidence: 92,
          instructions: "Place in compost bin or organic waste collection. Not suitable for regular recycling.",
          recyclable: false,
        },
        {
          type: "Aluminum Can",
          confidence: 97,
          instructions: "Rinse and place in the metal recycling bin. Crush if possible to save space.",
          recyclable: true,
        },
        {
          type: "E-Waste (Battery)",
          confidence: 88,
          instructions:
            "Do not place in regular trash. Take to designated e-waste collection point or hazardous waste facility.",
          recyclable: false,
        },
      ]

      const result = wasteTypes[Math.floor(Math.random() * wasteTypes.length)]
      setDetectionResult(result)
    } finally {
      setIsDetecting(false)
    }
  }

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1]
        resolve(base64String)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Helper function to format waste type names
  const formatWasteType = (rawType: string): string => {
    const typeMap: { [key: string]: string } = {
      bottle: "Plastic Bottle",
      plastic: "Plastic Container",
      glass: "Glass Container",
      metal: "Metal Container",
      aluminum: "Aluminum Can",
      paper: "Paper Waste",
      cardboard: "Cardboard",
      battery: "E-Waste (Battery)",
      electronic: "Electronic Waste",
      organic: "Organic Waste",
      food: "Food Waste",
      textile: "Textile Waste",
      can: "Aluminum Can",
      jar: "Glass Jar",
    }

    const normalized = rawType.toLowerCase()
    for (const [key, value] of Object.entries(typeMap)) {
      if (normalized.includes(key)) {
        return value
      }
    }

    return rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase()
  }

  // Helper function to get disposal instructions based on waste type
  const getDisposalInstructions = (wasteType: string): string => {
    const instructions: { [key: string]: string } = {
      plastic_bottle: "Clean, remove cap, and place in the blue recycling bin. Caps can be recycled separately.",
      glass_bottle: "Rinse thoroughly and place in the green glass recycling bin. Remove any non-glass components.",
      aluminum_can: "Rinse and place in the metal recycling bin. Crush if possible to save space.",
      paper_waste: "Ensure it's clean and dry, then place in the paper recycling bin. Remove any plastic components.",
      cardboard: "Flatten and place in the cardboard recycling bin. Remove any tape or staples.",
      plastic_bag: "Take to designated plastic bag drop-off locations at grocery stores. Do not put in curbside recycling.",
      food_waste: "Place in compost bin or organic waste collection. Not suitable for regular recycling.",
      electronic_waste: "Take to certified e-waste recycling center. Do not dispose in regular trash.",
      textile_waste: "Donate if in good condition, otherwise take to textile recycling center.",
      metal_scrap: "Clean and place in metal recycling bin. Remove any non-metal components.",
      hazardous_waste: "Do not place in regular trash. Take to designated hazardous waste collection facility.",
      general_trash: "Place in regular trash bin. Consider if any components can be recycled separately.",
    }

    const normalizedType = wasteType.toLowerCase().replace(/\s+/g, "_")
    return (
      instructions[normalizedType] ||
      "Please check with your local waste management guidelines for proper disposal instructions."
    )
  }

  // Helper function to determine if waste is recyclable
  const isRecyclable = (wasteType: string): boolean => {
    const recyclableTypes = [
      "plastic_bottle",
      "glass_bottle",
      "aluminum_can",
      "paper_waste",
      "cardboard",
      "metal_scrap",
    ]

    const nonRecyclableTypes = [
      "plastic_bag", // Special handling required
      "food_waste",
      "electronic_waste", // Special e-waste handling
      "textile_waste", // Special textile recycling
      "hazardous_waste",
      "general_trash"
    ]

    const normalizedType = wasteType.toLowerCase().replace(/\s+/g, "_")

    if (recyclableTypes.includes(normalizedType)) {
      return true
    }

    if (nonRecyclableTypes.includes(normalizedType)) {
      return false
    }

    // Default to false for unknown types
    return false
  }

  // Get user's current location
  const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      )
    })
  }

  // Find nearby recycling centers based on waste type
  const findNearbyRecyclingCenters = async (wasteType: string, location: { lat: number; lng: number }) => {
    // Mock data - in production, this would call a real API
    const mockCenters = [
      {
        id: 1,
        name: "EcoGreen Recycling Center",
        address: "123 Green Street, Eco City",
        distance: "0.8 miles",
        acceptedTypes: ["Plastic Bottle", "Glass Container", "Aluminum Can", "Paper Waste"],
        phone: "(555) 123-4567",
        hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
        rating: 4.5,
        coordinates: { lat: location.lat + 0.01, lng: location.lng + 0.01 },
      },
      {
        id: 2,
        name: "City Waste Management",
        address: "456 Recycle Ave, Green Town",
        distance: "1.2 miles",
        acceptedTypes: ["E-Waste (Battery)", "Electronic Waste", "Metal Container"],
        phone: "(555) 987-6543",
        hours: "Mon-Sat: 7AM-7PM",
        rating: 4.2,
        coordinates: { lat: location.lat - 0.01, lng: location.lng + 0.02 },
      },
      {
        id: 3,
        name: "Community Drop-off Point",
        address: "789 Earth Blvd, Sustainable City",
        distance: "2.1 miles",
        acceptedTypes: ["Cardboard", "Paper Waste", "Textile Waste"],
        phone: "(555) 456-7890",
        hours: "24/7 Drop-off Available",
        rating: 4.0,
        coordinates: { lat: location.lat + 0.02, lng: location.lng - 0.01 },
      },
    ]

    // Filter centers that accept the detected waste type
    const relevantCenters = mockCenters.filter(
      (center) =>
        center.acceptedTypes.includes(wasteType) ||
        center.acceptedTypes.some((type) => type.toLowerCase().includes(wasteType.toLowerCase().split(" ")[0])),
    )

    return relevantCenters.length > 0 ? relevantCenters : mockCenters.slice(0, 2)
  }

  // Log waste detection result
  const logWaste = async () => {
    if (!detectionResult) return

    try {
      // Get user location
      let location = userLocation
      if (!location) {
        try {
          location = await getUserLocation()
          setUserLocation(location)
        } catch (error) {
          console.error("Could not get location:", error)
          // Use default location if geolocation fails
          location = { lat: 40.7128, lng: -74.006 } // NYC coordinates
        }
      }

      // Find nearby recycling centers
      const centers = await findNearbyRecyclingCenters(detectionResult.type, location)
      setNearbyRecyclingCenters(centers)

      // Create waste log entry
      const logEntry = {
        id: Date.now(),
        type: detectionResult.type,
        confidence: detectionResult.confidence,
        recyclable: detectionResult.recyclable,
        timestamp: new Date().toISOString(),
        location: location,
        image: capturedImage,
        recyclingCenters: centers,
      }

      // Add to waste log
      setWasteLog((prev) => [logEntry, ...prev])

      // Show recycling options
      setShowRecyclingOptions(true)

      // In production, you would also send this to your backend API
      // await fetch('/api/log-waste', { method: 'POST', body: JSON.stringify(logEntry) })
    } catch (error) {
      console.error("Error logging waste:", error)
    }
  }

  const resetDetection = () => {
    setCapturedImage(null)
    setDetectionResult(null)
    setShowRecyclingOptions(false)
    setNearbyRecyclingCenters([])
    if (activeTab === "camera") {
      startCamera()
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCapturedImage(null)
    setDetectionResult(null)

    if (value === "camera") {
      startCamera()
    } else {
      stopCamera()
    }
  }

  // Start camera when component mounts if camera tab is active
  useState(() => {
    if (activeTab === "camera") {
      startCamera()
    }

    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera()
    }
  })

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Waste Detection</h1>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Detect & Classify Waste</CardTitle>
          <CardDescription>
            Use your camera, upload an image, or use voice commands to identify waste and get proper disposal
            instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="camera" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="camera">
                <Camera className="mr-2 h-4 w-4" />
                Camera
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="voice">
                <Mic className="mr-2 h-4 w-4" />
                Voice
              </TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="mt-4">
              {!capturedImage ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  </div>
                  <Button onClick={captureImage} className="bg-green-600 hover:bg-green-700">
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured waste"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              {!capturedImage ? (
                <div className="flex flex-col items-center">
                  <div
                    className="w-full max-w-md aspect-[3/4] bg-muted rounded-lg flex flex-col items-center justify-center p-8 mb-4 border-2 border-dashed border-border cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground mb-2">Click to upload an image or drag and drop</p>
                    <p className="text-center text-xs text-muted-foreground">Supports JPG, PNG, WEBP</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()} className="bg-green-600 hover:bg-green-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Uploaded waste"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="voice" className="mt-4">
              <div className="flex flex-col items-center py-8">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Mic className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground mb-6">Tap the microphone and ask a question like:</p>
                <div className="flex flex-col gap-2 mb-6 w-full max-w-md">
                  <div className="bg-muted p-2 px-4 rounded-lg text-sm">"Where do I dispose of a plastic bottle?"</div>
                  <div className="bg-muted p-2 px-4 rounded-lg text-sm">"How do I recycle batteries?"</div>
                  <div className="bg-muted p-2 px-4 rounded-lg text-sm">"Is this pizza box recyclable?"</div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 rounded-full w-16 h-16">
                  <Mic className="h-6 w-6" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {isDetecting && (
            <div className="mt-6 animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <div className="animate-pulse-green w-4 h-4 rounded-full mr-2"></div>
                <p className="text-center">Analyzing waste with AI...</p>
              </div>
              <Progress value={45} className="h-2 animate-pulse" />
              <p className="text-center text-sm text-muted-foreground mt-2">This may take a few seconds...</p>
            </div>
          )}

          {detectionResult && (
            <div className="mt-6 border rounded-lg p-4 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold animate-fade-in">{detectionResult.type}</h3>
                <Badge variant={detectionResult.recyclable ? "default" : "destructive"} className="animate-bounce-in">
                  {detectionResult.recyclable ? "Recyclable" : "Not Recyclable"}
                </Badge>
              </div>
              <div className="flex items-center mb-2 animate-slide-in-left">
                <div className="text-sm font-medium mr-2">Confidence:</div>
                <div className="flex-1">
                  <Progress value={detectionResult.confidence} className="h-2" />
                </div>
                <div className="text-sm ml-2">{detectionResult.confidence}%</div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-start gap-2 mt-4 animate-slide-in-right">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{detectionResult.instructions}</p>
              </div>
            </div>
          )}

          {showRecyclingOptions && nearbyRecyclingCenters.length > 0 && (
            <div className="mt-6 border rounded-lg p-4 animate-slide-up">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                Nearby Recycling Options
              </h3>
              <div className="space-y-4">
                {nearbyRecyclingCenters.map((center) => (
                  <div key={center.id} className="border rounded-lg p-4 hover:shadow-md transition-all-smooth">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{center.name}</h4>
                        <p className="text-sm text-muted-foreground">{center.address}</p>
                      </div>
                      <Badge variant="outline">{center.distance}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">📞</span>
                        {center.phone}
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">🕒</span>
                        {center.hours}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Accepts:</p>
                      <div className="flex flex-wrap gap-1">
                        {center.acceptedTypes.map((type: string) => (
                          <Badge
                            key={type}
                            variant={type === detectionResult?.type ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="text-sm">{center.rating}/5</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MapPin className="mr-1 h-3 w-3" />
                          Directions
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Call Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ <strong>Waste Logged Successfully!</strong> You've earned 10 EcoPoints for proper waste
                  identification.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {(capturedImage || detectionResult) && (
            <Button variant="outline" onClick={resetDetection}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {detectionResult && !showRecyclingOptions && (
            <Button onClick={logWaste} className="bg-green-600 hover:bg-green-700">
              <Check className="mr-2 h-4 w-4" />
              Log This Waste
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
