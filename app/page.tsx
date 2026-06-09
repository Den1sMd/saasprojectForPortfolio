import Image from "next/image";
import Header from "@/components/Header";
import { ShoppingBasket, ChevronUp, Eye, ShoppingCart, CheckCheck, Quote } from 'lucide-react';
import React from "react";
import Footer from "@/components/Footer";

export default function Home() {

  const listeproduits = [
    {
      id: "001",
      nom: "MacBook Pro",
      description: "Dernier MacBook doté d'un processeur surpuissant M4."
    },
    {
      id: "002",
      nom: "iPhone 17",
      description: "L'écran le plus lumineux et un appareil photo révolutionnaire."
    },
    {
      id: "003",
      nom: "AirPods Max",
      description: "Une immersion sonore totale avec réduction de bruit active."
    },
    {
      id: "004",
      nom: "Samsung S27",
      description: "Très bel écran la meilleure marque !"
    }
  ];

  const reasons = [
    {
      icon: Eye,
      titre: "Visitez",
      desc: "Visiter notre site vous allez trouver votre bonheur !"
    },
    {
      icon: ShoppingCart,
      titre: "Acheter",
      desc: "Acheter en toute sécurité et en sérénité !"
    },
    {
      icon: CheckCheck,
      titre: "Recevez",
      desc: "Recevez votre produit directement chez vous ou en point relais partenaire !"
    }
  ];

  return (
    <>
      <Header />

      <main className="w-full overflow-x-hidden">
        
        <div className="flex mt-12 md:mt-25 justify-center flex-col items-center px-4 sm:px-6 md:px-8">
          
          
          <div className="flex justify-center items-center flex-col gap-4 text-center">
            <h1 className="text-black text-3xl sm:text-5xl italic">Votre boutique High-Tech Trouvez vos produits préférés dès maintenant !</h1>
            <p className="text-black text-3xl sm:text-5xl font-semibold">Acheter en 1 clic.</p>
          </div>

          
          <div className="w-full max-w-xl mt-10 md:mt-20 px-2">
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
                placeholder="Un macbook, des chaussures, un téléphone..." 
                required
              />
              <button 
                type="submit" 
                className="cursor-pointer absolute end-2 top-2 bottom-2 text-white bg-black font-semibold hover:bg-amber-100 hover:text-black transition-all duration-200 focus:ring-4 rounded-lg text-xs sm:text-sm px-3 sm:px-5"
              >
                Rechercher
              </button>
            </div>
          </div>

         
          <div className="mt-10 flex flex-col sm:flex-row gap-5 sm:gap-10 w-full sm:w-auto items-center">
            <div className="flex justify-center items-center relative group w-full sm:w-auto">
              <span className="hidden sm:inline text-white absolute mr-32 cursor-pointer z-10 group-hover:text-sky-400">•</span>
              <button className="bg-black text-sm w-full sm:w-40 h-10 text-white cursor-pointer transition-all shadow-2xl shadow-black group-hover:rounded-3xl group-hover:scale-102 font-serif italic duration-200">Créer un compte</button>
            </div>
            <div className="flex justify-center items-center relative group w-full sm:w-auto">
              <span className="hidden sm:inline text-white absolute mr-32 cursor-pointer z-10 group-hover:text-amber-100">•</span>
              <a href="#info">
                <button className="bg-black text-sm w-full sm:w-40 h-10 text-white cursor-pointer transition-all shadow-2xl shadow-black group-hover:rounded-3xl group-hover:scale-102 font-serif italic duration-200">En savoir plus...</button>
              </a>
            </div>
          </div>

          
          <div className="flex mt-32 md:mt-60 flex-col text-center md:text-left max-w-4xl w-full">
            <h2 className="text-black text-2xl sm:text-4xl md:text-5xl">Apple et Samsung <span className="font-bold">au même endroit.</span></h2>
            <div className="border-b-2 border-gray-200 mt-4 w-full"></div>
          </div>

          
          <div className="flex flex-col lg:flex-row mt-12 md:mt-20 gap-10 lg:gap-20 w-full max-w-6xl items-center lg:items-start">
            
           
            <div className="relative w-full max-w-[600px] aspect-[15/10] overflow-hidden rounded-2xl shadow-md">
              <img
                className="w-full h-full object-cover" 
                src="/sky-image.jpg"
                alt="Sky background"
              />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex bg-white/95 backdrop-blur-sm justify-between w-[280px] sm:w-[320px] h-[120px] sm:h-[140px] rounded-2xl shadow-2xl flex-col p-4">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-black font-semibold text-base sm:text-lg">Produits vendus</h3>
                  <ShoppingBasket className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex justify-between items-end w-full">
                  <p className="text-black font-bold text-2xl sm:text-3xl">2 004</p>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg">
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
                    <span className="font-bold text-xs sm:text-sm text-sky-500">20.04%</span>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="flex flex-col w-full lg:flex-1 max-w-[500px]">
              {listeproduits.map((produit) => (
                <div 
                  key={produit.id} 
                  className="flex flex-col border-b border-gray-200 last:border-b-0 py-4 px-2"
                >
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-black font-bold text-lg sm:text-xl font-mono">
                      {produit.nom}
                    </h3>
                    <h3 className="text-gray-400 font-bold text-xs sm:text-sm font-mono">
                      #{produit.id}
                    </h3>
                  </div>
                  <h3 className="text-gray-600 mt-2 text-xs sm:text-sm leading-relaxed">
                    {produit.description}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          
          <div className="flex mt-32 md:mt-50 w-full max-w-6xl relative rounded-3xl overflow-hidden min-h-[600px] md:min-h-[450px]">
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src="magicpattern.jpg"
              alt="Pattern background"
            />
            
            
            <div className="relative z-10 flex flex-col w-full p-6 sm:p-10 justify-center items-center">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-black text-2xl sm:text-4xl italic font-semibold">
                  Acheter en toute <span className="font-bold text-blue-800">sécurité.</span>
                </h2>
              </div>

              
              <div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {reasons.map((reas) => (
                  <div
                    id="info"
                    key={reas.titre}
                    className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col gap-4 hover:translate-y-[-4px] transition-transform duration-200"
                  >
                    <reas.icon className="text-black w-6 h-6" />
                    <div className="flex flex-col gap-2">
                      <p className="text-black font-bold text-lg">{reas.titre}</p>
                      <p className="text-gray-800 font-medium font-serif text-sm leading-snug">{reas.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
          <div className="mt-32 md:mt-50 flex w-full max-w-5xl items-center justify-center">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full">
              
              
              <div className="w-full md:w-1/2 max-w-[450px]">
                <Image
              className="w-full h-[350px] md:h-[500px] object-cover rounded-2xl shadow-xl"
              src="/homme-souriant.jpg"
              alt="Avis client positif sur notre boutique high-tech - Julien Dupont"
              width={450}
              height={500}
              />
              </div>

              
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left px-4">
                <Quote className="text-gray-400 w-10 h-10 mb-6" />
                <p className="text-black text-xl sm:text-2xl font-semibold italic max-w-md leading-relaxed">
                  "J'utilise ce site depuis très longtemps maintenant et je n'ai jamais eu le moindre problème. Je recommande les yeux fermés !"
                </p>
                <div className="mt-6">
                  <h3 className="text-xl sm:text-2xl text-black italic font-bold">Julien Dupont</h3>
                </div>
              </div>

            </div>
          </div>

        </div>

        
        <Footer></Footer>
      </main>
    </>
  );
}