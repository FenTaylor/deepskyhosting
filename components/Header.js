import { useRef } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';

const Header = ({ user }) => {

  const fileInputRef = useRef(null);
  const router = useRouter();
  
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('user_id', user.id);
  
      const res = await fetch('/api/photo/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (res.ok) {
        const data = await res.json();

        router.push(`/photo/${data.photo_id}`);
      } else {
        alert('Error uploading photo');
      }
    }
  };

  return (
    <header style={styles.header}>
      <div>
        <Link href="/">
          Logo
        </Link>
      </div>
      <nav>
        {user ? (
          <>
            <span style={styles.user}>Hi, {user.name}</span>
            <button onClick={handleUploadClick}>Upload</button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".jpg,.jpeg,.png,.gif"
              onChange={handleFileChange}
            />
          </>
        ) : (
          <>
            <Link href="/signin">
              Sign In
            </Link>
            <Link href="/signup">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    borderBottom: '1px solid #ccc',
  },
  user: {
    marginLeft: '1rem',
  },
};

export default Header;
