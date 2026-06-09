import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

export async function GET() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    
    const [orders] = await db.execute(
      'SELECT id, total_amount, status, product_name, product_description, quantity, product_image, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    return NextResponse.json({ orders }, { status: 200 });

  } catch (error) {
    console.error("Erreur récupération commandes :", error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ message: "Session expirée" }, { status: 401 });
    }
    return NextResponse.json({ message: "Erreur interne serveur" }, { status: 500 });
  }
}