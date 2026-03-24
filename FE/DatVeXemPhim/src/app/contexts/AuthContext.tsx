import React, { createContext, useContext, useState, useEffect } from 'react';
import { NguoiDung, VaiTro, AuthProvider } from '../../types/database.types';

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

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NguoiDung | null>(null);

  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const API_ADMIN = 'http://localhost:9999/api/admin';

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_ADMIN}/khach-hang/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, matKhau: password })
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        const d = data.data;
        const userData: NguoiDung = {
          id: d.id,
          ma: d.ma,
          ho_ten: d.hoTen,
          email: d.email,
          mat_khau: d.matKhau,
          ngay_sinh: d.ngaySinh,
          gioi_tinh: d.gioiTinh,
          so_dien_thoai: d.soDienThoai,
          hinh_anh_dai_dien: d.hinhAnh,
          diem_tich_luy: d.diemTichLuy || 0,
          hang_thanh_vien_id: d.hangThanhVienId,
          auth_provider: AuthProvider.LOCAL,
          provider_id: null,
          trang_thai: d.trangThai,
          ngay_tao: d.ngayTao || new Date(),
          vai_tro: VaiTro.KHACH_HANG
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_ADMIN}/nhan-vien/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, matKhau: password })
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        const d = data.data;
        const adminData: NguoiDung = {
          id: d.id,
          ma: d.ma,
          ho_ten: d.hoTen,
          email: d.email,
          mat_khau: d.matKhau,
          ngay_sinh: d.ngaySinh,
          gioi_tinh: d.gioiTinh,
          so_dien_thoai: d.soDienThoai,
          hinh_anh_dai_dien: d.hinhAnh,
          diem_tich_luy: 0,
          hang_thanh_vien_id: null,
          auth_provider: AuthProvider.LOCAL,
          provider_id: null,
          trang_thai: d.trangThai,
          ngay_tao: d.ngayTao || new Date(),
          vai_tro: d.vaiTroMa === 'ADMIN' ? VaiTro.ADMIN : VaiTro.NHAN_VIEN
        };
        setUser(adminData);
        localStorage.setItem('user', JSON.stringify(adminData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const register = async (userData: Partial<NguoiDung>): Promise<boolean> => {
    try {
      const res = await fetch(`${API_ADMIN}/khach-hang`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hoTen: userData.ho_ten,
          email: userData.email,
          matKhau: userData.mat_khau,
          soDienThoai: userData.so_dien_thoai,
          ngaySinh: userData.ngay_sinh,
          gioiTinh: userData.gioi_tinh,
          trangThai: 1
        })
      });
      const data = await res.json();
      
      if (data.success) {
        // Automatically login after register
        return login(userData.email!, userData.mat_khau!);
      }
      return false;
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
