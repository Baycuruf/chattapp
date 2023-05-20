const UserInfo = ({ user }) => {
    return (
      <div className="flex items-center p-2">
        {user && user.photoURL && (
          <img
            className="w-16 h-16 rounded-full"
            src={user.photoURL}
            alt={user.username}
          />
        )}
      </div>
    );
  };

  export default UserInfo;