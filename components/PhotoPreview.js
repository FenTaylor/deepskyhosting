// components/PhotoPreview.js
import Link from 'next/link';

const PhotoPreview = ({ photo }) => {
    return (
        <div className="photo-preview">
            <Link href={`/photo/${photo.id}`}>
                <img src={`/uploads/photos/temp/${photo.file_name}`} alt={photo.name} width="200" />
            </Link>
            <div className="photo-info">
                <h3>{photo.name}</h3>
                <p>Автор: {photo.username}</p>
                <p>Дата: {new Date(photo.created_at).toLocaleDateString()}</p>
                <p>Просмотров: {photo.views}</p>
            </div>
        </div>
    );
};

export default PhotoPreview;
