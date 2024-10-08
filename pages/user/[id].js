import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (id) {
      const userId = id;

      const fetchUser = async () => {
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();
        setUser(data);
      };

      fetchUser();
    }
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;