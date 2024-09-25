import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EditProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    avatar: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteAvatar, setDeleteAvatar] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        id: storedUser.id,
        name: storedUser.name || '',
        password: '',
        avatar: storedUser.avatar || '',
      });
      setAvatarPreview(storedUser.avatar ? `/uploads/avatars/${storedUser.avatar}` : null);
      setLoading(false);
    } else {
      router.push('/signin');
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
      setDeleteAvatar(false); // Устанавливаем false, если загружаем новый аватар
    }
  };

  const handleDeleteAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }));
    setAvatarPreview(null);
    setDeleteAvatar(true); // Указываем, что аватар нужно удалить
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('id', formData.id);

    if (formData.password) formDataToSend.append('password', formData.password);

    // Если есть новый аватар, отправляем его, иначе сохраняем старый
    if (formData.avatar && !deleteAvatar && typeof formData.avatar !== 'string') {
      formDataToSend.append('avatar', formData.avatar);
    }

    // Если аватар удалён, добавляем флаг для удаления
    if (deleteAvatar) {
      formDataToSend.append('deleteAvatar', 'true');
    }

    try {
      const res = await fetch(`/api/user/edit`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Изменения сохранены');
        router.push('/user/' + user.id);
      } else {
        alert('Ошибка при сохранении');
      }
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка при сохранении');
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Редактировать профиль</h1>
      <label>
        Имя:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Пароль (оставьте пустым, если не хотите изменять):
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Аватар:
        <input type="file" name="avatar" onChange={handleAvatarChange} />
      </label>
      {avatarPreview && (
        <div>
          <img src={avatarPreview} alt="Avatar" width="100" />
          <button onClick={handleDeleteAvatar}>Удалить аватар</button>
        </div>
      )}
      <br />
      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
};

export default EditProfile;
