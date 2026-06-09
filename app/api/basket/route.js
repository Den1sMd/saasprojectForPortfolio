import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';


export async function GET(request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "Erreur configuration serveur" }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;


    const [basketRows] = await db.execute(
      'SELECT id, product_name, product_description, product_image, price, quantity FROM basket WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    return NextResponse.json({ basket: basketRows }, { status: 200 });

  } catch (error) {
    console.error("Erreur GET panier :", error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ message: "Session expirée" }, { status: 401 });
    }
    return NextResponse.json({ message: "Erreur interne serveur" }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: "Veuillez vous connecter pour ajouter au panier" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "Erreur serveur de configuration" }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const body = await request.json();
    const { product_name, product_description, product_image, price } = body;

    if (!product_name || !price) {
      return NextResponse.json({ message: "Données du produit manquantes" }, { status: 400 });
    }

    const [existingItem] = await db.execute(
      'SELECT id, quantity FROM basket WHERE user_id = ? AND product_name = ?',
      [userId, product_name]
    );

    if (existingItem.length > 0) {
      await db.execute(
        'UPDATE basket SET quantity = quantity + 1 WHERE id = ?',
        [existingItem[0].id]
      );
      return NextResponse.json({ message: "Quantité mise à jour dans le panier !" }, { status: 200 });
    } else {
      await db.execute(
        'INSERT INTO basket (user_id, product_name, product_description, product_image, price, quantity) VALUES (?, ?, ?, ?, ?, 1)',
        [userId, product_name, product_description, product_image, parseFloat(price)]
      );
      return NextResponse.json({ message: "Produit ajouté au panier avec succès !" }, { status: 201 });
    }

  } catch (error) {
    console.error("Erreur panier :", error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ message: "Session expirée, reconnectez-vous" }, { status: 401 });
    }
    return NextResponse.json({ message: "Erreur interne serveur", error: error.message }, { status: 500 });
  }
}