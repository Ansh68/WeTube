import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import useclickOutside from "../../utils/useclickOutside.js";
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

function CommentItem({
    comment,
    updateCommentInState,
    deleteCommentInState,
}) {
    const [isEditing, setisEditing] = useState(false);
    const [menuOpen, setmenuOpen] = useState(false);
    const { register, handleSubmit, setValue } = useForm();
    const { isAuthenticated, data: { user } } = useSelector((state) => state.auth);

    const menuref = useRef();
    useclickOutside(menuref, () => setmenuOpen(false));

    const handleUpdate = async (data) => {
        try {
            if (!isAuthenticated) {
                toast.error("Please Login to Update Comment");
                return;
            }
            const response = await axios.patch(`http://localhost:8000/comments/c/${comment._id}`, {
                content: data.newContent
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                withCredentials: true
            });
            updateCommentInState(comment._id, { content: data.newContent });
            setisEditing(false);
        } catch (error) {
            toast.error("Unable to update comment");
        }
    };

    const handleDelete = async () => {
        try {
            if (!isAuthenticated) {
                toast.error("You are not authorized to delete this comment");
                return;
            }
            const response = await axios.delete(`http://localhost:8000/comments/c/${comment._id}`, {

                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,

            });
            deleteCommentInState(comment._id);
        } catch (error) {
            toast.error("Unable to delete comment");
        }
    };

    return (
        <div className="flex space-x-4 py-4 group">
            <img
                src={comment?.owner?.avatar}
                alt={comment?.owner?.username}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-white">@{comment?.owner?.username}</p>
                    <span className="text-xs text-gray-400">{getTimeDistanceToNow(comment.createdAt)}</span>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit(handleUpdate)} className="space-y-2">
                        <input
                            {...register("newContent", { required: true })}
                            defaultValue={comment.content}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={() => setisEditing(false)}
                                className="px-4 py-1.5 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-200">{comment.content}</p>
                )}
            </div>

            {comment.owner._id === user._id && (
                <div ref={menuref} className="relative">
                    <button
                        onClick={() => {
                            setmenuOpen((prev) => !prev);
                            setValue("newContent", comment.content);
                        }}
                        className="p-1.5 rounded-full hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-1 w-32 bg-gray-900 rounded-lg shadow-lg border border-gray-700 py-1 z-10">
                            <button
                                onClick={() => setisEditing(true)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800 flex items-center space-x-2"
                            >
                                <Pencil className="w-4 h-4" />
                                <span>Update</span>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-800 flex items-center space-x-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentItem;