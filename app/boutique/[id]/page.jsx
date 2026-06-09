"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, Loader2 } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";

const listeproduits = [
  { id: "001", nom: "/samsung.jpg", description: "Samsung S21 Ultra", prix: "1300" },
  { id: "002", nom: "/iphone.jpg", description: "iPhone 17", prix: "800" },
  { id: "003", nom: "/huawei.jpg", description: "Huawei Super", prix: "200" },
  { id: "004", nom: "/google-pixel.jpg", description: "Google Pixel", prix: "400" },
  { id: "005", nom: "/ecran-apple.jpg", description: "Ecran apple", prix: "300" },
];

export default function DetailProduit() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // État de chargement du bouton
  const [errorMsg, setErrorMsg] = useState("");
  const params = useParams();
  const router = useRouter();
  
  const produitId = params.id;
  const produit = listeproduits.find((p) => p.id === produitId);

  const handleAddToBasket = async () => {
    if (!produit) return;
    
    setIsAdding(true);
    setErrorMsg("");
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMsg("Vous devez être connecté pour ajouter des articles.");
      setIsAdding(false);
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    try {
      const res = await fetch("/api/basket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          product_name: produit.nom.replace("/", ""), // On enlève le slash pour avoir un nom propre
          product_description: produit.description,
          product_image: produit.nom,
          price: produit.prix
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Succès : on ouvre la sidebar du panier
        setIsCartOpen(true);
      } else {
        setErrorMsg(data.message || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Impossible de joindre le serveur.");
    } finally {
      setIsAdding(false);
    }
  };

  if (!produit) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl font-bold text-black">Produit introuvable</h1>
          <button onClick={() => router.push("/")} className="font-medium hover:underline flex items-center gap-2 cursor-pointer">
            <ArrowLeft size={18} /> Retour à l'accueil
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="w-full min-h-screen text-black px-4 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto mb-8">
          <button
            onClick={() => router.back()} 
            className="flex items-center gap-2 font-medium text-gray-600 hover:text-black transition-colors cursor-pointer group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Retour aux produits
          </button>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full aspect-square bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center p-8 shadow-sm">
            <img src={produit.nom} alt={produit.description} className="rounded-2xl max-w-full max-h-full object-contain" />
          </div>

          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black mt-1 tracking-tight">{produit.description}</h1>
              <p className="text-2xl font-bold mt-4 font-mono text-blue-800">{parseInt(produit.prix).toLocaleString()} €</p>
            </div>

            <div className="border-b border-gray-100 w-full"></div>

            <div>
              <h2 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                {produit.description}. C'est un appareil sélectionné avec soin par notre équipe pour vous garantir une expérience utilisateur ultime.
              </p>
            </div>

            <div className="border-b border-gray-100 w-full"></div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <Truck size={18} className="text-emerald-600" />
                <span>Livraison express gratuite à domicile (24-48h)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span>Garantie constructeur de 2 ans incluse</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {errorMsg}
              </div>
            )}

            <div className="pt-4">
              <button 
                onClick={handleAddToBasket}
                disabled={isAdding}
                className="w-full sm:w-auto px-8 h-14 bg-black disabled:bg-gray-400 text-white font-bold rounded-2xl shadow-xl shadow-black/10 hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
              >
                {isAdding ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Ajouter au Panier
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        product={produit} 
      />

      <Footer />
    </>
  );
}