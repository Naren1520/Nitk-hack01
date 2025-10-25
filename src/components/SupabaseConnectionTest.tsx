import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Shield, Wifi } from 'lucide-react';
import { supabase, testSupabaseConnection, checkSupabaseStatus } from '../lib/supabase';

interface ConnectionStatus {
  database: 'connected' | 'error' | 'testing';
  auth: 'connected' | 'error' | 'testing';
  realtime: 'connected' | 'error' | 'testing';
  storage: 'connected' | 'error' | 'testing';
}

export default function SupabaseConnectionTest() {
  const [status, setStatus] = useState<ConnectionStatus>({
    database: 'testing',
    auth: 'testing',
    realtime: 'testing',
    storage: 'testing'
  });
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);

  const runConnectionTests = async () => {
    setIsLoading(true);
    setStatus({
      database: 'testing',
      auth: 'testing',
      realtime: 'testing',
      storage: 'testing'
    });

    try {
      // Test database connection
      const dbTest = await testSupabaseConnection();
      
      // Test auth service
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      // Test storage
      const { data: storageData, error: storageError } = await supabase.storage.listBuckets();
      
      // Test realtime (attempt to subscribe)
      let realtimeStatus: 'connected' | 'error' = 'connected';
      try {
        const channel = supabase.channel('test-channel');
        channel.subscribe();
        setTimeout(() => {
          supabase.removeChannel(channel);
        }, 1000);
      } catch (error) {
        realtimeStatus = 'error';
      }

      setStatus({
        database: dbTest.success ? 'connected' : 'error',
        auth: authError ? 'error' : 'connected',
        realtime: realtimeStatus,
        storage: storageError ? 'error' : 'connected'
      });

      // Get connection status from the utility function
      const statusCheck = checkSupabaseStatus();
      
      setConnectionDetails({
        url: statusCheck.url || 'Not configured',
        project: statusCheck.url?.split('//')[1]?.split('.')[0] || 'Unknown',
        auth: !authError,
        storage: !storageError,
        database: dbTest.success,
        configured: statusCheck.configured,
        validUrl: statusCheck.hasValidUrl,
        validKey: statusCheck.hasValidKey
      });

    } catch (error) {
      console.error('Connection test failed:', error);
      setStatus({
        database: 'error',
        auth: 'error',
        realtime: 'error',
        storage: 'error'
      });
    } finally {
      setIsLoading(false);
      setLastTestTime(new Date());
    }
  };

  useEffect(() => {
    runConnectionTests();
  }, []);

  const getStatusIcon = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'connected':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Connected</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      case 'testing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Testing...</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const allConnected = Object.values(status).every(s => s === 'connected');
  const anyError = Object.values(status).some(s => s === 'error');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {allConnected ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : anyError ? (
                <XCircle className="h-6 w-6 text-red-600" />
              ) : (
                <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
              )}
              <div>
                <h3 className="font-medium">
                  {allConnected ? 'All Services Connected' : anyError ? 'Connection Issues Detected' : 'Testing Connection...'}
                </h3>
                {lastTestTime && (
                  <p className="text-sm text-muted-foreground">
                    Last tested: {lastTestTime.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runConnectionTests}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Test Again
            </Button>
          </div>

          {/* Service Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Database</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.database)}
                {getStatusBadge(status.database)}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium">Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.auth)}
                {getStatusBadge(status.auth)}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.realtime)}
                {getStatusBadge(status.realtime)}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Storage</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.storage)}
                {getStatusBadge(status.storage)}
              </div>
            </div>
          </div>

          {/* Connection Details */}
          {connectionDetails && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Connection Details</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Project:</span> {connectionDetails.project}</p>
                <p><span className="font-medium">URL:</span> {connectionDetails.url}</p>
                <p><span className="font-medium">Configuration:</span> 
                  {connectionDetails.configured ? ' ✅ Complete' : ' ❌ Missing'}
                  {connectionDetails.validUrl ? ' • Valid URL' : ' • Invalid URL'}
                  {connectionDetails.validKey ? ' • Valid Key' : ' • Invalid Key'}
                </p>
                <p><span className="font-medium">Services:</span> 
                  {connectionDetails.database && ' Database'}
                  {connectionDetails.auth && ' • Auth'}
                  {connectionDetails.storage && ' • Storage'}
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {anyError && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Some services are not connected. Check your environment variables and Supabase project configuration.
                Make sure you have run the database migrations from the `/supabase/migrations/` folder.
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {allConnected && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ Campus Link is successfully connected to your Supabase project! All services are operational.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}