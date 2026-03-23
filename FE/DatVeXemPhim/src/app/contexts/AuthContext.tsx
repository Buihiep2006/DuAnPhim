import React, { createContext, useContext, useState, useEffect } from 'react';
import { NguoiDung, VaiTro } from '../../types/database.types';

interface AuthContextType {
  user: NguoiDung | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<NguoiDung>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<NguoiDung>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NguoiDung | null>(null);

  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // Mock login - check against mock data
      const mockUser: NguoiDung = {
        id: '1',
        hang_thanh_vien_id: '1',
        ma: 'KH001',
        ho_ten: 'Nguyễn Văn A',
        email: email,
        mat_khau: null,
        ngay_sinh: new Date('1990-01-01'),
        gioi_tinh: 0,
        so_dien_thoai: '0123456789',
        auth_provider: 'LOCAL',
        provider_id: null,
        hinh_anh_dai_dien: null,
        diem_tich_luy: 500,
        vai_tro: VaiTro.KHACH_HANG,
        trang_thai: 1,
        ngay_tao: new Date()
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      const mockAdmin: NguoiDung = {
        id: 'admin1',
        hang_thanh_vien_id: null,
        ma: 'ADMIN001',
        ho_ten: 'Admin System',
        email: email,
        mat_khau: null,
        ngay_sinh: null,
        gioi_tinh: null,
        so_dien_thoai: '0987654321',
        auth_provider: 'LOCAL',
        provider_id: null,
        hinh_anh_dai_dien: null,
        diem_tich_luy: 0,
        vai_tro: VaiTro.ADMIN,
        trang_thai: 1,
        ngay_tao: new Date()
      };

      setUser(mockAdmin);
      localStorage.setItem('user', JSON.stringify(mockAdmin));
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const register = async (userData: Partial<NguoiDung>): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      const newUser: NguoiDung = {
        id: Date.now().toString(),
        hang_thanh_vien_id: '1', // Default member tier
        ma: `KH${Date.now()}`,
        ho_ten: userData.ho_ten || '',
        email: userData.email || '',
        mat_khau: null,
        ngay_sinh: userData.ngay_sinh || null,
        gioi_tinh: userData.gioi_tinh || null,
        so_dien_thoai: userData.so_dien_thoai || null,
        auth_provider: 'LOCAL',
        provider_id: null,
        hinh_anh_dai_dien: null,
        diem_tich_luy: 0,
        vai_tro: VaiTro.KHACH_HANG,
        trang_thai: 1,
        ngay_tao: new Date()
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<NguoiDung>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.vai_tro === VaiTro.ADMIN || user?.vai_tro === VaiTro.QUAN_LY;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        loginAdmin,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
