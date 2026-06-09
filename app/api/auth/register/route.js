import db from '@/lib/db'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
  
    const { email, full_name, password, phone, birthday } = await req.json();

    
    if (!email || !full_name || !password) {
      return NextResponse.json(
        { message: "Veuillez remplir tous les champs obligatoires (Email, Nom complet et Mot de passe)." },
        { status: 400 }
      );
    }

   
    const [existingUser] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé." },
        { status: 400 }
      );
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const [result] = await db.execute(
      `INSERT INTO users (email, full_name, password, phone, birthday) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        email, 
        full_name, 
        hashedPassword, 
        phone || null, 
        birthday || null
      ]
    );

    const userId = result.insertId;

    
    const token = jwt.sign(
      { userId: userId, email: email },
      process.env.JWT_SECRET || 'ezaezadsqzaeeer',
      { expiresIn: '1d' }
    );

   
    return NextResponse.json({
      message: "Utilisateur créé avec succès !",
      token,
      user: {
        id: userId,
        email: email,
        full_name: full_name,
        phone: phone || null,
        birthday: birthday || null,
        total_commandes: 0
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Erreur Inscription:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du compte." },
      { status: 500 }
    );
  }
}