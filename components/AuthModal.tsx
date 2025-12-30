
import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User, Phone, LogIn, Chrome, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { authService, GOOGLE_CLIENT_ID } from '../services/authService';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

type AuthMode = 'login' | 'register';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Google Button Ref
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const initGoogle = () => {
        if (window.google && googleButtonRef.current) {
          try {
            window.google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: async (response: any) => {
                 setIsLoading(true);
                 try {
                    const user = await authService.handleGoogleCredential(response.credential);
                    onLoginSuccess(user);
                    onClose();
                 } catch (err) {
                    console.error(err);
                    setError('Ошибка авторизации Google.');
                 } finally {
                    setIsLoading(false);
                 }
              }
            });

            window.google.accounts.id.renderButton(
              googleButtonRef.current,
              { 
                  theme: 'filled_black', 
                  size: 'large', 
                  width: googleButtonRef.current.offsetWidth, 
                  text: 'signin_with',
                  shape: 'rectangular'
              } 
            );
          } catch (e) {
            console.warn("Google SDK error:", e);
          }
        }
      };
      initGoogle();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user;
      if (mode === 'login') {
        user = await authService.login(email, password);
      } else {
        if (!firstName || !phone) {
            throw new Error('Заполните обязательные поля');
        }
        user = await authService.register({ email, password, firstName, lastName, phone });
      }
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-xl font-black text-white italic uppercase tracking-tight">
            {mode === 'login' ? 'Вход в систему' : 'Регистрация'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div ref={googleButtonRef} className="w-full min-h-[40px] mb-8"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-zinc-800 flex-1" />
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Или Email</span>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Имя</label>
                   <div className="flex items-center bg-black border border-zinc-800 rounded-xl px-4 py-3">
                     <User size={16} className="text-zinc-600 mr-2" />
                     <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-transparent w-full text-white text-sm outline-none" placeholder="Иван" />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Фамилия</label>
                   <div className="flex items-center bg-black border border-zinc-800 rounded-xl px-4 py-3">
                     <User size={16} className="text-zinc-600 mr-2" />
                     <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="bg-transparent w-full text-white text-sm outline-none" placeholder="Иванов" />
                   </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Email</label>
              <div className="flex items-center bg-black border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-yellow-500/50 transition-colors">
                <Mail size={16} className="text-zinc-600 mr-2" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-transparent w-full text-white text-sm outline-none" 
                  placeholder="example@mail.com"
                  required 
                />
              </div>
            </div>

            {mode === 'register' && (
               <div className="space-y-1">
                 <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Телефон</label>
                 <div className="flex items-center bg-black border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-yellow-500/50 transition-colors">
                   <Phone size={16} className="text-zinc-600 mr-2" />
                   <input 
                     type="tel" 
                     value={phone}
                     onChange={e => setPhone(e.target.value)}
                     className="bg-transparent w-full text-white text-sm outline-none" 
                     placeholder="+380"
                     required 
                   />
                 </div>
               </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Пароль</label>
              <div className="flex items-center bg-black border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-yellow-500/50 transition-colors">
                <Lock size={16} className="text-zinc-600 mr-2" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-transparent w-full text-white text-sm outline-none" 
                  placeholder="••••••••" 
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest py-4 rounded-2xl mt-4 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-zinc-500 text-xs font-bold hover:text-white underline uppercase tracking-widest"
            >
              {mode === 'login' ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
