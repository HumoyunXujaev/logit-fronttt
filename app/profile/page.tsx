// app/profile/page.tsx
import React from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';

const ProfilePage: React.FC = () => {
  // Dummy data
  const user = {
    id: '12345',
    name: 'John Doe',
    username: 'johndoe',
    role: 'Logistics Manager',
    verified: true,
    rating: 4.8,
    complaints: 1,
    recommendations: 15,
    experience: '5 years',
    position: 'Senior Logistics Coordinator',
    contact: {
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
    },
    photoUrl: '/api/placeholder/150/150',
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-primary text-white p-4">
          <div className="flex items-center space-x-4">
            <Image
              src={user.photoUrl}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm">{user.username}</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold">User ID</h2>
              <p>{user.id}</p>
            </div>
            <div>
              <h2 className="font-semibold">Role</h2>
              <p>{user.role}</p>
            </div>
            <div>
              <h2 className="font-semibold">Verified</h2>
              <p>{user.verified ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <h2 className="font-semibold">Rating</h2>
              <p>{user.rating}/5</p>
            </div>
            <div>
              <h2 className="font-semibold">Complaints</h2>
              <p>{user.complaints}</p>
            </div>
            <div>
              <h2 className="font-semibold">Recommendations</h2>
              <p>{user.recommendations}</p>
            </div>
            <div>
              <h2 className="font-semibold">Experience</h2>
              <p>{user.experience}</p>
            </div>
            <div>
              <h2 className="font-semibold">Position</h2>
              <p>{user.position}</p>
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Contact Information</h2>
            <p>Email: {user.contact.email}</p>
            <p>Phone: {user.contact.phone}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;