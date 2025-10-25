import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Settings,
  Bell,
  BellOff,
  Sun,
  Moon,
  Monitor,
  Type,
  Clock,
  CheckSquare,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useSettings } from '../lib/contexts/SettingsContext';

interface QuickSettingsWidgetProps {
  onOpenFullSettings: () => void;
}

export default function QuickSettingsWidget({ onOpenFullSettings }: QuickSettingsWidgetProps) {
  const { settings, updateSettings } = useSettings();

  const getThemeIcon = () => {
    switch (settings.theme) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'system': return <Monitor className="h-4 w-4" />;
    }
  };

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updateSettings({ theme: themes[nextIndex] });
  };

  const cycleFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    updateSettings({ fontSize: sizes[nextIndex] });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle className="text-sm">Quick Settings</CardTitle>
              <CardDescription className="text-xs">
                Personalize your experience
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onOpenFullSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getThemeIcon()}
            <span className="text-sm font-medium">Theme</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={cycleTheme}
            className="h-8 px-2"
          >
            <span className="text-xs capitalize">{settings.theme}</span>
          </Button>
        </div>

        <Separator />

        {/* Font Size */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4" />
            <span className="text-sm font-medium">Font Size</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={cycleFontSize}
            className="h-8 px-2"
          >
            <span className="text-xs capitalize">
              {settings.fontSize.replace('-', ' ')}
            </span>
          </Button>
        </div>

        <Separator />

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {settings.notificationsEnabled ? 
              <Bell className="h-4 w-4" /> : 
              <BellOff className="h-4 w-4" />
            }
            <span className="text-sm font-medium">Notifications</span>
          </div>
          <Switch
            checked={settings.notificationsEnabled}
            onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
          />
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {settings.soundEnabled ? 
              <Volume2 className="h-4 w-4" /> : 
              <VolumeX className="h-4 w-4" />
            }
            <span className="text-sm font-medium">Sounds</span>
          </div>
          <Switch
            checked={settings.soundEnabled}
            onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
          />
        </div>

        <Separator />

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{settings.alarms.filter(a => a.isEnabled).length} alarms</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckSquare className="h-3 w-3" />
              <span>{settings.todos.filter(t => !t.completed).length} todos</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {settings.alarms.length + settings.todos.length} items
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}