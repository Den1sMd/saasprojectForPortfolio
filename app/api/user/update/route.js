import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import bcrypt from 'bcryptjs'; 

export async function PUT(request) {
  try {
    
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Échec : Header Authorization manquant ou mal formaté");
      return NextResponse.json({ error: "Veuillez vous connecter pour modifier votre profil" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET n'est pas défini dans le .env");
      return NextResponse.json({ error: "Erreur de configuration serveur" }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

   
    const body = await request.json();
    const { full_name, email, phone, birthday, currentPassword, newPassword } = body;

  
    if (!full_name || !email) {
      return NextResponse.json({ error: "Le nom et l'adresse e-mail sont obligatoires" }, { status: 400 });
    }

    const [users] = await db.execute('SELECT password FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }
    
    const dbPassword = users[0].password;

    
    let passwordQuerySegment = "";
    let queryParams = [full_name, email, phone || null, birthday || null];

    if (currentPassword || newPassword) {
      
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Veuillez renseigner l'ancien ET le nouveau mot de passe." }, { status: 400 });
      }

      // Vérification de l'ancien mot de passe
      const isPasswordValid = await bcrypt.compare(currentPassword, dbPassword);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Le mot de passe actuel est incorrect." }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Le nouveau mot de passe doit faire au moins 6 caractères." }, { status: 400 });
      }

     
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      
      passwordQuerySegment = ", password = ?";
      queryParams.push(hashedNewPassword);
    }

    
    queryParams.push(userId);

    
    await db.execute(
      `UPDATE users SET full_name = ?, email = ?, phone = ?, birthday = ? ${passwordQuerySegment} WHERE id = ?`,
      queryParams
    );

   
    const [updatedUsers] = await db.execute(
      'SELECT id, email, full_name, phone, birthday, created_at FROM users WHERE id = ?',
      [userId]
    );

    return NextResponse.json({ 
      message: "Profil mis à jour avec succès !", 
      user: updatedUsers[0] 
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    return NextResponse.json({ 
      error: "Erreur interne lors de la mise à jour du profil", 
      details: error.message 
    }, { status: 500 });
  }
}