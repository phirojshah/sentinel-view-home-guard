
import React from 'react';
import { Bell, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-2">
        <Shield className="h-8 w-8" />
        <h1 className="text-xl font-bold">SentinelView HomeGuard</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
