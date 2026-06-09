import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

export async function PUT(request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { product_name, action } = await request.json();

    if (action === 'increment') {

      await db.execute(
        'UPDATE basket SET quantity = quantity + 1 WHERE user_id = ? AND product_name = ?',
        [userId, product_name]
      );
    } else if (action === 'decrement') {
     
      const [item] = await db.execute(
        'SELECT quantity FROM basket WHERE user_id = ? AND product_name = ?',
        [userId, product_name]
      );

      if (item.length > 0) {
        if (item[0].quantity <= 1) {
          
          await db.execute('DELETE FROM basket WHERE user_id = ? AND product_name = ?', [userId, product_name]);
        } else {
          
          await db.execute(
            'UPDATE basket SET quantity = quantity - 1 WHERE user_id = ? AND product_name = ?',
            [userId, product_name]
          );
        }
      }
    }

    return NextResponse.json({ message: "Panier synchronisé" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}