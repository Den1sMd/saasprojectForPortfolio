import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

export async function GET() {
  try {
    
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    console.log("Back-end - Auth Header reçu :", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: "Token manquant dans les headers" }, { status: 401 });
    }

    
    const token = authHeader.split(' ')[1];

    
    if (!process.env.JWT_SECRET) {
      console.error("variable env probléme");
      return NextResponse.json({ message: "Erreur de configuration serveur" }, { status: 500 });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Back-end - Token décodé avec succès :", decoded);

    
    const [rows] = await db.execute(
      'SELECT id, email, full_name, phone, panier_count, birthday, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Utilisateur introuvable en BDD" }, { status: 404 });
    }

    return NextResponse.json({ user: rows[0] }, { status: 200 });

  } catch (error) {
    console.error("Erreur complète API /me :", error.message);
    
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: "La signature du token est invalide (JWT_SECRET incorrect ?)" }, { status: 401 });
    }
    
    return NextResponse.json({ message: "Session invalide" }, { status: 401 });
  }
}