import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Construimos la ruta al fichero JSON de forma segura
const dataFilePath = path.join(process.cwd(), 'app', 'data', 'commands.json');

// --- FUNCIÓN GET: Para leer los comandos ---
export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    // Si el fichero no existe o hay un error, devolvemos un objeto vacío
    console.error("Could not read commands file:", error);
    return NextResponse.json({ categories: [], commands: {} });
  }
}

// --- FUNCIÓN POST: Para guardar los comandos ---
export async function POST(request: Request) {
  try {
    const newData = await request.json();
    // Escribimos los nuevos datos al fichero, formateando el JSON para que sea legible
    await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
    return NextResponse.json({ message: 'Commands saved successfully!' });
  } catch (error) {
    console.error("Could not save commands file:", error);
    return NextResponse.json({ message: 'Failed to save commands.' }, { status: 500 });
  }
}