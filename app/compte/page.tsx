"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Mail, Phone, Calendar, ShoppingBag, Loader2, ArrowLeft, Clock, Lock, Save } from "lucide-react";

interface UserData {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  birthday?: string;
  created_at?: string;
}

interface OrderData {
  id: number;
  total_amount: string;
  status: string;
  product_name: string | null;
  product_description: string | null;
  product_image: string | null;
  quantity?: number;
  created_at: string;
}

export default function MonCompte() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    birthday: "",
    currentPassword: "",
    newPassword: "",
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [profileRes, ordersRes] = await Promise.all([
          fetch("/api/auth/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch("/api/commandes", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        if (profileRes.ok && ordersRes.ok) {
          const profileData = await profileRes.json();
          const ordersData = await ordersRes.json();
          
          setUser(profileData.user);
          setOrders(ordersData.orders);
          
          
          setFormData({
            full_name: profileData.user.full_name || "",
            email: profileData.user.email || "",
            phone: profileData.user.phone || "",
            birthday: profileData.user.birthday ? profileData.user.birthday.split('T')[0] : "",
            currentPassword: "",
            newPassword: "",
          });
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Erreur récupération données tableau de bord", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      return;
    }

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
        setUser(data.user);
        // Reset les champs de mot de passe après modification réussie
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
      } else {
        setMessage({ type: "error", text: data.error || "Une erreur est survenue." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Erreur de connexion avec le serveur." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-2">
        <Loader2 className="animate-spin text-black w-8 h-8" />
        <p className="text-sm font-medium text-slate-500 font-mono">Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      
      <main className="w-full min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 font-medium text-gray-600 hover:text-black transition-colors cursor-pointer group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Retour
          </button>
          
          <button 
            onClick={handleLogout}
            className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
          >
            Se déconnecter
          </button>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">Bonjour {user?.full_name} !</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            
            <form onSubmit={handleSubmit} className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-black font-sans">Informations personnelles</h2>
                <p className="text-xs text-slate-400 mt-1">Gérez et modifiez les détails de votre compte utilisateur.</p>
              </div>

              <div className="border-b border-slate-100 w-full" />

              
              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium ${
                  message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                }`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} /> Nom complet
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={14} /> Adresse e-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={14} /> Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Non renseigné"
                    className="w-full text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={14} /> Date de naissance
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="border-b border-slate-100 w-full pt-2" />

             
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                    <Lock size={14} /> Modifier le mot de passe
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Laissez vide si vous ne souhaitez pas le changer.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">Mot de passe actuel</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full text-sm text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">Nouveau mot de passe</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full text-sm text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-black hover:bg-zinc-800 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </form>

            
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between flex-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-black text-sm uppercase tracking-wider">Commandes</h3>
                    <p className="text-xs text-slate-400">Historique d'achats</p>
                  </div>
                  <ShoppingBag className="text-blue-600 w-6 h-6" />
                </div>
                <div className="pt-6 flex justify-between items-end">
                  <p className="text-3xl font-black text-black font-mono">{orders.length}</p>
                  <span className="text-xs font-medium text-slate-400">
                    {orders.length > 0 ? `${orders.length} commande(s)` : "Aucun achat"}
                  </span>
                </div>
              </div>
            </div>

          </div>

        
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-black font-sans">Vos dernières commandes</h2>
              <p className="text-xs text-slate-400 mt-1">Retrouvez le statut et le détail de vos articles commandés.</p>
            </div>

            <div className="border-b border-slate-100 w-full" />

            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Vous n'avez pas encore passé de commande.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2 shrink-0">
                        {order.product_image ? (
                          <img src={order.product_image} alt={order.product_name || "Produit"} className="rounded-xl max-w-full max-h-full object-contain" />
                        ) : (
                          <ShoppingBag className="text-gray-300 w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-black text-sm leading-snug">
                          {order.product_description || `Commande #${order.id}`}
                        </h4>
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-gray-400 font-mono">
                            <Clock size={12} /> {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-gray-400 font-mono">
                            Quantité : {order.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                      <p className="font-black font-mono text-blue-900 text-sm sm:text-base">
                        {parseFloat(order.total_amount).toLocaleString()} €
                      </p>
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                        Statut : {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}