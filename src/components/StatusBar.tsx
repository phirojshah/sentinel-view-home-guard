
import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  status: 'secure' | 'alert' | 'idle';
  lastUpdated: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ status, lastUpdated }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'secure':
        return {
          icon: Shield,
          text: 'System Secure',
          color: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'alert':
        return {
          icon: AlertCircle,
          text: 'Alert Detected',
          color: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'idle':
      default:
        return {
          icon: Shield,
          text: 'System Monitoring',
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        };
    }
  };

  const { icon: Icon, text, color } = getStatusDetails();

  return (
    <div className={cn("flex items-center justify-between rounded-lg border p-3", color)}>
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5" />
        <span className="font-medium">{text}</span>
      </div>
      <div className="text-sm">
        Last updated: {lastUpdated}
      </div>
    </div>
  );
};

export default StatusBar;
