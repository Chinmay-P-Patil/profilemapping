"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

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

interface FormData {
  name: string;
  photo: string;
  description: string;
  address: string;
  lat: string;
  lng: string;
  contact: string;
  interests: string;
}

export default function Admin() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    photo: '',
    description: '',
    address: '',
    lat: '',
    lng: '',
    contact: '',
    interests: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get<Profile[]>('/api/profiles');
      setProfiles(res.data);
    } catch (err) {
      setError('Failed to fetch profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/profiles', {
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
      });
      setFormData({
        name: '',
        photo: '',
        description: '',
        address: '',
        lat: '',
        lng: '',
        contact: '',
        interests: '',
      });
      await fetchProfiles();
    } catch (err) {
      setError(axios.isAxiosError(err) 
        ? err.response?.data?.error || 'Failed to add profile' 
        : 'Failed to add profile');
    }
  };

  const handleDelete = async (id: number) => {
  try {
    await axios.delete(`/api/profiles/${id}`);
    await fetchProfiles();
    setError(null);
  } catch (err) {
    setError(axios.isAxiosError(err) 
      ? err.response?.data?.error || 'Failed to delete profile'
      : 'Failed to delete profile');
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="mb-8 max-w-lg mx-auto">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="photo"
          placeholder="Photo URL"
          value={formData.photo}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          name="lat"
          placeholder="Latitude"
          value={formData.lat}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          step="any"
        />
        <input
          type="number"
          name="lng"
          placeholder="Longitude"
          value={formData.lng}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          step="any"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="interests"
          placeholder="Interests"
          value={formData.interests}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Profile
        </button>
      </form>

     {isLoading && <p className="text-center">Loading...</p>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map(profile => (
            <tr key={profile.id}>
              <td className="border p-2">{profile.name}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}