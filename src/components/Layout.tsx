import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
        <main>{children}</main>
      </div>
      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} AgentSync. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;