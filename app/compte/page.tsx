"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Mail, Phone, Calendar, ShoppingBag, Loader2, ArrowLeft, Clock } from "lucide-react";

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
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        }
      } catch (err) {
        console.error("Erreur récupération données tableau de bord", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

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
        <div className="max-w-6xl mx-auto mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 font-medium text-gray-600 hover:text-black transition-colors cursor-pointer group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Retour
          </button>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Bannière Bienvenue */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">Bonjour {user?.full_name} !</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Informations Personnelles (Prend 2 colonnes) */}
            <div className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-black font-sans">Informations personnelles</h2>
                <p className="text-xs text-slate-400 mt-1">Gérez les détails de votre compte utilisateur.</p>
              </div>

              <div className="border-b border-slate-100 w-full" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} /> Nom complet
                  </span>
                  <p className="text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                    {user?.full_name || "Non renseigné"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={14} /> Adresse e-mail
                  </span>
                  <p className="text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 overflow-hidden text-ellipsis">
                    {user?.email}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={14} /> Téléphone
                  </span>
                  <p className="text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                    {user?.phone || "Aucun numéro"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={14} /> Date de naissance
                  </span>
                  <p className="text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                    {user?.birthday ? new Date(user.birthday).toLocaleDateString('fr-FR') : "Non renseignée"}
                  </p>
                </div>
              </div>
            </div>

           
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
                  {/* Compteur Dynamique basé sur la longueur du tableau orders */}
                  <p className="text-3xl font-black text-black font-mono">{orders.length}</p>
                  <span className="text-xs font-medium text-slate-400">
                    {orders.length > 0 ? `${orders.length} commande(s) enregistrée(s)` : "Aucun achat en cours"}
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