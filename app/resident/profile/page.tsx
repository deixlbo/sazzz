'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PortalHeader } from '@/components/portal/header';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Juan Dela Cruz',
    email: 'juan@email.com',
    phone: '0912-345-6789',
    address: 'Purok 1, Zone 1, Barangay Santiago',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <>
      <PortalHeader title="My Profile" description="View and manage your account information" />
      
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Profile Header */}
        <Card className="p-8 mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-5xl font-bold">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{formData.name}</h2>
              <p className="text-muted-foreground">Registered Resident</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">Account Active</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="p-8 border-primary/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
              {isEditing ? (
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-input focus:ring-primary/50"
                />
              ) : (
                <p className="text-foreground text-lg">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
              {isEditing ? (
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-input focus:ring-primary/50"
                />
              ) : (
                <p className="text-foreground text-lg">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
              {isEditing ? (
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-input focus:ring-primary/50"
                />
              ) : (
                <p className="text-foreground text-lg">{formData.phone || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Address</label>
              {isEditing ? (
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border-input focus:ring-primary/50"
                />
              ) : (
                <p className="text-foreground text-lg">{formData.address || 'Not provided'}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-8">
              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Save Changes
              </Button>
            </div>
          )}
        </Card>

        {/* Account Statistics */}
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 text-center border-primary/20">
            <p className="text-3xl font-bold text-primary">2</p>
            <p className="text-muted-foreground mt-2">Documents Requested</p>
          </Card>
          <Card className="p-6 text-center border-primary/20">
            <p className="text-3xl font-bold text-primary">1</p>
            <p className="text-muted-foreground mt-2">Active Cases</p>
          </Card>
          <Card className="p-6 text-center border-primary/20">
            <p className="text-3xl font-bold text-primary">4</p>
            <p className="text-muted-foreground mt-2">Programs Enrolled</p>
          </Card>
        </div>
      </div>
    </>
  );
}
