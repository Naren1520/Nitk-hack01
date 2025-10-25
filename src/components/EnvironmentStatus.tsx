import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, AlertCircle, Settings, Key, Globe } from 'lucide-react';
import { checkSupabaseStatus } from '../lib/supabase';

export default function EnvironmentStatus() {
  const [envStatus, setEnvStatus] = useState<any>(null);

  useEffect(() => {
    // Check environment variables
    const checkEnvironment = () => {
      const supabaseStatus = checkSupabaseStatus();
      
      const status = {
        supabase: supabaseStatus,
        openai: {
          configured: !!(import.meta.env?.VITE_OPENAI_API_KEY),
          key: import.meta.env?.VITE_OPENAI_API_KEY || 'Not set'
        },
        general: {
          environment: import.meta.env?.VITE_ENVIRONMENT || 'development',
          appUrl: import.meta.env?.VITE_APP_URL || 'http://localhost:5173',
          debugMode: import.meta.env?.VITE_DEBUG_MODE === 'true'
        },
        metaEnvAvailable: typeof import.meta.env !== 'undefined'
      };
      
      setEnvStatus(status);
    };

    checkEnvironment();
  }, []);

  if (!envStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 animate-spin" />
            <span>Checking environment status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (isOk: boolean) => {
    return isOk ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (isOk: boolean, label: string = '') => {
    return (
      <Badge 
        variant="outline" 
        className={isOk ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
      >
        {isOk ? 'OK' : 'Error'} {label && `• ${label}`}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Environment Variables Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meta Environment Check */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Meta Environment</h4>
              {getStatusIcon(envStatus.metaEnvAvailable)}
            </div>
            <p className="text-sm text-muted-foreground">
              import.meta.env is {envStatus.metaEnvAvailable ? 'available' : 'not available'}
            </p>
          </div>

          {/* Supabase Configuration */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Supabase Configuration
            </h4>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">URL Configuration</span>
                  <p className="text-xs text-muted-foreground">{envStatus.supabase.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(envStatus.supabase.hasValidUrl)}
                  {getStatusBadge(envStatus.supabase.hasValidUrl)}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">API Key Configuration</span>
                  <p className="text-xs text-muted-foreground">
                    {envStatus.supabase.hasValidKey ? 'Valid JWT format' : 'Invalid or missing'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(envStatus.supabase.hasValidKey)}
                  {getStatusBadge(envStatus.supabase.hasValidKey)}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">Overall Supabase</span>
                  <p className="text-xs text-muted-foreground">Ready for connection</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(envStatus.supabase.configured)}
                  {getStatusBadge(envStatus.supabase.configured)}
                </div>
              </div>
            </div>
          </div>

          {/* OpenAI Configuration */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              AI Features (Optional)
            </h4>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">OpenAI API Key</span>
                <p className="text-xs text-muted-foreground">
                  {envStatus.openai.configured ? 'Configured for AI features' : 'Not configured (optional)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {envStatus.openai.configured ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Configured
                    </Badge>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Optional
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="space-y-3">
            <h4 className="font-medium">General Settings</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Environment:</span>
                <Badge variant="outline">{envStatus.general.environment}</Badge>
              </div>
              <div className="flex justify-between">
                <span>App URL:</span>
                <span className="text-muted-foreground">{envStatus.general.appUrl}</span>
              </div>
              <div className="flex justify-between">
                <span>Debug Mode:</span>
                <Badge variant="outline" className={envStatus.general.debugMode ? 'bg-blue-50 text-blue-700' : ''}>
                  {envStatus.general.debugMode ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Summary */}
          {envStatus.supabase.configured ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ Environment is properly configured! Campus Link is ready to connect to Supabase.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                ⚠️ Supabase configuration incomplete. Check your environment variables or the fallback configuration in lib/supabase.ts.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}