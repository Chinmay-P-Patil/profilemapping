import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Profile {
  id: number;
  name: string;
  photo: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  contact?: string;
  interests?: string;
}

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'profiles.json');
    const fileContents = await fs.readFile(dataPath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'profiles.json');
    const fileContents = await fs.readFile(dataPath, 'utf8');
    const profiles: Profile[] = JSON.parse(fileContents);

    const newProfile = await request.json();
    
    // Generate new ID
    const newId = profiles.length > 0 
      ? Math.max(...profiles.map(p => p.id)) + 1 
      : 1;

    const fullProfile: Profile = {
      id: newId,
      ...newProfile,
      lat: Number(newProfile.lat),
      lng: Number(newProfile.lng)
    };

    const updatedProfiles = [...profiles, fullProfile];
    await fs.writeFile(dataPath, JSON.stringify(updatedProfiles, null, 2));
    
    return NextResponse.json(fullProfile);
  } catch (error) {
    console.error('Add profile error:', error);
    return NextResponse.json(
      { error: 'Failed to add profile' },
      { status: 500 }
    );
  }
}