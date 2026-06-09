"use client"

import { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFull_name] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/home")
    }
  }, [])

  const handleSubmit = async (e: any) => {   //any pour le ts
    e.preventDefault();
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { full_name, email, password, phone, birthday }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (!isRegister) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          

          router.push('/home');
        } else {
          alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
          setIsRegister(false);
        }
      } else {
        alert(data.message || "Une erreur est survenue");
      }
    } catch (err) {
      alert("Impossible de joindre le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans flex flex-col lg:flex-row">
      
      
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-20">
        <div className="w-full max-w-[400px] space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-black text-black tracking-tight">
              {isRegister ? "Inscription" : "Connexion"}
            </h2>
            <p className="text-slate-500 mt-3 font-medium">
              {isRegister ? "Rejoignez l'aventure !" : "Ravi de vous revoir !"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Nom complet</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
                    <input 
                      required={isRegister}
                      type="text" 
                      value={full_name}
                      onChange={(e) => setFull_name(e.target.value)}
                      placeholder="Jean Dupont"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-amber-300 focus:border-white outline-none transition-all text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Téléphone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
                      <input 
                        type="tel" 
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="06..."
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-amber-300 focus:border-white outline-none transition-all text-slate-700"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Naissance</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
                      <input 
                        type="date" 
                        max={new Date().toISOString().split("T")[0]}
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full pl-11 pr-2 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-amber-300 focus:border-white outline-none transition-all text-slate-700 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-amber-300 focus:border-white outline-none transition-all text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mot de passe</label>
                {!isRegister && (
                  <Link href="/oublie" className="text-xs font-bold text-black italic font-serif hover:underline cursor-pointer">Oublié ?</Link>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-amber-300 focus:border-white outline-none transition-all text-slate-700"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            
            <div className='pt-2'>
              <button 
                type="submit"
                disabled={loading}
                className="bg-black text-sm w-full h-12 text-white cursor-pointer transition-all shadow-sm shadow-black hover:rounded-3xl hover:scale-[1.01] font-serif italic duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Patientez...</span>
                  </>
                ) : (
                  <span>{isRegister ? "Créer mon compte" : "Se connecter"}</span>
                )}
              </button>
            </div>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Ou</span></div>
          </div>

          <button type="button" className="text-white bg-slate-900 flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer w-full shadow-lg shadow-slate-200">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
              Continuer avec Google
          </button>

          <p className="text-center text-sm font-medium text-slate-500">
            {isRegister ? "Déjà un compte ?" : "Nouveau ici ?"} {" "}
            <button 
              type="button"
              onClick={() => setIsRegister(!isRegister)} 
              className="text-black italic font-serif font-bold hover:underline cursor-pointer transition-colors"
            >
              {isRegister ? "Se connecter" : "Créer un compte gratuitement"}
            </button>
          </p>
        </div>
      </div>

     
      <div className="hidden lg:block lg:w-1/2 h-screen sticky top-0 bg-slate-50">
        <img
          className="w-full h-full object-cover"
          src={'image-orange-loginpage.jpg'}
          alt="Illustration"
        />
        <div className="absolute inset-0 bg-emerald-900/5 mix-blend-multiply"></div>
      </div>

    </div>
  );
}