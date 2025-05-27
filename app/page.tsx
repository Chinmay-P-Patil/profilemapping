"use client";
import { useState, useEffect } from 'react';
import ProfileCard from '../components/Profile';
import MapComponent from '../components/Map';

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

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/profiles');
        if (!response.ok) throw new Error('Failed to fetch profiles');
        const data = await response.json();
        setProfiles(data);
        setFilteredProfiles(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredProfiles(
      profiles.filter(
        p =>
          p.name.toLowerCase().includes(term.toLowerCase()) ||
          p.address.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  if (loading) return <div className="text-center p-4">Loading profiles...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profiles</h1>
      <input
        type="text"
        placeholder="Search by name or address"
        value={searchTerm}
        onChange={e => handleSearch(e.target.value)}
        className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProfiles.map(profile => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onSummaryClick={setSelectedProfile}
          />
        ))}
      </div>
      {selectedProfile && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Location: {selectedProfile.name}</h2>
          <MapComponent lat={selectedProfile.lat} lng={selectedProfile.lng} />
        </div>
      )}
    </div>
  );
}