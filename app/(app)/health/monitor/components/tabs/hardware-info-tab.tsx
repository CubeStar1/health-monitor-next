"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image'; // For optimized images
import { cn } from "@/lib/utils";
import { Cpu, Wifi, ThermometerIcon, Activity, Heart, Monitor } from 'lucide-react'; // Example icons

interface HardwareComponent {
  id: string;
  category: string;
  name: string;
  modelName?: string;
  imagePath: string; // You'll need to add images to your /public folder
  description: string;
  icon: React.ReactElement;
  colorTheme: string; // Tailwind CSS classes for background/gradient
}

// Updated data with new image paths
const hardwareComponents: HardwareComponent[] = [
  {
    id: 'mcu',
    category: 'Microcontroller',
    name: 'Arduino UNO R3',
    imagePath: '/images/sensors/arduino-uno-r3.jpeg',
    description: 'The main processing unit responsible for reading sensor data and managing communication.',
    icon: <Cpu className="h-6 w-6" />,
    colorTheme: 'bg-gradient-to-br from-purple-500 to-indigo-600',
  },
  {
    id: 'wifi',
    category: 'WiFi Module',
    name: 'ESP8266',
    imagePath: '/images/sensors/esp-8266.jpg',
    description: 'Enables wireless communication to send sensor data to the cloud or a local server.',
    icon: <Wifi className="h-6 w-6" />,
    colorTheme: 'bg-gradient-to-br from-sky-500 to-cyan-600',
  },
  {
    id: 'spo2',
    category: 'SPO2 Sensor',
    name: 'MAX30102',
    imagePath: '/images/sensors/max30105.jpg', // Verify if max30105.jpg is for MAX30102
    description: 'Measures blood oxygen saturation and pulse rate using photoplethysmography.',
    icon: <Heart className="h-6 w-6" />,
    colorTheme: 'bg-gradient-to-br from-rose-500 to-pink-600',
  },
  {
    id: 'ecg',
    category: 'ECG Sensor',
    name: 'AD8232',
    imagePath: '/images/sensors/ad8232.jpg',
    description: 'Monitors the electrical activity of the heart to produce an electrocardiogram.',
    icon: <Activity className="h-6 w-6" />,
    colorTheme: 'bg-gradient-to-br from-red-500 to-orange-600',
  },
  {
    id: 'temp',
    category: 'Temperature Sensor',
    name: 'LM35',
    imagePath: '/images/sensors/lm-35.jpg',
    description: 'Measures ambient temperature with high accuracy.',
    icon: <ThermometerIcon className="h-6 w-6" />,
    colorTheme: 'bg-gradient-to-br from-amber-500 to-yellow-600',
  },
  {
    id: 'display',
    category: 'Display',
    name: 'OLED Screen',
    modelName: 'SSD1306 0.96"',
    imagePath: '/images/sensors/arduino-oled.jpg',
    description: 'Provides a visual interface to show real-time data or system status.',
    icon: <Monitor className="h-6 w-6" />,
    colorTheme: 'bg-gradient-to-br from-blue-500 to-teal-600',
  },
  {
    id: 'pulse',
    category: 'Heart Rate Sensor',
    name: 'Pulse Sensor SEN-11574',
    imagePath: '/images/sensors/sen-11574.jpg',
    description: 'A plug-and-play heart-rate sensor for Arduino and Arduino compatibles.',
    icon: <Heart className="h-6 w-6" />,
    colorTheme: 'bg-gradient-to-br from-fuchsia-500 to-purple-600',
  },
];

export function HardwareInfoTab() {
  return (
    <div className="space-y-6 p-1">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Hardware Components</h2>
        <p className="text-sm text-muted-foreground">
          An overview of the key sensors and modules used in this health monitoring system.
        </p>
      </div>
      <div className="mb-8">
        <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/images/sensors/hm-sensor.png"
            alt="All Health Monitor Sensors Collage"
            layout="fill"
            objectFit="contain"
            priority // Good to add for LCP images
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hardwareComponents.map((component) => (
          <Card 
            key={component.id} 
            className={cn(
              "shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-0 text-white overflow-hidden",
              component.colorTheme
            )}
          >
            <CardHeader className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-none text-xs">
                  {component.category}
                </Badge>
                <div className="p-2 rounded-lg bg-white/20">
                   {React.cloneElement(component.icon, { className: cn(component.icon.props.className, "h-5 w-5 text-white/90") })}
                </div>
              </div>
              {/* Ensure your public folder has an 'images/components' subfolder or adjust path */}
              <div className="relative w-full h-40 bg-white/10 rounded-md overflow-hidden flex items-center justify-center">
                <Image
                  src={component.imagePath}
                  alt={component.name}
                  layout="fill"
                  objectFit="contain" // 'cover' or 'contain' depending on your images
                  className="p-2 rounded-lg" // Optional padding around the image
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardTitle className="text-lg font-semibold mb-1">{component.name}</CardTitle>
              {component.modelName && <p className="text-xs text-white/80 mb-2">{component.modelName}</p>}
              <p className="text-sm text-white/90 leading-relaxed">
                {component.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
