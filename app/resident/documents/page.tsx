'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PortalHeader } from '@/components/portal/header';
import { mockDocumentTypes } from '@/lib/mock-data';
import { Sparkles, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';

type DocumentRequest = {
  id: string;
  type: string;
  purpose: string;
  status: string;
  date: string;
};

export default function DocumentsPage() {
  const [requests, setRequests] = useState<DocumentRequest[]>([
    { id: 'DOC-001', type: 'Barangay Clearance', purpose: 'Job application', status: 'completed', date: '2026-03-10' },
    { id: 'DOC-002', type: 'Certificate of Residency', purpose: 'School enrollment', status: 'processing', date: '2026-03-15' },
  ]);
  const [newRequest, setNewRequest] = useState({ type: '', purpose: '' });
  const [aiRecommendation, setAiRecommendation] = useState<{ type: string; confidence: number } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-accent-foreground" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handlePurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const purpose = e.target.value;
    setNewRequest({ ...newRequest, purpose });

    if (purpose.length > 3) {
      const keywords: Record<string, string> = {
        job: 'Barangay Clearance',
        employment: 'Barangay Clearance',
        work: 'Barangay Clearance',
        school: 'Certificate of Residency',
        education: 'Certificate of Residency',
        enroll: 'Certificate of Residency',
        business: 'Business Permit',
        store: 'Business Permit',
        medical: 'Certificate of Indigency',
        hospital: 'Certificate of Indigency',
        assistance: 'Certificate of Indigency',
      };

      for (const [key, doc] of Object.entries(keywords)) {
        if (purpose.toLowerCase().includes(key)) {
          setAiRecommendation({
            type: doc,
            confidence: Math.min(95, Math.floor(70 + purpose.length / 2)),
          });
          return;
        }
      }
    }
    setAiRecommendation(null);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.type || !newRequest.purpose) return;

    const newReq: DocumentRequest = {
      id: `DOC-${String(requests.length + 1).padStart(3, '0')}`,
      type: newRequest.type,
      purpose: newRequest.purpose,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };

    setRequests([newReq, ...requests]);
    setNewRequest({ type: '', purpose: '' });
    setAiRecommendation(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  return (
    <>
      <PortalHeader title="Document Requests" description="Request and track your barangay documents" />
      
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Request Button */}
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="mb-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Request New Document
          </Button>
        )}

        {/* Request Form */}
        {showForm && (
          <Card className="p-6 mb-8 border-primary/20 animate-fadeUp">
            <h2 className="text-2xl font-bold text-foreground mb-6">Request a Document</h2>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Document Type</label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="">Select a document type...</option>
                  {mockDocumentTypes.map((doc) => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} ({doc.days} day{doc.days !== 1 ? 's' : ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Purpose of Request</label>
                <Input
                  type="text"
                  value={newRequest.purpose}
                  onChange={handlePurposeChange}
                  placeholder="e.g., Job application, school enrollment..."
                  className="border-input focus:ring-primary/50"
                  required
                />
              </div>

              {aiRecommendation && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg animate-fadeUp">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-primary">AI Recommendation</p>
                  </div>
                  <p className="text-foreground">
                    We recommend: <span className="font-semibold">{aiRecommendation.type}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Confidence: {aiRecommendation.confidence}%
                  </p>
                  <Button
                    type="button"
                    onClick={() => setNewRequest({ ...newRequest, type: aiRecommendation.type })}
                    className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                  >
                    Apply Recommendation
                  </Button>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setNewRequest({ type: '', purpose: '' });
                    setAiRecommendation(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Submit Request
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Document Types Info */}
        <Card className="p-6 mb-8 border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold text-foreground mb-4">Available Documents</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDocumentTypes.map((doc) => (
              <div key={doc.id} className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-1">{doc.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                <Badge className="bg-primary/10 text-primary">
                  {doc.days} day{doc.days !== 1 ? 's' : ''}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Requests */}
        <Card className="border-primary/20">
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Your Requests</h2>
            <div className="space-y-4">
              {requests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No requests yet. Create your first request above!</p>
              ) : (
                requests.map((req) => (
                  <div 
                    key={req.id} 
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{req.id}</span>
                        <h3 className="font-semibold text-foreground">{req.type}</h3>
                        {getStatusIcon(req.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{req.purpose}</p>
                      <p className="text-xs text-muted-foreground mt-1">Requested on {req.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`
                        ${req.status === 'completed' ? 'bg-primary/10 text-primary' : ''}
                        ${req.status === 'processing' ? 'bg-accent/20 text-accent-foreground' : ''}
                        ${req.status === 'pending' ? 'bg-secondary/20 text-secondary-foreground' : ''}
                        ${req.status === 'rejected' ? 'bg-destructive/10 text-destructive' : ''}
                      `}>
                        {req.status}
                      </Badge>
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
