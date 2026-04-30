"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { APIProvider, Map as GoogleMap, useMap } from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, User, Trophy, Calendar, ExternalLink } from "lucide-react";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

// GeoJSON URLs for real-world India constituency data
// Using 2014 datasets as they are stable and widely used for education
// GeoJSON URLs for real-world India constituency data
// Using highly-optimized nationwide datasets for best performance
const GEOJSON_PC_URL = "https://raw.githubusercontent.com/tecoholic/LokShaba2019/master/india_pc_2019_simplified.geojson";
const GEOJSON_AC_URL = "https://raw.githubusercontent.com/tecoholic/LokShaba2019/master/india_pc_2019_simplified.geojson"; // Fallback to PC for stability

// Sub-component to handle map data layer logic since it needs APIProvider context
function MapDataLayer({ 
  activeLayer, 
  hoveredItem, 
  setHoveredItem, 
  setSelectedConstituency, 
  setIsLoaded,
  dataCache
}: any) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const abortController = new AbortController();
    const url = activeLayer === "PC" ? GEOJSON_PC_URL : GEOJSON_AC_URL;

    const loadData = (data: any) => {
      map.data.forEach((feature) => map.data.remove(feature));
      try {
        map.data.addGeoJson(data);
        setIsLoaded(true);
      } catch (e) {
        console.error("Failed to add GeoJSON to map:", e);
      }
    };

    if (dataCache.has(url)) {
      loadData(dataCache.get(url));
    } else {
      setIsLoaded(false);
      map.data.forEach((feature) => map.data.remove(feature));
      
      fetch(url, { signal: abortController.signal })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          dataCache.set(url, data);
          loadData(data);
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error("GeoJSON Fetch Error:", err);
            setIsLoaded(true);
          }
        });
    }

    map.data.setStyle((feature) => {
      const pcName = feature.getProperty("PC_NAME") || feature.getProperty("pc_name") || "";
      const acName = feature.getProperty("AC_NAME") || feature.getProperty("ac_name") || "";
      const isHovered = hoveredItem && (pcName === hoveredItem.name || acName === hoveredItem.name);
      
      return {
        fillColor: activeLayer === "PC" ? "#FF9933" : "#2DD4BF",
        fillOpacity: isHovered ? 0.7 : 0.3,
        strokeColor: activeLayer === "PC" ? "#FF9933" : "#2DD4BF",
        strokeWeight: isHovered ? 2 : 0.8,
        strokeOpacity: 1,
        visible: true
      };
    });

    const mouseOverListener = map.data.addListener("mouseover", (event: any) => {
      const f = event.feature;
      const name = f.getProperty("PC_NAME") || f.getProperty("pc_name") || f.getProperty("AC_NAME") || f.getProperty("ac_name") || "Constituency";
      const state = f.getProperty("ST_NAME") || f.getProperty("st_name") || "India";
      setHoveredItem({ name, state });
    });

    const mouseOutListener = map.data.addListener("mouseout", () => {
      setHoveredItem(null);
    });

    const clickListener = map.data.addListener("click", (event: any) => {
      const f = event.feature;
      const name = f.getProperty("PC_NAME") || f.getProperty("pc_name") || f.getProperty("AC_NAME") || f.getProperty("ac_name") || "Constituency";
      const state = f.getProperty("ST_NAME") || f.getProperty("st_name") || "India";
      
      setSelectedConstituency({
        name,
        state,
        mp: "Constituency Details",
        party: activeLayer,
        color: activeLayer === "PC" ? "#FF9933" : "#2DD4BF",
        phase: "Live 2024",
        date: "Scheduled",
        performance: { attendance: "Loading...", debates: "Loading...", questions: "Loading..." }
      });
    });

    return () => {
      abortController.abort();
      google.maps.event.clearInstanceListeners(map.data);
    };
  }, [map, activeLayer, hoveredItem?.name, dataCache, setIsLoaded, setHoveredItem, setSelectedConstituency]);

  return null;
}

