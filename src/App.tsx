import React, { useState } from 'react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemoScenarioBar } from './components/layout/DemoScenarioBar';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { InventoryPage } from './components/inventory/InventoryPage';
import { OrdersPage } from './components/orders/OrdersPage';
import { OrderDetailPage } from './components/orders/OrderDetailPage';
import { AllocationCenterPage } from './components/allocation/AllocationCenterPage';
import { PickingPage } from './components/picking/PickingPage';
import { PackingPage } from './components/packing/PackingPage';
import { QualityCheckPage } from './components/qc/QualityCheckPage';
import { DispatchPage } from './components/dispatch/DispatchPage';
import { ExceptionsPage } from './components/exceptions/ExceptionsPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { AIAssistantPage } from './components/assistant/AIAssistantPage';
import { AuditLogsPage } from './components/common/AuditLogsPage';
import { SettingsPage } from './components/common/SettingsPage';
import { LoginPage } from './components/auth/LoginPage';
import { UserRole } from './types';

const MainLayout: React.FC<{ onLogout: () => void }> = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
    setActiveTab('order-detail');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActiveTab} />;
      case 'inventory':
        return <InventoryPage />;
      case 'orders':
        return <OrdersPage onSelectOrder={handleSelectOrder} />;
      case 'order-detail':
        return (
          <OrderDetailPage
            orderId={selectedOrderId || 'ORD-1042'}
            onBack={() => setActiveTab('orders')}
          />
        );
      case 'allocation':
        return <AllocationCenterPage />;
      case 'picking':
        return <PickingPage />;
      case 'packing':
        return <PackingPage />;
      case 'qc':
        return <QualityCheckPage />;
      case 'dispatch':
        return <DispatchPage />;
      case 'exceptions':
        return <ExceptionsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'assistant':
        return <AIAssistantPage />;
      case 'audit':
        return <AuditLogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header onToggleAssistant={() => setActiveTab('assistant')} />
      <DemoScenarioBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-105px)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default to logged in for instant demo

  const handleLogin = (role: UserRole) => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <AppDataProvider>
      <MainLayout onLogout={() => setIsAuthenticated(false)} />
    </AppDataProvider>
  );
}
