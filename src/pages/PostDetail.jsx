import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { formatDistanceToNow } from 'date-fns';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [id]);

    const fetchPost = async () => {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching post:', error);
          navigate('/');
        } else {
          setPost(data);
        }
        
        setLoading(false);
    };
    
      const fetchComments = async () => {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching comments:', error);
        } else {
          setComments(data);
        }
    };

    const handleUpvote = async () => {
        if (!post) return;
        
        const newUpvotes = post.upvotes + 1;
        
        const { data, error } = await supabase
          .from('posts')
          .update({ upvotes: newUpvotes })
          .eq('id', id)
          .select();
        
        if (error) {
          console.error('Error upvoting post:', error);
        } else if (data && data.length > 0) {
          setPost({ ...post, upvotes: newUpvotes });
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) return;
        
        const { data, error } = await supabase
          .from('comments')
          .insert([{ post_id: id, content: newComment }])
          .select();
        
        if (error) {
          console.error('Error adding comment:', error);
        } else if (data && data.length > 0) {
          setComments([data[0], ...comments]);
          setNewComment('');
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this post?')) {
          const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);
          
          if (error) {
            console.error('Error deleting post:', error);
          } else {
            navigate('/');
          }
        }
    };
    
    if (loading) {
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading post...</p>
          </div>
        );
    }

    if (!post) {
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Post not found</p>
          </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-indigo-800">{post.title}</h1>
                <div className="flex space-x-2">
                    <button 
                    onClick={() => navigate(`/edit/${id}`)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                    >
                    Edit
                    </button>
                    <button 
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                    Delete
                    </button>
                </div>
                </div>
                
                <p className="text-gray-500 mb-4">
                Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
                
                {post.content && (
                <div className="prose mb-6 text-gray-700">
                    {post.content}
                </div>
                )}
                
                {post.image_url && (
                <div className="mb-6">
                    <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full max-h-96 object-cover rounded-lg"
                    />
                </div>
                )}
                
                <div className="flex items-center">
                <button 
                    onClick={handleUpvote}
                    className="flex items-center bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-4 py-2 rounded-lg"
                >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    Upvote ({post.upvotes})
                </button>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Comments</h2>
                
                <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                    rows="3"
                    placeholder="Add a comment..."
                    className="w-full p-2 border rounded-lg mb-2"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                ></textarea>
                <button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                    Post Comment
                </button>
                </form>
                
                {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4">
                        <p className="text-gray-700">{comment.content}</p>
                        <p className="text-gray-500 text-sm mt-1">
                        Posted {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </p>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    )
}

export default PostDetail