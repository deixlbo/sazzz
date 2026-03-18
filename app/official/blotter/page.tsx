'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PortalHeader } from '@/components/portal/header';
import { mockBlotterCases } from '@/lib/mock-data';
import { Trash2, AlertCircle } from 'lucide-react';

type BlotterCase = {
  id: string;
  incidentType: string;
  location: string;
  reportedBy: string;
  status: string;
  date: string;
  description: string;
};

export default function OfficialBlotterPage() {
  const [cases, setCases] = useState<BlotterCase[]>(mockBlotterCases);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState('');

  const handleUpdateStatus = (caseId: string) => {
    if (!updateStatus) return;

    setCases(prev =>
      prev.map(c =>
        c.id === caseId ? { ...c, status: updateStatus } : c
      )
    );
    setSelectedCase(null);
    setUpdateStatus('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this case?')) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  const filteredCases = cases.filter(c =>
    statusFilter === 'all' ? true : c.status === statusFilter
  );

  const stats = {
    reported: cases.filter(c => c.status === 'reported').length,
    investigating: cases.filter(c => c.status === 'investigating').length,
    resolved: cases.filter(c => c.status === 'resolved').length,
    closed: cases.filter(c => c.status === 'closed').length,
  };

  return (
    <>
      <PortalHeader title="Blotter Management" description="Track and manage incident reports" />
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Reported', value: stats.reported, color: 'bg-destructive/10 text-destructive' },
            { label: 'Investigating', value: stats.investigating, color: 'bg-accent/20 text-accent-foreground' },
            { label: 'Resolved', value: stats.resolved, color: 'bg-blue-100 text-blue-700' },
            { label: 'Closed', value: stats.closed, color: 'bg-primary/10 text-primary' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-lg p-4 text-center`}>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {['all', 'reported', 'investigating', 'resolved', 'closed'].map((status) => (
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

        {/* Cases Table */}
        {filteredCases.length === 0 ? (
          <Card className="p-12 text-center border-primary/20">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No cases in this status</p>
          </Card>
        ) : (
          <Card className="overflow-hidden border-primary/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Case #</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Incident Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Reported By</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCases.map((blotterCase) => (
                    <tr key={blotterCase.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{blotterCase.id}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{blotterCase.incidentType}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{blotterCase.location}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{blotterCase.reportedBy}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          blotterCase.status === 'reported'
                            ? 'bg-destructive/10 text-destructive'
                            : blotterCase.status === 'investigating'
                            ? 'bg-accent/20 text-accent-foreground'
                            : blotterCase.status === 'resolved'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {blotterCase.status.charAt(0).toUpperCase() + blotterCase.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{blotterCase.date}</td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCase(blotterCase.id)}
                        >
                          Update
                        </Button>
                        <button
                          onClick={() => handleDelete(blotterCase.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Update Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="p-8 max-w-md w-full animate-scaleIn">
              <h2 className="text-2xl font-bold text-foreground mb-4">Update Case Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">New Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select status</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCase(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedCase)}
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
