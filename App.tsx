
import React, { useState, useEffect, useTransition, Suspense, lazy, useMemo, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Shop from './components/Shop';
import ProgressBar from './components/ProgressBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import MobileSearchModal from './components/MobileSearchModal';
import CartDrawer from './components/CartDrawer';
import FloatingContacts from './components/FloatingContacts'; 
import { useLanguage } from './contexts/LanguageContext';
import { authService } from './services/authService';
import { orderService } from './services/orderService';
import { cartService } from './services/cartService';
import { Product, CartItem, User, ViewType, FilterState, CustomerDetails } from './types';

// Lazy Components
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const Checkout = lazy(() => import('./components/Checkout'));
const UserCabinet = lazy(() => import('./components/UserCabinet'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const ThankYou = lazy(() => import('./components/ThankYou'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const VirtualMechanic = lazy(() => import('./components/VirtualMechanic'));
const Promotions = lazy(() => import('./components/Promotions'));
const VinDecoder = lazy(() => import('./components/VinDecoder'));
const AboutBrand = lazy(() => import('./components/AboutBrand'));
const GoogleReviews = lazy(() => import('./components/GoogleReviews'));
const SocialReviews = lazy(() => import('./components/SocialReviews'));
const SeoBlock = lazy(() => import('./components/SeoBlock'));
const HomeSeoContent = lazy(() => import('./components/HomeSeoContent'));
const FAQ = lazy(() => import('./components/FAQ'));
const OneClickOrderModal = lazy(() => import('./components/OneClickOrderModal'));
const SaleGrid = lazy(() => import('./components/SaleGrid'));

const Blog = lazy(() => import('./components/StaticPages').then(m => ({ default: m.Blog })));
const Warranty = lazy(() => import('./components/StaticPages').then(m => ({ default: m.Warranty })));
const Delivery = lazy(() => import('./components/StaticPages').then(m => ({ default: m.Delivery })));
const Contacts = lazy(() => import('./components/StaticPages').then(m => ({ default: m.Contacts })));
const Wholesale = lazy(() => import('./components/StaticPages').then(m => ({ default: m.Wholesale })));
const Sitemap = lazy(() => import('./components/StaticPages').then(m => ({ default: m.Sitemap })));
const AboutUs = lazy(() => import('./components/StaticPages').then(m => ({ default: m.AboutUs })));
const NotFound = lazy(() => import('./components/NotFound'));

const SectionLoader = () => (
  <div className="py-20 flex items-center justify-center bg-black">
    <div className="w-8 h-8 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
  </div>
);

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-black">
    <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  const { products, categories, language } = useLanguage();
  const [isPending, startTransition] = useTransition();
  
  const [view, setView] = useState<ViewType>('shop');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bardahl_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthRestoring, setIsAuthRestoring] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [initialShopFilters, setInitialShopFilters] = useState<Partial<FilterState>>({});

  const [isOneClickModalOpen, setIsOneClickModalOpen] = useState(false);
  const [oneClickProduct, setOneClickProduct] = useState<Product | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | undefined>(undefined);
  
  const [isMechanicOpen, setIsMechanicOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isVirtualMechanicLoaded, setIsVirtualMechanicLoaded] = useState(false);

  // Tracking abandonment
  const checkoutStartedRef = useRef(false);
  const guestDetailsRef = useRef<CustomerDetails | null>(null);

  // Sync cart for logged in user
  useEffect(() => {
    if (user && cart.length > 0) {
      cartService.syncCart(user.email, cart, user);
    }
  }, [cart, user]);

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setIsAuthRestoring(false);
      if ((window as any).finishLoading) (window as any).finishLoading();
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('bardahl_cart', JSON.stringify(cart));
  }, [cart]);

  // Handle BeforeUnload to trigger abandonment notification
  useEffect(() => {
    const handleUnload = () => {
      if (checkoutStartedRef.current && cart.length > 0) {
        const email = user?.email || guestDetailsRef.current?.email;
        const name = user ? `${user.firstName}` : guestDetailsRef.current?.firstName;
        const phone = user?.phone || guestDetailsRef.current?.phone;
        
        if (email) {
           cartService.triggerAbandonment(email, cart, name, phone);
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [cart, user]);

  const toggleMechanic = () => {
    if (!isVirtualMechanicLoaded) setIsVirtualMechanicLoaded(true);
    setIsMechanicOpen(!isMechanicOpen);
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.volume === product.volume);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.volume === product.volume) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string, volume?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.volume === volume)));
  };

  const handleUpdateCartQty = (id: string, delta: number, volume?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.volume === volume) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    checkoutStartedRef.current = true;
    startTransition(() => {
      setSelectedProduct(null);
      setView('checkout');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (details: CustomerDetails) => {
    const newOrder = {
      id: `ord-${Date.now()}`,
      userId: user?.id,
      date: new Date().toISOString(),
      items: cart,
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      customer: details,
      status: 'pending' as const
    };
    await orderService.create(newOrder);
    
    // Clear cart and mark as converted
    const email = user?.email || details.email;
    if (email) cartService.markAsConverted(email);
    
    checkoutStartedRef.current = false;
    setCart([]);
    setLastOrderId(newOrder.id);
    startTransition(() => setView('thank-you'));
  };

  const handleOneClickBuy = (product: Product) => {
    setOneClickProduct(product);
    setIsOneClickModalOpen(true);
  };

  const handleSubmitOneClick = async (name: string, phone: string) => {
    if (!oneClickProduct) return;
    const details: CustomerDetails = { firstName: name, lastName: '', phone: phone, email: '', city: '', deliveryMethod: 'courier', paymentMethod: 'cod', comment: `Заказ в 1 клик` };
    const newOrder = { 
      id: `fast-${Date.now()}`, 
      userId: user?.id, 
      date: new Date().toISOString(), 
      items: [{ ...oneClickProduct, quantity: 1 }], 
      total: oneClickProduct.price, 
      customer: details, 
      status: 'pending' as const 
    };
    await orderService.create(newOrder);
    setIsOneClickModalOpen(false);
    setOneClickProduct(null);
    setLastOrderId(newOrder.id);
    startTransition(() => setView('thank-you'));
  };

  const handleLoginSuccess = (u: User) => {
    setUser(u);
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    startTransition(() => setView('shop'));
  };

  const handleGoHome = () => {
    startTransition(() => {
      setView('shop');
      setActiveCategory('all');
      setSearchQuery('');
      setSelectedProduct(null);
      setInitialShopFilters({});
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    startTransition(() => {
      setSearchQuery(query);
      setActiveCategory('all');
      setSelectedProduct(null);
      setView('shop');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (id: string) => {
    startTransition(() => {
      setActiveCategory(id);
      setSearchQuery('');
      setSelectedProduct(null);
      setView('shop');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageNavigate = (page: ViewType) => {
     startTransition(() => {
       setView(page);
       setSelectedProduct(null);
     });
     window.scrollTo(0, 0);
  };

  const handleProductSelect = (p: Product) => {
    startTransition(() => {
      setSelectedProduct(p);
    });
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    if (selectedProduct) {
      return (
        <ProductDetail 
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onProductSelect={handleProductSelect}
          onOneClickBuy={handleOneClickBuy}
          onBack={() => startTransition(() => setSelectedProduct(null))}
          onGoHome={handleGoHome}
        />
      );
    }

    switch (view) {
      case 'checkout': return <Checkout items={cart} total={cart.reduce((sum, i) => sum + i.price * i.quantity, 0)} onPlaceOrder={handlePlaceOrder} onBack={() => startTransition(() => setView('shop'))} onGuestUpdate={(d) => guestDetailsRef.current = d} />;
      case 'thank-you': return <ThankYou orderId={lastOrderId} onNavigate={(target) => handlePageNavigate(target)} onGoHome={handleGoHome} isLoggedIn={!!user} />;
      case 'cabinet': return user ? <UserCabinet user={user} onLogout={handleLogout} onNavigate={handlePageNavigate} onUserUpdate={setUser} onAddToCart={handleAddToCart} /> : <NotFound onNavigate={handlePageNavigate} onGoHome={handleGoHome} />;
      case 'shop':
        return (
          <>
            {activeCategory === 'all' && !searchQuery && (
                <>
                  <Hero onFilter={(c) => {
                      startTransition(() => {
                          setActiveCategory(c.type);
                          setInitialShopFilters({ viscosities: c.viscosities, approvals: c.approvals });
                          setView('shop');
                      });
                  }} onCarSelect={() => {}} />
                  <Features />
                  
                  <Suspense fallback={<SectionLoader />}>
                     <SaleGrid 
                        products={products} 
                        onAddToCart={handleAddToCart} 
                        onProductClick={handleProductSelect} 
                        onOneClickBuy={handleOneClickBuy} 
                     />
                  </Suspense>
                </>
            )}
            <div id="shop-section">
              <Shop 
                 products={products} 
                 initialCategory={activeCategory} 
                 initialFilters={initialShopFilters} 
                 searchQuery={searchQuery} 
                 onAddToCart={handleAddToCart} 
                 onProductClick={handleProductSelect} 
                 onOneClickBuy={handleOneClickBuy} 
                 onClearSearch={() => setSearchQuery('')} 
                 onCategoryChange={handleCategorySelect} 
                 onGoHome={handleGoHome}
              />
            </div>
            {activeCategory === 'all' && !searchQuery && (
              <Suspense fallback={<SectionLoader />}>
                <Promotions onNavigate={() => handlePageNavigate('promotions')} />
                <VinDecoder />
                <GoogleReviews />
                <SocialReviews />
                <AboutBrand />
                <FAQ />
                <HomeSeoContent />
              </Suspense>
            )}
          </>
        );
      case 'about-us': return <AboutUs onGoHome={handleGoHome} />;
      case 'blog': return <Blog onGoHome={handleGoHome} />;
      case 'warranty': return <Warranty onGoHome={handleGoHome} />;
      case 'delivery': return <Delivery onGoHome={handleGoHome} />;
      case 'contacts': return <Contacts onGoHome={handleGoHome} />;
      case 'wholesale': return <Wholesale onGoHome={handleGoHome} />;
      case 'sitemap': return <Sitemap onNavigate={handlePageNavigate} onCategorySelect={handleCategorySelect} onGoHome={handleGoHome} />;
      case 'admin': return user?.role === 'admin' ? <AdminPanel user={user} onLogout={handleLogout} /> : <NotFound onNavigate={handlePageNavigate} onGoHome={handleGoHome} />;
      default: return <NotFound onNavigate={handlePageNavigate} onGoHome={handleGoHome} />;
    }
  };

  return (
    <>
      <ProgressBar isPending={isPending} />
      <Header 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={handleSearch}
        onOpenMobileSearch={() => setIsMobileSearchOpen(true)}
        onProductSelect={handleProductSelect}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        onNavigate={handlePageNavigate}
        onGoHome={handleGoHome}
        user={user}
        onAuthAction={() => user ? handlePageNavigate('cabinet') : setIsAuthModalOpen(true)}
      />

      <main className={`pb-20 md:pb-0 transition-opacity duration-300 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
        {isAuthRestoring ? <LoadingFallback /> : (
          <Suspense fallback={<LoadingFallback />}>
            {renderView()}
          </Suspense>
        )}
      </main>

      <Suspense fallback={null}>
        <SeoBlock onSeoSelect={(target) => {
              if (target.productId) {
                  const p = products.find(x => x.id === target.productId);
                  if (p) handleProductSelect(p);
              } else if (target.articleId) {
                  // If it's an article ID, navigate to blog or static page
                  startTransition(() => {
                    setView('blog');
                    setSelectedProduct(null);
                  });
              } else {
                  startTransition(() => {
                    if (target.category) setActiveCategory(target.category);
                    if (target.searchQuery) setSearchQuery(target.searchQuery);
                    if (target.filters) setInitialShopFilters(target.filters);
                    else setInitialShopFilters({});
                    setSelectedProduct(null);
                    setView('shop');
                  });
                  window.scrollTo(0,0);
              }
          }} 
        />
      </Suspense>

      <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cart} 
          onRemove={(id, v) => handleRemoveFromCart(id, v)} 
          onUpdateQty={(id, d, v) => handleUpdateCartQty(id, d, v)} 
          onCheckout={handleCheckout} 
          onGoToCatalog={() => { setIsCartOpen(false); handleGoHome(); }} 
      />
      
      <Suspense fallback={null}>
        {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
        {isVirtualMechanicLoaded && <VirtualMechanic isOpen={isMechanicOpen} onOpen={() => setIsMechanicOpen(true)} onClose={() => setIsMechanicOpen(false)} />}
        <MobileSearchModal isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} products={products} onSearch={handleSearch} onProductSelect={handleProductSelect} onCategorySelect={handleCategorySelect} />
        <OneClickOrderModal isOpen={isOneClickModalOpen} onClose={() => setIsOneClickModalOpen(false)} product={oneClickProduct} onSubmit={handleSubmitOneClick} />
      </Suspense>
      
      <MobileBottomNav onNavigate={handlePageNavigate} onSearchClick={() => setIsMobileSearchOpen(true)} onCartClick={() => setIsCartOpen(true)} onProfileClick={() => user ? handlePageNavigate('cabinet') : setIsAuthModalOpen(true)} onChatClick={toggleMechanic} cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />
      
      <FloatingContacts />
    </>
  );
};

export default App;
