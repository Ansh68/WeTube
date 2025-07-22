import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CommentItem from './CommentItem';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Send } from 'lucide-react';

const Comments = ({ video }) => {
  const { videoId } = useParams();
  const [comments, setComments] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const {
    isAuthenticated,
    data: { user },
  } = useSelector((state) => state.auth);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [hasmore, setHasmore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchComments = async (targetPage = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/comments/${videoId}?page=${targetPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );

      const newComments = response.data.data.comments;

      setComments((prev) =>
        targetPage === 1 ? newComments : [...prev, ...newComments]
      );

      if (newComments.length < 10) {
        setHasmore(false);
      } else {
        setPage(targetPage);
      }
    } catch (error) {
      console.error("Fetch Comments Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (data) => {
    if (!isAuthenticated) {
      toast.error("Please Login to Comment");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/comments/${videoId}`,
        { content: data.content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );

      const newComment = response.data.data;
      setComments((prev) => [newComment, ...prev]);
      toast.success("Comment posted successfully");
      reset();
    } catch (error) {
      toast.error("Unable to post comment");
    }
  };

  useEffect(() => {
    if (!videoId) return;
    setHasmore(true);
    setPage(1);
    fetchComments(1);
  }, [videoId]);

  const updateCommentInState = (id, updated) => {
    const updatedComments = comments.map((c) =>
      c._id === id ? { ...c, ...updated } : c
    );
    setComments(updatedComments);
  };

  const deleteCommentInState = (id) => {
    const updatedComments = comments.filter((c) => c._id !== id);
    setComments(updatedComments);
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-4">
        <p className="text-lg font-medium text-white">
          {comments.length ? `${comments.length} Comments` : "No Comments"}
        </p>
        <form
          onSubmit={handleSubmit(handleSubmitComment)}
          className="flex items-center space-x-4"
        >
          <img
            src={user?.avatar || video?.owner?.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              {...register("content", { required: true })}
              placeholder="Add a comment"
              className="w-full bg-gray-900 border-b border-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <InfiniteScroll
        dataLength={comments.length}
        next={() => {
          if (!loading && hasmore) {
            fetchComments(page + 1);
          }
        }}
        hasMore={hasmore}
        className="space-y-4"
      >
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUser={user}
            updateCommentInState={updateCommentInState}
            deleteCommentInState={deleteCommentInState}
            pathname={location.pathname}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Comments;
