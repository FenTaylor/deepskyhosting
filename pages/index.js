import { useState, useEffect } from 'react';
import PhotoPreview from '../components/PhotoPreview';
import UserPreview from '../components/UserPreview';

const Home = () => {
  const [topPhotos, setTopPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const topPhotos = async () => {
      try {
        const res = await fetch('/api/photo/top');
        if (res.ok) {
          const data = await res.json();
          setTopPhotos(data);
        } else {
          setError('Ошибка при получении фотографий');
        }
      } catch (err) {
        setError('Ошибка при подключении');
      } finally {
        setLoading(false);
      }
    };

    const newPhotos = async () => {
      try {
        const res = await fetch('/api/photo/new');
        if (res.ok) {
          const data = await res.json();
          setNewPhotos(data);
        } else {
          setError('Ошибка при получении фотографий');
        }
      } catch (err) {
        setError('Ошибка при подключении');
      } finally {
        setLoading(false);
      }
    };

    const newUsers = async () => {
      try {
        const res = await fetch('/api/user/new');

        if (res.ok) {
          const data = await res.json();
          setNewUsers(data);
        } else {
          setError('Ошибка при получении новых пользователей');
        }
      } catch (err) {
        setError('Ошибка при подключении');
      } finally {
        setLoading(false);
      }
    };

    topPhotos();
    newPhotos();
    newUsers();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Топ 5 популярных фотографий</h1>
      <div className="photo-list">
        {topPhotos.map((photo) => (
          <PhotoPreview key={photo.id} photo={photo} />
        ))}
      </div>
      <h1>Топ 50 последних фотографий</h1>
      <div className="photo-list">
        {newPhotos.map((photo) => (
          <PhotoPreview key={photo.id} photo={photo} />
        ))}
      </div>
      <h1>Новые фотографы на сайте</h1>
      <div className="user-list">
        {newUsers.map((user) => (
          <UserPreview key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Home;
