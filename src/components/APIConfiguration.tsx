import { useState, useEffect } from 'react';
import { 
  Key, 
  Settings, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { aiService } from '../lib/services/aiService';

interface APIService {
  name: string;
  key: string;
  envVar: string;
  description: string;
  status: 'connected' | 'not-configured' | 'testing';
  setupUrl: string;
  features: string[];
}

export default function APIConfiguration() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [apiServices, setApiServices] = useState<APIService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAPIStatus();
  }, []);

  const loadAPIStatus = () => {
    const openAIStatus = aiService.getApiKeyStatus();
    
    setApiServices([
      {
        name: 'OpenAI',
        key: openAIStatus.keyPreview,
        envVar: 'REACT_APP_OPENAI_API_KEY',
        description: 'Powers AI exam generation, study assistant, and performance analysis',
        status: openAIStatus.configured ? 'connected' : 'not-configured',
        setupUrl: 'https://platform.openai.com/api-keys',
        features: ['AI Exam Generator', 'Study Assistant', 'Performance Analysis', 'Question Generation']
      }
    ]);
    
    setLoading(false);
  };

  const toggleKeyVisibility = (serviceName: string) => {
    setShowKeys(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const testAPIConnection = async (service: APIService) => {
    setApiServices(prev => prev.map(s => 
      s.name === service.name 
        ? { ...s, status: 'testing' }
        : s
    ));

    try {
      // Test with a simple question
      const response = await aiService.answerStudentQuestion(
        'Test connection - please respond with "Connection successful"',
        '',
        ''
      );
      
      const isValid = response && !response.includes('check your API configuration') && 
                     !response.includes('cannot provide an answer at this time');
      
      setApiServices(prev => prev.map(s => 
        s.name === service.name 
          ? { ...s, status: isValid ? 'connected' : 'not-configured' }
          : s
      ));

      if (isValid) {
        toast.success(`${service.name} API connection successful!`);
      } else {
        toast.error(`${service.name} API connection failed. Check your API key.`);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setApiServices(prev => prev.map(s => 
        s.name === service.name 
          ? { ...s, status: 'not-configured' }
          : s
      ));
      toast.error(`Failed to test ${service.name} connection`);
    }
  };

  const refreshAPIStatus = () => {
    setLoading(true);
    setTimeout(() => {
      loadAPIStatus();
      toast.success('API status refreshed');
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'testing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800">Testing...</Badge>;
      default:
        return <Badge variant="destructive">Not Configured</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading API configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Key className="h-6 w-6" />
            API Configuration
          </h2>
          <p className="text-muted-foreground">
            Configure API keys to enable advanced AI features in Campus Link
          </p>
        </div>
        
        <Button variant="outline" onClick={refreshAPIStatus}>
          <Settings className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> API keys are accessed from environment variables for security. 
          Create a <code>.env</code> file in your project root with your API keys. Never commit API keys to version control.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">API Services</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="testing">Test & Verify</TabsTrigger>
        </TabsList>

        {/* API Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {apiServices.map(service => (
              <Card key={service.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {service.name} API
                        {getStatusIcon(service.status)}
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`${service.name}-key`}>API Key Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id={`${service.name}-key`}
                        type={showKeys[service.name] ? 'text' : 'password'}
                        value={service.key}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyVisibility(service.name)}
                        disabled={service.status === 'not-configured'}
                      >
                        {showKeys[service.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(service.envVar + '=your-api-key-here')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Environment Variable: <code>{service.envVar}</code>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Features Enabled</Label>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map(feature => (
                        <Badge 
                          key={feature} 
                          variant={service.status === 'connected' ? 'default' : 'outline'} 
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(service.setupUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Get API Key
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => testAPIConnection(service)}
                      disabled={service.status === 'testing'}
                    >
                      {service.status === 'testing' ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                      )}
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Setup Guide Tab */}
        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>Follow these steps to configure your API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-lg">Step 1: Get OpenAI API Key</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mt-2">
                    <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a></li>
                    <li>Sign in to your OpenAI account (create one if needed)</li>
                    <li>Navigate to the API Keys section</li>
                    <li>Click "Create new secret key"</li>
                    <li>Copy the generated API key (starts with sk-...)</li>
                    <li>Store it securely - you won't see it again!</li>
                  </ol>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-lg">Step 2: Configure Environment Variables</h4>
                  <div className="space-y-3 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Create a <code>.env</code> file in your project root:</p>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 font-mono text-sm">
                        <code>REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key-here</code>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => copyToClipboard('REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key-here')}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Template
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-lg">Step 3: Restart Application</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    After adding your API key to the .env file, restart your development server:
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 font-mono text-sm mt-2">
                    <code>npm start</code> or <code>yarn start</code>
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-lg">Step 4: Verify Configuration</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use the "Test & Verify" tab to ensure your API keys are working correctly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Store API keys in environment variables, never in code</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Add .env to your .gitignore file</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Use different API keys for development and production</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Regularly rotate your API keys</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Monitor API usage and set usage limits</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Connection Status</CardTitle>
              <CardDescription>Test and verify your API configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiServices.map(service => (
                  <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h4 className="font-medium">{service.name} API</h4>
                        <p className="text-sm text-muted-foreground">
                          {service.status === 'connected' && 'Connection successful - All features available'}
                          {service.status === 'testing' && 'Testing connection...'}
                          {service.status === 'not-configured' && 'API key not configured or connection failed'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testAPIConnection(service)}
                      disabled={service.status === 'testing'}
                    >
                      {service.status === 'testing' ? 'Testing...' : 'Test Now'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Availability</CardTitle>
              <CardDescription>See which features are available with your current configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">AI-Powered Features</h4>
                  {[
                    { name: 'AI Exam Generator', available: apiServices.find(s => s.name === 'OpenAI')?.status === 'connected' },
                    { name: 'Study Assistant Chat', available: apiServices.find(s => s.name === 'OpenAI')?.status === 'connected' },
                    { name: 'Performance Analysis', available: apiServices.find(s => s.name === 'OpenAI')?.status === 'connected' },
                    { name: 'Study Plan Generation', available: apiServices.find(s => s.name === 'OpenAI')?.status === 'connected' }
                  ].map(feature => (
                    <div key={feature.name} className="flex items-center gap-2">
                      {feature.available ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className={feature.available ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Basic Features</h4>
                  {[
                    'Document Collaboration',
                    'Notification System',
                    'Campus Navigation',
                    'Content Management'
                  ].map(feature => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-800 dark:text-green-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}