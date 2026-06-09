"use client"

import { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function ForgotPassword() {



  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/home")
    }
  }, [])

  return (
    <>
      <div className="w-screen h-screen bg-white justify-center items-center flex overflow-hidden font-sans">
        <div className="flex w-full h-full justify-between items-center">
          
         
          <div className="flex-1 flex justify-center items-center px-10">
            <div className="w-full max-w-[400px] space-y-8">
              
              
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors font-bold text-sm cursor-pointer group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Retour à la connexion
              </button>

              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                  Mot de passe oublié ?
                </h2>
                <p className="text-slate-500 mt-2 font-medium">
                  {isSubmitted 
                    ? "Si un compte existe pour cet email, vous recevrez un lien sous peu." 
                    : "Entrez votre email pour recevoir un lien de réinitialisation."}
                </p>
              </div>

              {!isSubmitted ? (
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }}>
                 
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Votre adresse email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={20} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-amber-300 focus:border-amber-500 outline-none transition-all text-slate-700"
                      />
                    </div>
                  </div>

                  <button className="cursor-pointer w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    <Send size={20} />
                    Envoyer le lien
                  </button>
                </form>
              ) : (
                
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl animate-in zoom-in duration-300">
                  <p className="text-emerald-800 font-medium text-center">
                    L'email a été envoyé avec succès à <br/>
                    <span className="font-bold underline">{email}</span>. 
                    Vérifiez vos spams si vous ne voyez rien.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="w-full mt-4 text-emerald-600 font-bold text-sm hover:underline"
                  >
                    Renvoyer le lien
                  </button>
                </div>
              )}

              <p className="text-center text-sm font-medium text-slate-400">
                Besoin d'aide ? <a href="#" className="text-black italic font-serif underline">Contactez le support</a>
              </p>
            </div>
          </div>

          
          <div className="hidden lg:block lg:w-1/2 h-screen sticky top-0">
        <img
          className="w-full h-full object-cover"
          src={'image-pageoublie.jpg'}
          alt="Lecture plaisir"
        />
      </div>

        </div>
      </div>
    </>
  );
}