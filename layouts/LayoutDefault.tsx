import "./style.css";
import "./tailwind.css";
import { Link } from "../components/Link.js";
import { useState, useEffect } from "react";
import { MdHome, MdPeople, MdPerson, MdComputer, MdBarChart, MdSettings, MdNotifications, MdMenu } from "react-icons/md";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/v1/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/v1/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-base-100">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-base-300">
            <h1 className="text-xl font-bold text-primary">Small Turtle House</h1>
            <p className="text-sm text-base-content/60">Riichi Mahjong</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/" className="btn btn-ghost w-full justify-start">
              <MdHome className="w-5 h-5 mr-2" />
              Lobbies
            </Link>
            
            {isAuthenticated && (
              <>
                <Link href="/queue" className="btn btn-ghost w-full justify-start">
                  <MdPeople className="w-5 h-5 mr-2" />
                  Queue
                </Link>
                
                <Link href="/profile" className="btn btn-ghost w-full justify-start">
                  <MdPerson className="w-5 h-5 mr-2" />
                  Profile
                </Link>
                
                <Link href="/bots" className="btn btn-ghost w-full justify-start">
                  <MdComputer className="w-5 h-5 mr-2" />
                  My Bots
                </Link>
                
                <Link href="/friends" className="btn btn-ghost w-full justify-start">
                  <MdPeople className="w-5 h-5 mr-2" />
                  Friends
                </Link>
              </>
            )}
            
            <Link href="/leaderboards" className="btn btn-ghost w-full justify-start">
              <MdBarChart className="w-5 h-5 mr-2" />
              Leaderboards
            </Link>

            {user?.role === 'admin' && (
              <Link href="/admin" className="btn btn-ghost w-full justify-start">
                <MdSettings className="w-5 h-5 mr-2" />
                Admin
              </Link>
            )}
          </nav>
          
          <div className="p-4 border-t border-base-300">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{user?.username}</span>
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="btn btn-ghost btn-circle btn-sm"
                    >
                      <MdNotifications className="w-5 h-5" />
                      {notifications.length > 0 && (
                        <span className="badge badge-xs badge-primary absolute -top-1 -right-1">{notifications.length}</span>
                      )}
                    </button>
                    {showNotifications && (
                      <div className="absolute bottom-full right-0 mb-2 w-64 bg-base-200 rounded-lg shadow-lg p-4">
                        <h3 className="font-semibold mb-2">Notifications</h3>
                        {notifications.length === 0 ? (
                          <p className="text-sm text-base-content/60">No new notifications</p>
                        ) : (
                          <div className="space-y-2">
                            {notifications.map((notif, idx) => (
                              <div key={idx} className="text-sm p-2 bg-base-300 rounded">
                                {notif.message}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm w-full">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary btn-sm w-full">
                Login
              </Link>
            )}
          </div>
        </div>
      </Sidebar>
      
      <div className="flex-1 flex flex-col">
        <header className="bg-base-200 p-4 flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn btn-ghost btn-circle"
          >
            <MdMenu className="w-6 h-6" />
          </button>
        </header>
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ 
  children, 
  isOpen, 
  onToggle 
}: { 
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <aside className={`
      bg-base-200 transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}
    `}>
      {children}
    </aside>
  );
}