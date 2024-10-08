export interface Toast {
  id: number;
  title: string;
  message: string;
  type: string;
  iconClass: string;
  visible: boolean;
}

export interface ToastRefs {
  [key: number]: HTMLElement;
}
