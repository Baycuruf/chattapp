const CommentForm = ({
  handleCommentFormSubmit,
  commentText,
  setCommentText,
}) => {
  return (
    <form onSubmit={handleCommentFormSubmit}>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Yorum yap..."
        className="w-full p-2 text-black"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4">
        Gönder
      </button>
    </form>
  );
};
export default CommentForm;
