// components/Header.js
import Link from 'next/link';

const Header = ({ user }) => {
console.log(user);
  return (
    <header style={styles.header}>
      <div>
        <Link href="/">
          Logo
        </Link>
      </div>
      <nav>
        {user ? (
          <span style={styles.user}>Привет, {user.name}</span>
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
