import UserInfo from "./UserInfo";

const PostHeader = ({ post, user, timeAgo }) => {
    return (
      <div className="rounded flex text-base font-bold w-[620px] h-20">
        {}
        <UserInfo user={user} />
        <div className="justify-end h-20 text-center items-center flex gap-4">
          {post.username}
          <span className="text-gray-400 font-semibold">{timeAgo}</span>
        </div>
      </div>
    );
  };

  export default PostHeader;