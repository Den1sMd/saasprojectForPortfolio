import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

  

    const [rows] = await db.execute(
      'SELECT id, email, full_name, password FROM users WHERE email = ?',
      [email]
    );

    
    if (rows.length === 0) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect." }, { status: 401 });
    }

    const user = rows[0];

   
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect." }, { status: 401 });
    }

    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'votre_cle_secrete_par_defaut',
      { expiresIn: '1d' }
    );

  
    const [orderCountResult] = await db.execute(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [user.id]
    );
    const totalCommandes = orderCountResult[0]?.total || 0;

  
    return NextResponse.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        téléphone: user.phone,
        total_commandes: totalCommandes
      }
    });

  } catch (error) {
    console.error("Erreur Login:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}