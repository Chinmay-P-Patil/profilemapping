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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'profiles.json');
    const fileContents = await fs.readFile(dataPath, 'utf8');
    const profiles: Profile[] = JSON.parse(fileContents);

    const profileId = Number(params.id);
    const updatedProfiles = profiles.filter(p => p.id !== profileId);

    if (updatedProfiles.length === profiles.length) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    await fs.writeFile(dataPath, JSON.stringify(updatedProfiles, null, 2));
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'profiles.json');
    const fileContents = await fs.readFile(dataPath, 'utf8');
    const profiles: Profile[] = JSON.parse(fileContents);
    
    const profile = profiles.find(p => p.id === Number(params.id));

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}