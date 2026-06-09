"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react"; 
import CartSidebar from "@/components/CartSidebar";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panierCount, setPanierCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

 
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      const fetchUserProfile = async () => {
        try {
          const res = await fetch("/api/basket", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            const totalArticles = data.basket.reduce((acc, item) => acc + item.quantity, 0);
          
          setPanierCount(totalArticles);
          }
        } catch (err) {
          console.error("Erreur récupération du compteur panier:", err);
        }
      };

      fetchUserProfile();
    }
  }, [isCartOpen]);


  const handleLogout = async () => {
  try {
  
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (err) {
    console.error("Erreur appel API logout:", err);
  }

 
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  setIsLoggedIn(false);
  setIsOpen(false);
  
  router.push("/");
  router.refresh();
};

  if (!mounted) {
      return (
        <header className="relative flex flex-row items-center justify-between w-full h-20 md:h-30 px-4 sm:px-8 border-b border-gray-100 backdrop-blur-md z-50">
         
          <div className="flex items-center">
            <span className="text-sm">Chargement...</span>
          </div>
        </header>
      );
    }

  return (
    <>
      <header className="relative flex flex-row items-center justify-between w-full h-20 md:h-30 px-4 sm:px-8 border-b border-gray-100 backdrop-blur-md z-50">
        
        
        <div className="flex items-center">
          <Image
            className="w-16 h-16 md:w-25 md:h-25 object-contain"
            src="/logo.png"
            alt="Logo"
            width={105}
            height={25}
            priority
          />
        </div>

        
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="relative text-black font-bold text-xl group py-1">
            Accueil
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 ease-out group-hover:w-full" />
          </a>
          <a href="/home" className="relative text-black font-bold text-xl group py-1">
            Boutique
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 ease-out group-hover:w-full" />
          </a>
          <a href="/faq" className="relative text-black font-bold text-xl group py-1">
            Faq
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 ease-out group-hover:w-full" />
          </a>

      
          {isLoggedIn ? (
            <>
              <a href="/compte" className="relative text-black font-bold text-xl group py-1">
                <User size={20} />
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 ease-out group-hover:w-full" />
              </a>
              <button 
                onClick={handleLogout} 
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-lg transition-colors cursor-pointer"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <a href="/login" className="relative text-black font-bold text-xl group py-1">
              Connexion
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          )}

          
          <button 
          onClick={() => setIsCartOpen(true)}
          className="inline-flex items-center gap-2 bg-black px-5 py-2.5 rounded-full shadow-md text-white font-semibold text-sm tracking-wide transition-all duration-300 ease-out hover:-translate-y-1 hover:rotate-2 hover:bg-slate-800 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer">
            <span className="text-white">🛒</span>
            <span className="text-white">Panier</span>
            <span className="ml-1 text-white bg-gray-800 px-2 py-0.5 rounded-full font-bold text-xs">
              {panierCount}
            </span>
          </button>
        </nav>

        
        <div className="flex items-center gap-4 md:hidden">
          
          <a href="#" className="relative p-2 bg-black text-white rounded-full">
            <span className="text-sm">🛒</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {panierCount}
            </span>
          </a>

         
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-black focus:outline-none p-1 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div className={`absolute top-full left-0 w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out md:hidden overflow-hidden ${isOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
          <nav className="flex flex-col p-6 gap-4 items-center text-center">
            <a href="/" onClick={() => setIsOpen(false)} className="text-black font-bold text-lg w-full py-2 hover:bg-gray-50 rounded-lg">Accueil</a>
            <a href="/home" onClick={() => setIsOpen(false)} className="text-black font-bold text-lg w-full py-2 hover:bg-gray-50 rounded-lg">Boutique</a>
            <a href="/faq" onClick={() => setIsOpen(false)} className="text-black font-bold text-lg w-full py-2 hover:bg-gray-50 rounded-lg">Faq</a>
            
            {isLoggedIn ? (
              <>
                <a href="/home" onClick={() => setIsOpen(false)} className="inline-flex items-center gap-2 text-black font-bold text-lg w-full py-2 justify-center hover:bg-gray-50 rounded-lg">
                  <User size={20} />
                  Mon Compte
                </a>
                <button 
                  onClick={handleLogout} 
                  className="inline-flex items-center gap-2 text-red-600 font-bold text-lg w-full py-2 justify-center hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </>
            ) : (
              <a href="/login" onClick={() => setIsOpen(false)} className="text-black font-bold text-lg w-full py-2 hover:bg-gray-50 rounded-lg">Connexion</a>
            )}
          </nav>
        </div>

        

      </header>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        product={null} 
      />
    </>
  );
}