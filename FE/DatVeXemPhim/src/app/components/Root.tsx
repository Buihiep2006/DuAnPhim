import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Film, User, ShoppingCart, Menu, X, LogOut, UserCircle, Ticket } from "lucide-react";
import { useState, useEffect } from "react";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check if user is logged in
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const userData = localStorage.getItem("user");
    if (userToken && userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setUser(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  const navigation = [
    { name: "Trang chủ", href: "/", icon: Film },
    { name: "Lịch chiếu", href: "/#showtimes", icon: Film },
    { name: "Khuyến mãi", href: "/#promotions", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-red-500" />
              <span className="font-bold text-xl text-white">DatnCinema</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.ten?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="hidden sm:inline">{user.ten}</span>
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-800">
                          <p className="text-sm font-medium text-white">{user.ten}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <UserCircle className="h-4 w-4" />
                          <span>Thông tin tài khoản</span>
                        </Link>
                        
                        <Link
                          to="/profile?tab=history"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <Ticket className="h-4 w-4" />
                          <span>Lịch sử đặt vé</span>
                        </Link>
                        
                        <div className="border-t border-gray-800 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </Link>
              )}

              {cartCount > 0 && (
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 text-gray-300" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {user && (
                <>
                  <div className="border-t border-gray-800 mt-2 pt-2">
                    <Link
                      to="/profile"
                      className="block py-2 text-gray-300 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tài khoản của tôi
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Film className="h-6 w-6 text-red-500" />
                <span className="font-bold text-lg text-white">DatnCinema</span>
              </div>
              <p className="text-gray-400 text-sm">
                Hệ thống rạp chiếu phim hàng đầu Việt Nam
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Liên hệ</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Hotline: 1900 xxxx</p>
                <p>Email: support@datncinema.vn</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Kết nối</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2026 DatnCinema. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}