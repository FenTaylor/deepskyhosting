import { useState, useEffect } from 'react';
import PhotoPreview from '../components/PhotoPreview';

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Получаем топ 5 популярных фотографий
    const fetchPhotos = async () => {
      try {
        const res = await fetch('/api/photo/top');
        if (res.ok) {
          const data = await res.json();
          setPhotos(data);
        } else {
          setError('Ошибка при получении фотографий');
        }
      } catch (err) {
        setError('Ошибка при подключении');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Топ 5 популярных фотографий</h1>
      <div className="photo-list">
        {photos.map((photo) => (
          <PhotoPreview key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
};

export default Home;
