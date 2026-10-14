/**
 * =========================================================================
 * CẤU HÌNH KẾT NỐI GOOGLE SHEETS TRỰC TIẾP
 * =========================================================================
 */

export const GOOGLE_APPS_SCRIPT_URL: string =
  (import.meta.env.VITE_GAS_URL as string) ||
  'https://script.google.com/macros/s/AKfycbxYJBH7pekIZ_nkJZ9f1hFXCEhlrKLfO2Fa0e5r5EXsV_oMG-ZvVi8kDZkA8sQ8yDboYg/exec';
