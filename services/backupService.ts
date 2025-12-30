
import { Order, CustomerRequest, MasterProduct, MasterPromotion, MasterBlogPost, User } from '../types';
import { ORDERS_STORAGE_KEY } from './orderService';

interface BackupData {
  timestamp: string;
  version: string;
  data: {
    orders: Order[];
    requests: CustomerRequest[];
    products: MasterProduct[];
    promotions: MasterPromotion[];
    blog: MasterBlogPost[];
    users: User[];
  }
}

export const backupService = {
  createBackup: (): void => {
    const backup: BackupData = {
      timestamp: new Date().toISOString(),
      version: '1.1',
      data: {
        orders: JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]'),
        requests: JSON.parse(localStorage.getItem('bardahl_customer_requests') || '[]'),
        products: JSON.parse(localStorage.getItem('bardahl_master_products_v2') || '[]'),
        promotions: JSON.parse(localStorage.getItem('bardahl_master_promotions') || '[]'),
        blog: JSON.parse(localStorage.getItem('bardahl_blog_posts') || '[]'),
        users: JSON.parse(localStorage.getItem('bardahl_users_db') || '[]'),
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `bardahl_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  },

  restoreBackup: async (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string) as BackupData;
          if (!json.data) {
            resolve({ success: false, message: 'Неверный формат файла бэкапа' });
            return;
          }

          if (json.data.orders) localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(json.data.orders));
          if (json.data.requests) localStorage.setItem('bardahl_customer_requests', JSON.stringify(json.data.requests));
          if (json.data.products) localStorage.setItem('bardahl_master_products_v2', JSON.stringify(json.data.products));
          if (json.data.promotions) localStorage.setItem('bardahl_master_promotions', JSON.stringify(json.data.promotions));
          if (json.data.blog) localStorage.setItem('bardahl_blog_posts', JSON.stringify(json.data.blog));
          if (json.data.users) localStorage.setItem('bardahl_users_db', JSON.stringify(json.data.users));

          resolve({ success: true, message: 'База данных успешно восстановлена!' });
        } catch (e) {
          resolve({ success: false, message: 'Ошибка при чтении файла' });
        }
      };
      reader.readAsText(file);
    });
  }
};
