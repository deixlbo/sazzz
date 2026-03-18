'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PortalHeader } from '@/components/portal/header';
import { AlertTriangle, AlertCircle, Info, Sparkles, Trash2 } from 'lucide-react';

type BlotterCase = {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  status: string;
};

export default function BlotterPage() {
  const [cases, setCases] = useState<BlotterCase[]>([
    { id: 'BLT-001', title: 'Lost Wallet', description: 'Lost my wallet near the barangay hall', severity: 'low', date: '2026-03-15', status: 'resolved' },
    { id: 'BLT-002', title: 'Noise Complaint', description: 'Excessive noise from construction at night', severity: 'medium', date: '2026-03-16', status: 'open' },
  ]);
  const [newCase, setNewCase] = useState({ title: '', description: '' });
  const [aiSeverity, setAiSeverity] = useState<'low' | 'medium' | 'high' | null>(null);
  const [showForm, setShowForm] = useState(false);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-accent-foreground" />;
      case 'low':
        return <Info className="w-5 h-5 text-primary" />;
      default:
        return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handleDescriptionChange = (value: string) => {
    setNewCase({ ...newCase, description: value });

    const highSeverityKeywords = ['violence', 'injury', 'assault', 'robbery', 'theft', 'accident', 'injured', 'harm', 'fight', 'attack'];
    const mediumSeverityKeywords = ['noise', 'disturbance', 'property', 'damage', 'dispute', 'argument', 'trespass'];

    const text = value.toLowerCase();
    if (highSeverityKeywords.some(keyword => text.includes(keyword))) {
      setAiSeverity('high');
    } else if (mediumSeverityKeywords.some(keyword => text.includes(keyword))) {
      setAiSeverity('medium');
    } else if (text.length > 10) {
      setAiSeverity('low');
    } else {
      setAiSeverity(null);
    }
  };

  const handleSubmitCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.title || !newCase.description) return;

    const severity = aiSeverity || 'low';
    const newCaseData: BlotterCase = {
      id: `BLT-${String(cases.length + 1).padStart(3, '0')}`,
      title: newCase.title,
      description: newCase.description,
      severity,
      date: new Date().toISOString().split('T')[0],
      status: 'open',
    };

    setCases([newCaseData, ...cases]);
    setNewCase({ title: '', description: '' });
    setAiSeverity(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  return (
    <>
      <PortalHeader title="Blotter Report" description="File and track incident reports" />
      
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* File Report Button */}
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="mb-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            File a Report
          </Button>
        )}

        {/* Report Form */}
        {showForm && (
          <Card className="p-6 mb-8 border-primary/20 animate-fadeUp">
            <h2 className="text-2xl font-bold text-foreground mb-6">File a Blotter Report</h2>
            <form onSubmit={handleSubmitCase} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Incident Title</label>
                <Input
                  type="text"
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  placeholder="Brief title of the incident..."
                  className="border-input focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={newCase.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Describe what happened in detail..."
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={5}
                  required
                />
              </div>

              {aiSeverity && (
                <div className={`p-4 border rounded-lg animate-fadeUp ${
                  aiSeverity === 'high' ? 'bg-destructive/10 border-destructive/20' :
                  aiSeverity === 'medium' ? 'bg-accent/10 border-accent/20' :
                  'bg-primary/10 border-primary/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <p className="font-semibold">
                      {aiSeverity === 'high' ? 'High Priority Incident' :
                       aiSeverity === 'medium' ? 'Medium Priority Incident' :
                       'Low Priority Report'}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {aiSeverity === 'high' && 'This appears to be a serious incident requiring immediate attention.'}
                    {aiSeverity === 'medium' && 'This incident requires regular follow-up.'}
                    {aiSeverity === 'low' && 'This is a routine report.'}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setNewCase({ title: '', description: '' });
                    setAiSeverity(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Submit Report
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Recent Cases */}
        <Card className="border-primary/20">
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Your Reports</h2>
            <div className="space-y-4">
              {cases.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reports yet.</p>
              ) : (
                cases.map((caseItem) => (
                  <div key={caseItem.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">{caseItem.id}</span>
                        <h3 className="font-semibold text-foreground text-lg">{caseItem.title}</h3>
                        {getSeverityIcon(caseItem.severity)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`
                          ${caseItem.severity === 'high' ? 'bg-destructive/10 text-destructive' : ''}
                          ${caseItem.severity === 'medium' ? 'bg-accent/20 text-accent-foreground' : ''}
                          ${caseItem.severity === 'low' ? 'bg-primary/10 text-primary' : ''}
                        `}>
                          {caseItem.severity}
                        </Badge>
                        <Badge className={caseItem.status === 'resolved' ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-accent-foreground'}>
                          {caseItem.status}
                        </Badge>
                        <button
                          onClick={() => handleDelete(caseItem.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">{caseItem.description}</p>
                    <p className="text-xs text-muted-foreground">Reported on {caseItem.date}</p>
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
