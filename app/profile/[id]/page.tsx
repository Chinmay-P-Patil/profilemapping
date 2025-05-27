'use client'; // Must be at the very top

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MapComponent from '../../../components/Map';

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

export default function ProfileDetail() {
  const params = useParams();
  const id = params?.id;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profiles/${id}`);
        setProfile(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.status === 404 
            ? 'Profile not found' 
            : 'Failed to load profile');
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!profile) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{profile.name}</h1>
      <img
        src={profile.photo}
        alt={profile.name}
        className="w-32 h-32 rounded-full my-4 mx-auto rounded-lg shadow-md object-cover"
      />
      <p className="text-gray-600">{profile.description}</p>
      <div className="mt-4 space-y-2">
        <p><strong>Address:</strong> {profile.address}</p>
        <p><strong>Contact:</strong> {profile.contact || 'Not provided'}</p>
        <p><strong>Interests:</strong> {profile.interests || 'Not provided'}</p>
      </div>
    </div>
  );
}