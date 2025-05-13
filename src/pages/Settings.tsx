
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { YoutubeIcon, Trash2, Save, ExternalLink } from "lucide-react";

interface SettingsContextType {
  uiScale: number;
  setUiScale: (scale: number) => void;
}

const Settings = () => {
  const [apiKey, setApiKey] = useLocalStorage<string | null>("youtube-api-key", null);
  const [apiKeyInput, setApiKeyInput] = useState(apiKey || "");
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>("dark-mode", true);
  const { uiScale, setUiScale } = useOutletContext<SettingsContextType>();
  const { toast } = useToast();

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleApiKeySave = () => {
    if (!apiKeyInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    
    setApiKey(apiKeyInput.trim());
    toast({
      title: "Settings Saved",
      description: "Your YouTube API key has been saved",
    });
  };

  const handleClearData = () => {
    setApiKey(null);
    setApiKeyInput("");
    localStorage.clear();
    window.location.reload();
  };

  const handleSliderChange = (value: number[]) => {
    setUiScale(value[0]);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <YoutubeIcon className="mr-2 h-5 w-5 text-youtube-red" />
              YouTube API Key
            </CardTitle>
            <CardDescription>
              Add your YouTube Data API v3 key to enable video searches and browsing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                placeholder="Enter your YouTube API key"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                type="password"
              />
              <p className="text-sm text-muted-foreground">
                Don't have an API key?{" "}
                <a
                  href="https://developers.google.com/youtube/v3/getting-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Get one here
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleApiKeySave}>
              <Save className="mr-2 h-4 w-4" />
              Save API Key
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={handleToggleDarkMode}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="ui-scale">UI Scale ({Math.round(uiScale * 100)}%)</Label>
              </div>
              <Slider
                id="ui-scale"
                min={0.8}
                max={1.2}
                step={0.05}
                defaultValue={[uiScale]}
                onValueChange={handleSliderChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>80%</span>
                <span>100%</span>
                <span>120%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Clear all application data and reset to defaults
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your settings, including your API key.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>
                    Yes, clear all data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              YouTube Browser App - A desktop application for browsing YouTube content using the YouTube Data API v3.
              This app does not store or host any YouTube content locally. All content is streamed directly from YouTube.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
