"use client";

import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";


interface BasketItem {
  id: number;
  product_name: string;
  product_description: string | null;
  product_image: string | null;
  price: string;
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBasket = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/basket", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBasketItems(data.basket || []);
      }
    } catch (err) {
      console.error("Erreur chargement panier :", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBasket();
    }
  }, [isOpen]);

  // Gère la modification des quantités (+ ou -) directement en BDD
  const handleUpdateQuantity = async (productName: string, currentQty: number, action: 'increment' | 'decrement') => {
    const token = localStorage.getItem("token");
    if (!token) return;

    
    const newQty = action === 'increment' ? currentQty + 1 : currentQty - 1;

    
    setBasketItems((prev) =>
      prev
        .map((item) => (item.product_name === productName ? { ...item, quantity: newQty } : item))
        .filter((item) => item.quantity > 0)
    );

    try {
      await fetch("/api/basket/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ product_name: productName, action }),
      });
    } catch (err) {
      console.error("Erreur modification quantité :", err);
      fetchBasket();
    }
  };

  
  const totalCartAmount = basketItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (basketItems.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage("");
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Vous devez être connecté pour passer une commande.");
      setIsSubmitting(false);
      setTimeout(() => { router.push("/login"); }, 2000);
      return;
    }

    try {
      
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: basketItems,
          total_amount: totalCartAmount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderSuccess(true);
        setBasketItems([]);
        router.refresh();
      } else {
        setErrorMessage(data.message || "Une erreur est survenue lors de la commande.");
      }
    } catch (err) {
      console.error("Erreur checkout :", err);
      setErrorMessage("Impossible de joindre le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOrderSuccess(false);
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={handleClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-black" />
              <h2 className="text-xl font-black tracking-tight text-black">Votre Panier</h2>
            </div>
            <button onClick={handleClose} className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
              <X size={20} />
            </button>
          </div>

         
          <div className="flex-1 p-6 overflow-y-autoà">
            {orderSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 p-4">
                <CheckCircle2 size={56} className="text-emerald-500 animate-bounce" />
                <h3 className="text-xl font-black text-black">Commande reçue !</h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Votre achat a bien été enregistré. Notre équipe s'occupe de la préparation de votre colis.
                </p>
                <button onClick={handleClose} className="mt-4 px-6 py-2 border border-gray-200 bg-amber-400 hover:bg-amber-500 rounded-xl text-sm font-bold transition-colors cursor-pointer">
                  Continuer mes achats
                </button>
              </div>
            ) : isLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-black w-8 h-8" />
                <p className="text-xs text-gray-400">Synchronisation avec votre panier...</p>
              </div>
            ) : basketItems.length > 0 ? (
              <div className="space-y-4">
                {basketItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <div className="w-20 h-20 bg-white border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-2 shrink-0">
                      <img src={item.product_image || "/placeholder.jpg"} alt={item.product_description || ""} className="max-w-full max-h-full object-contain" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-black text-sm leading-snug">{item.product_description}</h3>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">Recevez le en moins de 24h si vous commandez avant 00h !</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-bold font-mono text-blue-800 text-sm sm:text-base">
                          {(parseFloat(item.price) * item.quantity).toLocaleString()} €
                        </p>
                        
                        
                        <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg p-1 shadow-sm">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.product_name, item.quantity, 'decrement')}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 text-black font-bold rounded-md transition-colors cursor-pointer text-xs"
                          >
                            {item.quantity === 1 ? <Trash2 size={12} className="text-red-500" /> : "-"}
                          </button>
                          
                          <span className="text-xs font-mono font-bold text-gray-800 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.product_name, item.quantity, 'increment')}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 text-black font-bold rounded-md transition-colors cursor-pointer text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">
                    {errorMessage}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                <span className="text-4xl">🛒</span>
                <p className="text-gray-500 font-medium">Votre panier en ligne est vide.</p>
              </div>
            )}
          </div>

          
          {!orderSuccess && basketItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white space-y-4">
              <div className="flex items-center justify-between text-base font-medium text-gray-900">
                <p className="text-gray-500 font-semibold">Sous-total</p>
                <p className="font-mono font-black text-xl text-black">{totalCartAmount.toLocaleString()} €</p>
              </div>
              <p className="text-xs text-gray-400">Taxes incluses. Livraison calculée lors de la validation.</p>
              <div className="pt-2">
                <button 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full h-12 bg-black disabled:bg-gray-400 text-white font-bold rounded-xl shadow-xl shadow-black/10 hover:bg-slate-800 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Validation de la commande...
                    </>
                  ) : (
                    "Valider la commande"
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}