import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 기본 테마는 블랙(dark)으로 설정
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('vvip_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('vvip_theme', theme);
    // HTML body에 테마 클래스 적용 (전역 CSS 변수 활용 가능)
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * 한글 주석:
 * ThemeContext는 앱의 시각적 테마(화이트/블랙)를 관리합니다.
 * 로컬 스토리지에 저장되어 사용자가 다시 앱을 켰을 때도 설정이 유지됩니다.
 */
