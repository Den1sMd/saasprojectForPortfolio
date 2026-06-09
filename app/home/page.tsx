"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  const listeproduits = [
    { id: "001", nom: "samsung.jpg", description: "Samsung S21 Ultra", prix: "1300" },
    { id: "002", nom: "iphone.jpg", description: "iPhone 17", prix: "800" },
    { id: "003", nom: "huawei.jpg", description: "Huawei Super", prix: "200" },
    { id: "004", nom: "google-pixel.jpg", description: "Google Pixel", prix: "400" },
    { id: "005", nom: "ecran-apple.jpg", description: "Ecran apple", prix: "300" },
  ];

  const images = [
    "iphone-image.jpg",
    "google-pixel.jpg",
    "ecran-apple.jpg"
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);


  const filteredProducts = listeproduits.filter((product) =>
    product.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDirections = (direction: 'prev' | 'next') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-16">
        
        
        <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg group">
          <img
            className={`rounded-3xl object-cover w-full h-full transition-all duration-300 ease-in-out ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            src={images[currentIndex]}
            alt={`Promotion ${currentIndex + 1}`}
          />
          
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => handleDirections('prev')}
              className="cursor-pointer w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md transition-all backdrop-blur-sm">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => handleDirections('next')}
              className="cursor-pointer w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md transition-all backdrop-blur-sm">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

     
        <div className="flex flex-col justify-center items-center mt-20">
          <h1 className="text-black text-4xl sm:text-6xl italic font-semibold text-center">
            Chercher un produit dès maintenant !
          </h1>

          <div className="w-full max-w-xl mt-10 px-2">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                id="search"
                className="block w-full p-4 ps-12 bg-white/95 border border-gray-200 text-gray-900 text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-lg placeholder:text-gray-400" 
                placeholder="Un macbook, un téléphone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        
        {searchQuery.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl text-gray-600 font-medium mb-6">
              Résultats de recherche pour <span className="text-black font-bold">"{searchQuery}"</span>
            </h2>

            {filteredProducts.length === 0 ? (
             
              <div className="text-center py-12 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <p className="text-gray-500 font-medium text-lg">Aucun résultat trouvé.</p>
                <p className="text-sm text-gray-400 mt-1">Vérifiez l'orthographe ou essayez un autre mot-clé.</p>
              </div>
            ) : (
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <Link
                    href={`/boutique/${prod.id}`}
                    key={prod.id}
                    className="bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-full h-32 sm:h-40 overflow-hidden bg-gray-100">
                      <img className="object-cover w-full h-full" src={prod.nom} alt={prod.description} />
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                      <h3 className="text-gray-800 text-xs sm:text-sm font-semibold line-clamp-2 min-h-[2.5rem]">
                        {prod.description}
                      </h3>
                      <p className="text-sky-600 font-bold text-base sm:text-lg mt-2">
                        {parseInt(prod.prix).toLocaleString()} €
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          
          <div className="mt-12">
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl text-gray-600 font-medium">
                Nos meilleures offres en ce <span className="text-sky-500 font-bold">moment !</span>
              </h2>
              <div className="border-b-4 border-sky-500 w-20 mt-2 rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-center">
              {listeproduits.map((prod) => (
                <Link
                  href={`/boutique/${prod.id}`}
                  key={prod.id}
                  className="bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-full h-32 sm:h-40 overflow-hidden bg-gray-100">
                    <img className="object-cover w-full h-full" src={prod.nom} alt={prod.description} />
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                    <h3 className="text-gray-800 text-xs sm:text-sm font-semibold line-clamp-2 min-h-[2.5rem]">
                      {prod.description}
                    </h3>
                    <p className="text-sky-600 font-bold text-base sm:text-lg mt-2">
                      {parseInt(prod.prix).toLocaleString()} €
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}