import Head from "next/head";
import Image from "next/image";

export default function Footer() {
    return(
        <>
        
        <footer className="mt-32 md:mt-40 bg-yellow-300 w-full pt-10 pb-6 px-4 sm:px-10 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-yellow-400 pb-6">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <a href="/compte" className="text-gray-800 font-semibold cursor-pointer hover:text-black text-sm sm:text-base">Produits</a>
                <a href="/home" className="text-gray-800 font-semibold cursor-pointer hover:text-black text-sm sm:text-base">Accueil</a>
                <a href="/compte" className="text-gray-800 font-semibold cursor-pointer hover:text-black text-sm sm:text-base">Mon compte</a>
                <a href="/login" className="text-gray-800 font-semibold cursor-pointer hover:text-black text-sm sm:text-base">Connexion</a>
                <a className="text-gray-800 font-semibold cursor-pointer hover:text-black text-sm sm:text-base">En savoir plus...</a>
              </div>

              <div className="text-center md:text-right">
                <p className="text-gray-600 font-semibold text-sm">
                  <span className="font-normal">© 2026</span> · All rights reserved Denis
                </p>
              </div>
            </div>

            
            <div className="flex w-full justify-center items-center flex-col opacity-40 select-none pointer-events-none"> 
              <img 
                className="object-cover w-full max-w-[960px] h-20 sm:h-32 rounded-lg"
                src="/imagejaune-footer.jpg" 
                alt="Footer illustration"
              />
              <h2 className="text-[60px] sm:text-[120px] md:text-[180px] font-bold italic text-gray-800 leading-none mt-2">
                Denis
              </h2>
            </div>
          </div>
        </footer>
        
        </>
    )
}