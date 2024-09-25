import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EditPhoto = () => {
  const router = useRouter();
  const { id } = router.query; // Получаем ID фотографии из URL
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    photo_date: ''
  });

  useEffect(() => {
    if (id) {
      // Получаем информацию о фото по ID
      const fetchPhoto = async () => {
        try {
          const res = await fetch(`/api/photo/${id}`);
          if (res.ok) {
            const data = await res.json();
            setPhoto(data);
            setFormData({
              name: data.name || '',
              description: data.description || '',
              link: data.link || '',
              photo_date: data.photo_date || ''
            });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/photo/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Изменения сохранены');
        router.push(`/photo/${id}`); // Переход на страницу фото после сохранения
      } else {
        alert('Ошибка при сохранении');
      }
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка при сохранении');
    }
  };

  return (
    <div>
      <h1>Редактировать фотографию</h1>
      <label>
        Название:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Описание:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Ссылка:
        <input
          type="text"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Дата фотографии:
        <input
          type="date"
          name="photo_date"
          value={formData.photo_date}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
};

export default EditPhoto;
