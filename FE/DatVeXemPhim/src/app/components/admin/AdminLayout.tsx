import { Outlet, Link, useLocation } from "react-router";
import { Film, LayoutDashboard, Users, DollarSign, Settings, MapPin, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get admin user info
  const adminUser = localStorage.getItem("adminUser");
  const user = adminUser ? JSON.parse(adminUser) : null;

  const navigation = [
    { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { name: "Quản lý phim", href: "/admin/movies", icon: Film },
    { name: "Quản lý rạp", href: "/admin/cinemas", icon: MapPin },
    { name: "Doanh thu", href: "/admin/sales", icon: DollarSign },
    { name: "Người dùng", href: "/admin/users", icon: Users },
    { name: "Cài đặt", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Film className="h-6 w-6 text-red-500" />
          <span className="font-bold text-white">Admin Panel</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-300 hover:text-white"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 flex flex-col`}
        >
          <div className="hidden lg:flex items-center space-x-2 px-6 py-5 border-b border-gray-800">
            <Film className="h-6 w-6 text-red-500" />
            <span className="font-bold text-white text-lg">Admin Panel</span>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-4 py-4 border-b border-gray-800">
              <div className="flex items-center space-x-3 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.fullName?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.username}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="p-4 space-y-2 flex-1">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/admin" && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Film className="h-5 w-5" />
              <span className="font-medium">Về trang chủ</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}