import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Déconnexion réussie" },
      { status: 200 }
    );

    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    return NextResponse.json(
      { message: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}