import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Échec : Header Authorization manquant ou mal formaté");
      return NextResponse.json({ message: "Veuillez vous connecter pour commander" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET n'est pas défini dans le .env");
      return NextResponse.json({ message: "Erreur de configuration serveur" }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; 
   
    const body = await request.json();
    const { items, total_amount } = body;

    if (!total_amount || isNaN(total_amount)) {
      return NextResponse.json({ message: "Montant total invalide" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Le panier est vide" }, { status: 400 });
    }

    let lastInsertedId = null;

    
    for (const item of items) {
      const rawProductName = item.product_name || "";
      const cleanedName = rawProductName.replaceAll("/", "").split(".")[0];

      const product_description = item.product_description || "";
      const product_image_name = item.product_image || rawProductName;
      const product_name = cleanedName;
      const product_quantity = item.quantity || 1;

      const product_price = parseFloat(item.price) || 0;
      const item_total = product_price * product_quantity;

      const [result] = await db.execute(
        'INSERT INTO orders (user_id, total_amount, status, product_name, product_description, product_image, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, item_total, 'En attente', product_name, product_description, product_image_name, product_quantity]
      );
      
      lastInsertedId = result.insertId;
    }
   
    
    await db.execute(
      'DELETE FROM basket WHERE user_id = ?',
      [userId]
    );

    
    await db.execute(
      'UPDATE users SET panier_count = 0 WHERE id = ?',
      [userId]
    );

    return NextResponse.json({ 
      message: "Commande validée avec succès et panier vidé !", 
      orderId: lastInsertedId 
    }, { status: 201 });

  } catch (error) {
    console.error("Erreur commande:", error);
    return NextResponse.json({ 
      message: "Erreur interne lors du traitement de la commande", 
      error: error.message 
    }, { status: 500 });
  }
}