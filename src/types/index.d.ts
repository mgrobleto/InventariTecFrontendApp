export {};

declare global {
    
  interface Window {
    drf: string;
    csrfToken : string;
  }
}
