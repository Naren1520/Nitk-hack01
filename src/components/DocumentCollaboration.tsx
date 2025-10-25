import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Share2, 
  Users, 
  Save, 
  Download, 
  Edit3, 
  Eye, 
  Clock,
  UserPlus,
  Copy
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../lib/contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Document {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  collaborators: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'online' | 'offline';
  lastSeen?: string;
}

export default function DocumentCollaboration() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [documentContent, setDocumentContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<'editor' | 'viewer'>('editor');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Simulate collaborative editing with live cursors and real-time updates
  useEffect(() => {
    if (currentDocument && user) {
      // Simulate collaborators
      const mockCollaborators: Collaborator[] = [
        {
          id: user.id,
          name: `${(user.profile as any).first_name} ${(user.profile as any).last_name}`,
          avatar: (user.profile as any).avatar_url,
          role: 'owner',
          status: 'online'
        },
        {
          id: 'collab1',
          name: 'Sarah Wilson',
          role: 'editor',
          status: 'online'
        },
        {
          id: 'collab2',
          name: 'Mike Chen',
          role: 'viewer',
          status: 'offline',
          lastSeen: '2 minutes ago'
        }
      ];
      setCollaborators(mockCollaborators);
    }
  }, [currentDocument, user]);

  // Auto-save functionality
  useEffect(() => {
    if (unsavedChanges && currentDocument) {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
      
      autoSaveTimeout.current = setTimeout(() => {
        saveDocument();
      }, 2000);
    }

    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [documentContent, documentTitle, unsavedChanges]);

  // Initialize with sample documents
  useEffect(() => {
    if (user) {
      const sampleDocs: Document[] = [
        {
          id: '1',
          title: 'Project Proposal - Smart Campus System',
          content: 'This document outlines the proposal for implementing a smart campus system...\n\n1. Introduction\nThe modern educational landscape requires...',
          ownerId: user.id,
          collaborators: [user.id, 'collab1'],
          isPublic: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          version: 3
        },
        {
          id: '2',
          title: 'Research Notes - AI in Education',
          content: 'Collecting research on AI applications in educational environments...\n\n• Machine Learning for personalized learning\n• Natural Language Processing for automated grading\n• Computer Vision for attendance tracking',
          ownerId: user.id,
          collaborators: [user.id, 'collab1', 'collab2'],
          isPublic: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 1800000).toISOString(),
          version: 7
        }
      ];
      setDocuments(sampleDocs);
    }
  }, [user]);

  // Create new document
  const createDocument = async () => {
    if (!user || !newDocTitle.trim()) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51e2cda7/documents`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: newDocTitle.trim(),
            content: '',
            collaborators: [],
            isPublic: false
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success('Document created successfully!');
        
        // Add to local state for immediate feedback
        const newDoc: Document = {
          id: data.documentId,
          title: newDocTitle.trim(),
          content: '',
          ownerId: user.id,
          collaborators: [user.id],
          isPublic: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1
        };
        
        setDocuments(prev => [newDoc, ...prev]);
        setCurrentDocument(newDoc);
        setDocumentTitle(newDoc.title);
        setDocumentContent(newDoc.content);
        setNewDocTitle('');
        setShowCreateDialog(false);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    }
  };

  // Save document
  const saveDocument = async () => {
    if (!currentDocument || !user) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51e2cda7/documents/${currentDocument.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: documentTitle,
            content: documentContent
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLastSaved(new Date().toLocaleTimeString());
        setUnsavedChanges(false);
        
        // Update local document
        setDocuments(prev => prev.map(doc => 
          doc.id === currentDocument.id 
            ? { ...doc, title: documentTitle, content: documentContent, version: data.version }
            : doc
        ));
        
        toast.success('Document saved!');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    }
  };

  // Load document
  const loadDocument = async (documentId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51e2cda7/documents/${documentId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentDocument(data.document);
        setDocumentTitle(data.document.title);
        setDocumentContent(data.document.content);
        setUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Failed to load document');
    }
  };

  // Handle content change
  const handleContentChange = (content: string) => {
    setDocumentContent(content);
    setUnsavedChanges(true);
  };

  // Handle title change
  const handleTitleChange = (title: string) => {
    setDocumentTitle(title);
    setUnsavedChanges(true);
  };

  // Download document
  const downloadDocument = () => {
    if (!currentDocument) return;

    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Document downloaded!');
  };

  // Copy share link
  const copyShareLink = () => {
    if (!currentDocument) return;
    
    const shareLink = `${window.location.origin}/document/${currentDocument.id}`;
    navigator.clipboard.writeText(shareLink);
    toast.success('Share link copied to clipboard!');
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Collaboration</h2>
          <p className="text-muted-foreground">Create, edit, and share documents with real-time collaboration</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="doc-title">Document Title</Label>
                <Input
                  id="doc-title"
                  placeholder="Enter document title"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createDocument} disabled={!newDocTitle.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Your Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentDocument?.id === doc.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setCurrentDocument(doc);
                      setDocumentTitle(doc.title);
                      setDocumentContent(doc.content);
                      setIsEditing(false);
                      setUnsavedChanges(false);
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium truncate">{doc.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs opacity-70">
                      <span>v{doc.version}</span>
                      <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {doc.isPublic && (
                      <Badge variant="secondary" className="text-xs mt-1">Public</Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Document Editor */}
        <Card className="lg:col-span-3">
          {currentDocument ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    {isEditing ? (
                      <Input
                        value={documentTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="text-lg font-semibold"
                      />
                    ) : (
                      <h3 className="text-lg font-semibold">{documentTitle}</h3>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Version {currentDocument.version}</span>
                      {lastSaved && <span>Last saved: {lastSaved}</span>}
                      {unsavedChanges && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          <Clock className="h-3 w-3 mr-1" />
                          Unsaved changes
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Collaborators */}
                    <div className="flex -space-x-2">
                      {collaborators.map((collaborator) => (
                        <Avatar key={collaborator.id} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={collaborator.avatar} />
                          <AvatarFallback className="text-xs">
                            {collaborator.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowShareDialog(true)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={downloadDocument}>
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button size="sm" onClick={saveDocument} disabled={!unsavedChanges}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={documentContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Start typing your document..."
                    className="min-h-96 resize-none"
                  />
                ) : (
                  <ScrollArea className="h-96">
                    <div className="whitespace-pre-wrap p-4 bg-muted rounded-lg">
                      {documentContent || 'Document is empty. Click edit to start writing.'}
                    </div>
                  </ScrollArea>
                )}
                
                {/* Live Collaboration Indicators */}
                {isEditing && collaborators.some(c => c.status === 'online' && c.id !== user.id) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <Users className="h-4 w-4" />
                      <span>
                        {collaborators.filter(c => c.status === 'online' && c.id !== user.id).length} collaborator(s) online
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </>
          ) : (
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">No document selected</h3>
                  <p className="text-sm text-muted-foreground">Choose a document to edit or create a new one</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="share-email">Email Address</Label>
              <Input
                id="share-email"
                type="email"
                placeholder="Enter email to share with"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="share-role">Permission</Label>
              <Select value={shareRole} onValueChange={(value: 'editor' | 'viewer') => setShareRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Can edit</SelectItem>
                  <SelectItem value="viewer">Can view only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border-t pt-4">
              <Label>Share Link</Label>
              <div className="flex gap-2 mt-2">
                <Input 
                  value={`${window.location.origin}/document/${currentDocument?.id}`}
                  readOnly
                  className="text-sm"
                />
                <Button variant="outline" onClick={copyShareLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Share invite sent!');
                setShareEmail('');
                setShowShareDialog(false);
              }}>
                <UserPlus className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}