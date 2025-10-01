export type NotificationType = 'success' | 'error';

export interface NotificationData {
  message: string;
  type: NotificationType;
}
