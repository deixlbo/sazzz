'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PortalHeader } from '@/components/portal/header';
import { mockDocumentRequests } from '@/lib/mock-data';

type DocumentRequest = {
  id: string;
  type: string;
  residentId: string;
  residentName: string;
  purpose: string;
  status: string;
  date: string;
  notes?: string;
};

export default function OfficialDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRequest[]>(mockDocumentRequests);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  const handleStatusUpdate = (docId: string) => {
    if (!newStatus) return;

    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, status: newStatus, notes }
          : doc
      )
    );
    setSelectedDoc(null);
    setNewStatus('');
    setNotes('');
  };

  const filteredDocuments = documents.filter(doc =>
    statusFilter === 'all' ? true : doc.status === statusFilter
  );

  const stats = {
    pending: documents.filter(d => d.status === 'pending').length,
    processing: documents.filter(d => d.status === 'processing').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
    released: documents.filter(d => d.status === 'released').length,
  };

  return (
    <>
      <PortalHeader title="Document Requests Management" description="Review and manage all resident document requests" />
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Pending', value: stats.pending, color: 'bg-accent/20 text-accent-foreground' },
            { label: 'Processing', value: stats.processing, color: 'bg-blue-100 text-blue-700' },
            { label: 'Approved', value: stats.approved, color: 'bg-primary/10 text-primary' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-destructive/10 text-destructive' },
            { label: 'Released', value: stats.released, color: 'bg-cyan-100 text-cyan-700' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-lg p-4 text-center`}>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {['all', 'pending', 'processing', 'approved', 'rejected', 'released'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Documents Table */}
        {filteredDocuments.length === 0 ? (
          <Card className="p-12 text-center border-primary/20">
            <p className="text-muted-foreground">No documents found for this status</p>
          </Card>
        ) : (
          <Card className="overflow-hidden border-primary/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Resident</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Document Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Purpose</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{doc.id}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{doc.residentName}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{doc.type}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{doc.purpose}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          doc.status === 'pending' ? 'bg-accent/20 text-accent-foreground' :
                          doc.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          doc.status === 'approved' ? 'bg-primary/10 text-primary' :
                          doc.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                          'bg-cyan-100 text-cyan-700'
                        }`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{doc.date}</td>
                      <td className="px-6 py-4 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDoc(doc.id)}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Update Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="p-8 max-w-md w-full animate-scaleIn">
              <h2 className="text-2xl font-bold text-foreground mb-4">Update Document Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select status</option>
                    <option value="processing">Processing</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="released">Released</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes for the resident..."
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDoc(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedDoc)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
