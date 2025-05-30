import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ConfigPanel } from './config-panel';
import { Config } from "../types";

interface VoiceSettingsProps {
  config: Config;
  setConfig: (config: Config) => void;
  isConnected: boolean;
  voices: string[];
}

export function VoiceSettings({ config, setConfig, isConnected, voices }: VoiceSettingsProps) {
  return (
    <ConfigPanel
      config={config}
      setConfig={setConfig}
      isConnected={isConnected}
      voices={voices}
    />
  );
} 