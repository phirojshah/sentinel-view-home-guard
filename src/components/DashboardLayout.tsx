
import React, { ReactNode } from 'react';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-6 px-4">
        {children}
      </main>
      <footer className="bg-secondary py-4 text-center text-sm text-muted-foreground">
        <p>© 2024 SentinelView HomeGuard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardLayout;
