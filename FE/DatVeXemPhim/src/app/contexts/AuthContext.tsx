import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthProvider, NguoiDung, VaiTro } from '../../types/database.types';

interface AuthContextType {
  user: NguoiDung | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Partial<NguoiDung>) => Promise<boolean>;
  completeGoogleLogin: (token: string, googleUser: any) => void;
  logout: () => void;
  updateUser: (userData: Partial<NguoiDung>) => void;
}

interface AuthApiResponse<T> {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: T;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_ADMIN = 'http://localhost:9999/api/admin';
const API_CUSTOMER_AUTH = 'http://localhost:9999/api/customer/auth';
const USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'authToken';

const getStoredUser = (): NguoiDung | null => {
  const savedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const getStoredToken = (): string | null => {
  const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  return savedToken || null;
};

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NguoiDung | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const requestUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const shouldAttachToken = requestUrl.startsWith(API_ADMIN) || requestUrl.startsWith('http://localhost:9999/api/customer');

      if (!shouldAttachToken || !token) {
        return originalFetch(input, init);
      }

      const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
      headers.set('Authorization', `Bearer ${token}`);

      const response = await originalFetch(input, { ...init, headers });
      if (response.status === 401 || response.status === 403) {
        clearAuthState();
      }
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [token]);

  const clearAuthState = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const saveAuthState = (nextUser: NguoiDung, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
  };

  const mapCustomerUser = (d: any): NguoiDung => ({
    id: d.id,
    ma: d.ma,
    ho_ten: d.hoTen,
    email: d.email,
    mat_khau: null,
    ngay_sinh: d.ngaySinh,
    gioi_tinh: d.gioiTinh,
    so_dien_thoai: d.soDienThoai,
    hinh_anh_dai_dien: d.hinhAnhDaiDien ?? d.hinhAnh,
    diem_tich_luy: d.diemTichLuy || 0,
    hang_thanh_vien_id: d.hangThanhVienId ?? null,
    auth_provider: AuthProvider.LOCAL,
    provider_id: d.providerId ?? null,
    trang_thai: d.trangThai,
    ngay_tao: d.ngayTao || new Date(),
    vai_tro: VaiTro.KHACH_HANG
  });

  const mapAdminUser = (d: any): NguoiDung => ({
    id: d.id,
    ma: d.ma,
    ho_ten: d.hoTen,
    email: d.email,
    mat_khau: null,
    ngay_sinh: d.ngaySinh,
    gioi_tinh: d.gioiTinh,
    so_dien_thoai: d.soDienThoai,
    hinh_anh_dai_dien: d.hinhAnhDaiDien,
    diem_tich_luy: 0,
    hang_thanh_vien_id: null,
    auth_provider: AuthProvider.LOCAL,
    provider_id: null,
    trang_thai: d.trangThai,
    ngay_tao: d.ngayTao || new Date(),
    vai_tro: d.vaiTroMa === 'ADMIN' ? VaiTro.ADMIN : d.vaiTroMa === 'QUAN_LY' ? VaiTro.QUAN_LY : VaiTro.NHAN_VIEN
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_CUSTOMER_AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, matKhau: password })
      });
      const data: AuthApiResponse<any> = await res.json();

      if (data.success && data.data?.user && data.data.token) {
        saveAuthState(mapCustomerUser(data.data.user), data.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_ADMIN}/nhan-vien/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, matKhau: password })
      });
      const data: AuthApiResponse<any> = await res.json();

      if (data.success && data.data?.user && data.data.token) {
        saveAuthState(mapAdminUser(data.data.user), data.data.token);
        return { success: true };
      }
      return { success: false, message: data.message || 'Email hoặc mật khẩu không đúng' };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ' };
    }
  };

  const register = async (userData: Partial<NguoiDung>): Promise<boolean> => {
    try {
      const res = await fetch(`${API_CUSTOMER_AUTH}/register`, {
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
        return login(userData.email!, userData.mat_khau!);
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const completeGoogleLogin = (nextToken: string, googleUser: any) => {
    saveAuthState(mapCustomerUser(googleUser), nextToken);
  };

  const logout = () => {
    clearAuthState();
  };

  const updateUser = (userData: Partial<NguoiDung>) => {
    if (user && token) {
      const updatedUser = { ...user, ...userData };
      saveAuthState(updatedUser, token);
    }
  };

  const isAuthenticated = user !== null && token !== null;
  const isAdmin = user?.vai_tro === VaiTro.ADMIN || user?.vai_tro === VaiTro.QUAN_LY || user?.vai_tro === VaiTro.NHAN_VIEN;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        loginAdmin,
        register,
        completeGoogleLogin,
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
