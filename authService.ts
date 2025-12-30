import { User, Order } from '../types';

// Keys for LocalStorage "Database"
const USERS_KEY = 'bardahl_users_db';
const CURRENT_USER_KEY = 'bardahl_current_user';
const ORDERS_KEY = 'bardahl_orders';

// TODO: Replace this with your actual Google Client ID from Google Cloud Console
// For localhost, you need to create credentials in GCP.
// If empty, the button won't render correctly or will show an error.
export const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com"; 

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to decode JWT (simulate backend verification)
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const authService = {
  // --- AUTHENTICATION ---

  async login(email: string, password: string): Promise<User> {
    await delay(800); // Simulate API call
    
    // Hardcoded Admin Check
    if (email === 'admin@bardahl.ua' && password === 'admin123') {
        const adminUser: User = {
            id: 'admin-001',
            email: 'admin@bardahl.ua',
            firstName: 'Admin',
            lastName: 'System',
            createdAt: new Date().toISOString(),
            role: 'admin',
            phone: '+380000000000'
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
        return adminUser;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    // In a real app, password should be hashed. Here we just mock check.
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    const safeUser = { ...user, role: user.role || 'user' };
    delete safeUser.password;
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  async register(data: { email: string; password: string; firstName: string; lastName: string; phone: string }): Promise<User> {
    await delay(1000);

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u: any) => u.email === data.email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: data.email,
      password: data.password, // storing plain text for mock only!
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      cars: [],
      createdAt: new Date().toISOString(),
      role: 'user' // Default role
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const safeUser = { ...newUser };
    // @ts-ignore
    delete safeUser.password;
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return safeUser as User;
  },

  /**
   * BACKEND LOGIC FOR GOOGLE AUTH
   * This processes the JWT token returned by Google
   */
  async handleGoogleCredential(credential: string): Promise<User> {
    await delay(500); // Simulate backend processing time

    const payload = parseJwt(credential);
    if (!payload) throw new Error("Invalid Token");

    const email = payload.email;
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    let user = users.find((u: any) => u.email === email);

    if (user) {
        // --- LOGIN EXISTING USER ---
        console.log("Logging in existing Google user:", email);
        // Update avatar if changed
        if (payload.picture && user.avatar !== payload.picture) {
            user.avatar = payload.picture;
            const idx = users.findIndex((u: any) => u.email === email);
            users[idx] = user;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    } else {
        // --- REGISTER NEW USER ---
        console.log("Registering new Google user:", email);
        user = {
            id: `google-${payload.sub || Date.now()}`,
            email: email,
            firstName: payload.given_name || 'Google User',
            lastName: payload.family_name || '',
            avatar: payload.picture || '',
            phone: '', // Google doesn't always provide phone, user can add later
            cars: [],
            createdAt: new Date().toISOString(),
            isGoogleAuth: true, // Marker for internal logic
            role: 'user'
        };
        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // Create session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  // Fallback for demo purposes if no Client ID is provided
  async mockGoogleLogin(): Promise<User> {
    await delay(1500);
    const mockGoogleUser = {
      id: `google-mock-${Date.now()}`,
      email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
      firstName: 'Google',
      lastName: 'User',
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      createdAt: new Date().toISOString(),
      cars: [],
      role: 'user'
    };
    
    // Check if exists logic for mock
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    let existing = users.find((u:any) => u.email === mockGoogleUser.email);
    if (!existing) {
        users.push(mockGoogleUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        existing = mockGoogleUser;
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existing));
    return existing as User;
  },

  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem(CURRENT_USER_KEY);
    // Also revoke google token if needed, but for simple auth just clearing local storage is enough
    if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
    }
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // --- USER DATA MANAGEMENT ---

  async updateUser(user: User): Promise<User> {
    await delay(500);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex((u: User) => u.id === user.id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...user }; // Merge updates
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]));
      return users[index];
    }
    // If it's the admin mock user, just update session
    if (user.role === 'admin') {
       localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
       return user;
    }
    throw new Error('Пользователь не найден');
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    await delay(600);
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    // Filter orders belonging to this user
    return allOrders.filter((o: Order) => o.userId === userId).sort((a: Order, b: Order) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  // --- ADMIN FUNCTIONS ---
  async getAllOrders(): Promise<Order[]> {
    await delay(600);
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return allOrders.sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
      await delay(400);
      const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const idx = allOrders.findIndex((o: Order) => o.id === orderId);
      if (idx !== -1) {
          allOrders[idx].status = status;
          localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
          return allOrders[idx];
      }
      throw new Error("Order not found");
  }
};

// Typescript declaration for window.google
declare global {
  interface Window {
    google: any;
  }
}