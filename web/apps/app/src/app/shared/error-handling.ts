import { HttpErrorResponse } from '@angular/common/http';

export function handleErrorMessage(error: unknown) {
  if (error instanceof HttpErrorResponse) {
    switch (error.status) {
      case 400:
        return '輸入資料有誤，請重新確認';
      case 401:
        return '您尚未進行身份驗證，請先進行登入';
      case 403:
        return '您沒有權限查閱相關內容，若有需要請與網站管理員聯絡';
      case 404:
        return '找不到相關資料或頁面，請重新確認';
      case 409:
        return '請求的操作與伺服器上現有的資源發生衝突，請檢查並重試';
      case 412:
        return '請求的資源已被修改或條件無效，請重新加載並重試';
      case 0:
        return '網路連線發生問題，請檢查您的網路連線';
      default:
        return '伺服器發生錯誤，請稍後再試';
    }
  }

  return `發生未預期的錯誤，請稍後再試`;
}
