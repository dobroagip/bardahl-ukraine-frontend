import { User } from '../types';
import { supabase } from './supabase';

export const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

export const authService = {
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getProfile(session.user.id, session.user.email!);
        callback(profile);
      } else {
        callback(null);
      }
    });

    return { data: { subscription } };
  },

  async handleGoogleCredential(credential: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credential,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Ошибка авторизации через Google");

    return this.getProfile(data.user.id, data.user.email!);
  },

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        throw new Error(error.message.includes('Invalid login credentials') 
          ? 'Неверный email или пароль' 
          : error.message);
    }
    
    if (!data.user) throw new Error("Пользователь не найден");
    return this.getProfile(data.user.id, data.user.email!);
  },

  async register(data: { email: string; password: string; firstName: string; lastName: string; phone: string }): Promise<User> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { 
        data: { 
          first_name: data.firstName, 
          last_name: data.lastName, 
          phone: data.phone 
        } 
      }
    });

    if (error) throw new Error(error.message);
    if (!authData.user) throw new Error("Ошибка регистрации");

    const newUser: User = {
      id: authData.user.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      role: 'user'
    };

    await this.updateProfile(newUser);
    return newUser;
  },

  async getProfile(id: string, email: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return {
          id,
          email,
          firstName: 'User',
          role: 'user',
          createdAt: new Date().toISOString()
        };
      }

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        avatar: data.avatar_url,
        cars: data.cars || [],
        defaultShipping: data.default_shipping,
        role: data.role || 'user',
        createdAt: data.created_at
      };
    } catch (e) {
      return { id, email, firstName: 'User', role: 'user', createdAt: new Date().toISOString() };
    }
  },

  async updateProfile(user: Partial<User> & { id: string }): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone,
        role: user.role
      });
    if (error) console.error("Profile sync error:", error.message);
  },

  async updateUser(user: User): Promise<User> {
    await this.updateProfile(user);
    return user;
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
};