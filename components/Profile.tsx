'use client';

import Link from 'next/link';

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

interface ProfileCardProps {
  profile: Profile;
  onSummaryClick: (profile: Profile) => void;
}

export default function ProfileCard({ profile, onSummaryClick }: ProfileCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow">
      <img
        src={profile.photo}
        alt={profile.name}
        className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
      />
      <h2 className="text-xl font-semibold text-center">{profile.name}</h2>
      <p className="text-gray-600 text-center line-clamp-2">{profile.description}</p>
      <div className="flex justify-center gap-2 mt-3">
        <Link
          href={`/profile/${profile.id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Details
        </Link>
        <button
          onClick={() => onSummaryClick(profile)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Summary
        </button>
      </div>
    </div>
  );
}