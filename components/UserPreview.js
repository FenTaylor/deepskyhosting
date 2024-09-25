import Link from 'next/link';

const UserPreview = ({ user }) => {
    return (
        <div className="user-preview">
            <h3>{ user.name }</h3>
        </div>
    )
}

export default UserPreview;