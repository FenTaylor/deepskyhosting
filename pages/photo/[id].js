import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ViewPhoto = () => {
  const router = useRouter();
  const { id } = router.query; // Получаем ID фотографии из URL
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Получаем информацию о фото по ID
      const fetchPhoto = async () => {
        try {
          const res = await fetch(`/api/photo/${id}`);
          if (res.ok) {
            const data = await res.json();
            setPhoto(data);
            setLoading(false);
          } else {
            setError('Фото не найдено');
          }
        } catch (err) {
          setError('Ошибка при получении информации о фото');
          setLoading(false);
        }
      };

      fetchPhoto();
    }
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{photo.name}</h1>
      <p>Опубликовано: {photo.username}</p>
      <p>Дата публикации: {new Date(photo.created_at).toLocaleDateString()}</p>
      <img src={`/uploads/photos/temp/${photo.file_name}`} alt={photo.name} width="500" />
      <p>{photo.description}</p>
    </div>
  );
};

export default ViewPhoto;