export function ConstituencyMap() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedConstituency, setSelectedConstituency] = useState<any>(null);
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeLayer, setActiveLayer] = useState<"PC" | "AC">("PC");
  
  // Cache for loaded GeoJSON data using globalThis to avoid naming conflicts with Map component
  const dataCache = useMemo(() => new globalThis.Map<string, any>(), []);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const hasValidKey = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.length > 10;

  return (
    <Card className="w-full h-full min-h-[700px] flex flex-col border-border py-0 shadow-2xl overflow-hidden bg-card/50 backdrop-blur-md">
      <CardHeader className="bg-muted/50 p-4 border-b border-border/50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Election Map
          </div>
          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-muted rounded-xl border border-border/50 mr-4">
              <button 
                onClick={() => setActiveLayer("PC")}
                className={`px-4 py-1 text-sm uppercase rounded-lg transition-all ${activeLayer === "PC" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
              >
                Parliamentary
              </button>
              <button 
                onClick={() => setActiveLayer("AC")}
                className={`px-4 py-1 text-sm uppercase rounded-lg transition-all ${activeLayer === "AC" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
              >
                Assembly
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-black text-primary uppercase tracking-widest">Live</span>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider font-bold opacity-60">Simple Interactive Voter Guide</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative min-h-[450px] bg-muted/20">
        {hasValidKey ? (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <div className="w-full h-full absolute inset-0">
              <GoogleMap
                defaultCenter={{ lat: 22.9734, lng: 78.6569 }}
                defaultZoom={4.5}
                disableDefaultUI={true}
                gestureHandling={'greedy'}
                onIdle={() => setIsLoaded(true)}
                styles={isDark ? DARK_MAP_STYLE : []}
              >
                <MapDataLayer 
                  activeLayer={activeLayer}
                  hoveredItem={hoveredItem}
                  setHoveredItem={setHoveredItem}
                  setSelectedConstituency={setSelectedConstituency}
                  setIsLoaded={setIsLoaded}
                  dataCache={dataCache}
                />
              </GoogleMap>

              {/* Hover Intelligence Tooltip */}
              <AnimatePresence>
                {hoveredItem && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none z-[100]"
                  >
                    <div className="bg-background/95 backdrop-blur-xl border border-border px-6 py-3 rounded-2xl shadow-2xl flex flex-col items-center gap-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                        {activeLayer === "PC" ? "Parliamentary" : "Assembly"}
                      </p>
                      <h4 className="text-lg font-black tracking-tight">{hoveredItem.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{hoveredItem.state}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isLoaded && (
                <div className="absolute inset-0 z-10 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-full h-full max-w-4xl max-h-[500px] relative overflow-hidden rounded-3xl border border-border/50 bg-muted/20">
                    {/* Shimmering Map Outlines */}
                    <motion.div 
                      animate={{ 
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center opacity-10"
                    >
                      <MapPin className="w-64 h-64 text-primary" strokeWidth={0.5} />
                    </motion.div>
                    
                    {/* Pulsing Loading Indicator */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                      <div className="relative">
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -inset-4 bg-primary/20 rounded-full blur-xl"
                        />
                        <div className="relative bg-background p-4 rounded-2xl border border-border shadow-2xl">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-foreground mb-1">Electoral Pulse</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Nationwide Boundaries...</p>
                      </div>
                    </div>

                    {/* Shimmer Effect */}
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12"
                    />
                  </div>
                </div>
              )}
            </div>
          </APIProvider>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-card">
            <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center border border-border">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Awaiting Connection</h3>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm">
              Please connect your Google Maps service to see the Constituency Pulse in your area.
            </p>
          </div>
        )}

        <AnimatePresence>
          {selectedConstituency && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 bottom-4 w-full max-w-[320px] bg-background/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-border z-10 overflow-hidden flex flex-col"
            >
              <div className={`h-2 w-full`} style={{ backgroundColor: selectedConstituency.color }} />
              
              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-2xl tracking-tighter leading-tight">{selectedConstituency.name}</h4>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{selectedConstituency.state}</p>
                  </div>
                  <button 
                    className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setSelectedConstituency(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-50">Current MP</p>
                        <p className="text-sm font-bold">{selectedConstituency.mp}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-xs font-bold opacity-70">Party</span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest" style={{ backgroundColor: selectedConstituency.color }}>
                        {selectedConstituency.party}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                      <Trophy className="w-3 h-3" /> Performance Overview
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-card border border-border rounded-xl">
                        <p className="text-[10px] font-black opacity-40 uppercase">Attendance</p>
                        <p className="text-lg font-black text-primary">{selectedConstituency.performance.attendance}</p>
                      </div>
                      <div className="p-3 bg-card border border-border rounded-xl">
                        <p className="text-[10px] font-black opacity-40 uppercase">Debates</p>
                        <p className="text-lg font-black text-primary">{selectedConstituency.performance.debates}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-3 flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> 2024 Schedule
                    </h5>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-500/80">{selectedConstituency.phase}</span>
                      <span className="text-sm font-bold text-emerald-400">{selectedConstituency.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border-t border-border">
                <button className="w-full py-3 bg-card border border-border rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted transition-colors">
                  Full Profile <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
