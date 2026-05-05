/**
 * THE SEOUL PRIVATE Theme Configuration (v3.0.0)
 * --------------------------------------------
 * 화이트/블랙 테마 및 골드 포인트를 관리하는 디자인 시스템 토큰입니다.
 */

export const colors = {
  gold: {
    500: '#D4AF37', // 시그니처 골드
    600: '#B5952F', // 어두운 골드
  },
  obsidian: {
    950: '#020202', // 딥 블랙
    900: '#050505', // 메인 블랙
    800: '#121212', // 어두운 회색
    700: '#1f1f1f',
  }
};

export const themes = {
  dark: {
    bg: colors.obsidian[900],
    surface: colors.obsidian[800],
    text: '#E5E7EB', // gray-200
    textMuted: '#9CA3AF', // gray-400
    border: 'rgba(212, 175, 55, 0.2)', // gold border
    logoBg: 'transparent'
  },
  light: {
    bg: '#FFFFFF',
    surface: '#F9FAFB', // gray-50
    text: colors.obsidian[900],
    textMuted: '#6B7280', // gray-500
    border: 'rgba(212, 175, 55, 0.4)',
    logoBg: colors.obsidian[900] // 화이트 배경일 때 로고가 돋보이도록 블랙 배경 처리
  }
};

/**
 * 한글 주석:
 * 이 파일은 앱 전체의 색상 테마를 정의합니다. 
 * 'light' 테마일 때 로고 배경을 블랙으로 설정하여 프리미엄 이미지를 유지하도록 설계되었습니다.
 */
