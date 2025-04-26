import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { RiDashboardLine, RiArchiveLine, RiFileListLine, RiRobot2Line, 
         RiBarChartBoxLine, RiTeamLine, RiTruckLine, RiSettings4Line } from 'react-icons/ri';
import Reports from './components/Reports';
import Users from './components/Users';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-xl font-semibold mb-8">Menu</h1>
            <nav className="space-y-2">
              <Link to="/" className="flex items-center p-2 hover:bg-gray-100 rounded">
                <RiDashboardLine className="mr-2 text-xl" />
                Dashboard
              </Link>
              <Link to="/inventory" className="flex items-center p-2 hover:bg-gray-100 rounded">
                <RiArchiveLine className="mr-2 text-xl" />
                Inventory
              </Link>
              <Link to="/billing" className="flex items-center p-2 hover:bg-gray-100 rounded">
                <RiFileListLine className="mr-2 text-xl" />
                Billing
              </Link>
              <Link to="/ai-insights" className="flex items-center p-2 hover:bg-gray-100 rounded">
                <RiRobot2Line className="mr-2 text-xl" />
                AI Insights
              </Link>
              <Link to="/reports" className="flex items-center p-2 hover:bg-gray-100 rounded">
                <RiBarChartBoxLine className="mr-2 text-xl" />
                Reports
              </Link>
              <Link to="/users" className="flex items-center p-2 hover:bg-gray-100 rounded">
                <RiTeamLine className="mr-2 text-xl" />
                Users
              </Link>
              <Link to="/suppliers" className="flex items-center p-2 hover:bg-gray-100 rounded">
                <RiTruckLine className="mr-2 text-xl" />
                Suppliers
              </Link>
              <Link to="/settings" className="flex items-center p-2 hover:bg-gray-100 rounded">
                <RiSettings4Line className="mr-2 text-xl" />
                Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Users />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Placeholder components (you can create separate files for these later)
const Dashboard = () => <div className="p-4">Dashboard Content</div>;
const Inventory = () => <div className="p-4">Inventory Content</div>;
const Billing = () => <div className="p-4">Billing Content</div>;
const AIInsights = () => <div className="p-4">AI Insights Content</div>;
const Suppliers = () => <div className="p-4">Suppliers Content</div>;
const Settings = () => <div className="p-4">Settings Content</div>;

export default App; 