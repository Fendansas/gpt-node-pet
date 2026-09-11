import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useState } from 'react';

export function Layout() {
  const [sidebarWidth, setSidebarWidth] = useState(240);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Sidebar onToggle={(collapsed) => setSidebarWidth(collapsed ? 72 : 240)} />
      <main
        className="min-h-screen transition-all duration-200"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
