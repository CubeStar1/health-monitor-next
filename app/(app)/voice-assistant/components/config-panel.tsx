import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";
import { Config } from "../types";

interface ConfigPanelProps {
  config: Config;
  setConfig: (config: Config) => void;
  isConnected: boolean;
  voices: string[];
  children?: React.ReactNode;
}

export function ConfigPanel({ config, setConfig, isConnected, voices, children }: ConfigPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Voice Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="system-prompt">System Prompt</Label>
          <Textarea
            id="system-prompt"
            value={config.systemPrompt}
            onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
            disabled={isConnected}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="voice-select">Voice</Label>
          <Select
            value={config.voice}
            onValueChange={(value) => setConfig({ ...config, voice: value })}
            disabled={isConnected}
          >
            <SelectTrigger id="voice-select">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice} value={voice}>
                  {voice}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="google-search"
            checked={config.googleSearch}
            onCheckedChange={(checked) => 
              setConfig({ ...config, googleSearch: checked as boolean })}
            disabled={isConnected}
          />
          <Label htmlFor="google-search">Enable Google Search</Label>
        </div>
      </CardContent>
      {children}
    </Card>
  );
} 