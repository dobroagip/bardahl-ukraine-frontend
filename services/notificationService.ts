import { Order, CustomerRequest, User, AbandonedCart } from '../types';

const TG_TOKEN = process.env.TG_TOKEN;;
const TG_CHAT_ID = '5048914025';
const resend = new Resend(process.env.RESEND_API_KEY);
const DEFAULT_ADMIN_EMAIL = 'info@bardahl-ukraine.com';

export const notificationService = {
  /**
   * Отправка приветственного письма при регистрации
   */
  async sendWelcomeEmail(user: User): Promise<void> {
    const isUk = localStorage.getItem('bardahl_lang') === 'uk';
    const subject = isUk ? 'Вітаємо у Bardahl Ukraine!' : 'Добро пожаловать в Bardahl Ukraine!';

    const html = `
      <div style="font-family: sans-serif; background: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border-top: 6px solid #FFD700; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <div style="padding: 30px;">
            <h1 style="color: #000; margin-bottom: 20px; font-size: 24px;">${isUk ? 'Успішна реєстрація!' : 'Успешная регистрация!'}</h1>
            <p style="font-size: 16px; color: #333;">${isUk ? 'Вітаємо,' : 'Здравствуйте,'} ${user.firstName}!</p>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              ${isUk 
                ? 'Ви успішно зареєструвалися в офіційному магазині Bardahl Ukraine. Тепер ви можете переглядати історію замовлень та керувати своїм гаражем у особистому кабінеті.' 
                : 'Вы успешно зарегистрировались в официальном магазине Bardahl Ukraine. Теперь вы можете просматривать историю заказов и управлять своим гаражом в личном кабинете.'}
            </p>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #eee;">
              <p><strong>Email:</strong> ${user.email}</p>
            </div>
            <div style="text-align: center;"><a href="https://bardahl-ukraine.com" style="background: #FFD700; color: #000; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold;">${isUk ? 'Перейти до магазину' : 'Перейти в магазин'}</a></div>
          </div>
        </div>
      </div>
    `;

    await this.sendToEmail({ to: user.email, subject, html });
  },

  /**
   * Уведомление КЛИЕНТУ о брошенной корзине
   */
  async sendAbandonedCartEmail(cart: AbandonedCart): Promise<void> {
    const isUk = localStorage.getItem('bardahl_lang') === 'uk';
    const subject = isUk ? 'Ви щось забули у кошику? — Bardahl Ukraine' : 'Вы что-то забыли в корзине? — Bardahl Ukraine';

    const itemsHtml = cart.items.map(item => `
      <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
        <img src="${item.image}" width="60" height="60" style="object-fit: contain; margin-right: 15px;">
        <div style="flex: 1;">
          <div style="font-size: 14px; font-weight: bold; color: #333;">${item.name}</div>
          <div style="font-size: 12px; color: #999;">${item.volume} • ${item.quantity} шт.</div>
        </div>
        <div style="font-weight: bold; color: #000;">${item.price * item.quantity} грн</div>
      </div>
    `).join('');

    const html = `
      <div style="font-family: sans-serif; background: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border-top: 6px solid #FFD700; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <div style="padding: 30px;">
            <h2 style="color: #000; margin-bottom: 15px;">${isUk ? 'Ваші товари чекають на вас!' : 'Ваши товары ждут вас!'}</h2>
            <p style="color: #666; font-size: 14px;">${isUk ? 'Ми помітили, що ви залишили товари у кошику. Вони все ще зарезервовані для вас.' : 'Мы заметили, что вы оставили товары в корзине. Они все еще зарезервированы для вас.'}</p>
            
            <div style="margin: 25px 0;">
              ${itemsHtml}
            </div>

            <div style="text-align: right; margin-bottom: 25px;">
               <span style="font-size: 18px; font-weight: bold;">${isUk ? 'Разом' : 'Итого'}: ${cart.total} грн</span>
            </div>

            <div style="text-align: center;">
              <a href="https://bardahl-ukraine.com" style="display: inline-block; background: #000; color: #FFD700; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 900; text-transform: uppercase;">${isUk ? 'Завершити замовлення' : 'Завершить заказ'}</a>
            </div>
          </div>
        </div>
      </div>
    `;

    await this.sendToEmail({ to: cart.email, subject, html });
  },

  /**
   * Уведомление АДМИНУ о брошенной корзине
   */
  async sendAbandonedCartAdminAlert(cart: AbandonedCart): Promise<void> {
    const itemsList = cart.items.map(i => `• ${i.name} (${i.quantity} шт)`).join('\n');
    const message = `
⚠️ *БРОШЕННАЯ КОРЗИНА*
--------------------------
👤 *Клиент:* ${cart.customerName || 'Гость'}
📧 *Email:* ${cart.email}
📞 *Телефон:* ${cart.phone || '-'}

🛒 *ТОВАРЫ:*
${itemsList}

💰 *СУММА: ${cart.total} грн*
--------------------------
💡 _Пользователь ушел с чекаута, не нажав кнопку "Заказать"._
    `;

    await this.sendToTelegram(message);
    
    await this.sendToEmail({
      subject: `⚠️ Брошенная корзина: ${cart.email}`,
      html: `<h3>Потенциально упущенный заказ</h3><p>Email: ${cart.email}</p><p>Сумма: ${cart.total} грн</p><p>Состав: ${itemsList}</p>`
    });
  },

  async sendCustomerOrderConfirmation(order: Order): Promise<void> {
    if (!order.customer.email) return;
    const isUk = localStorage.getItem('bardahl_lang') === 'uk';
    const subject = isUk ? `Замовлення #${order.id.slice(-6)} прийнято` : `Заказ #${order.id.slice(-6)} принят`;
    await this.sendToEmail({ to: order.customer.email, subject, html: `<h3>Ваш заказ #${order.id.slice(-6)} принят и обрабатывается</h3><p>Спасибо за выбор Bardahl!</p>` });
  },

  async sendOrderNotification(order: Order): Promise<void> {
    const message = `🔥 *НОВЫЙ ЗАКАЗ # ${order.id.slice(-6)}* ...`;
    this.sendToTelegram(message);
    if (order.customer.email) this.sendCustomerOrderConfirmation(order).catch(console.error);
  },

  async sendRequestNotification(req: Omit<CustomerRequest, 'id' | 'date' | 'status'>): Promise<void> {
    const message = `⚡️ *ЗАПРОС:* ${req.type} ...`;
    this.sendToTelegram(message);
  },

  async sendToTelegram(text: string) {
    try {
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: 'Markdown' })
      });
    } catch (e) { console.error('TG error', e); }
  },

  async sendToEmail({ to, subject, html }: { to?: string; subject: string; html: string }) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: 'Bardahl Ukraine <onboarding@resend.dev>', to: to || DEFAULT_ADMIN_EMAIL, subject, html })
      });
    } catch (e) { console.error('Email error', e); }
  }
};