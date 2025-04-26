import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        if (!title.trim()) {
          setError('Title is required');
          setLoading(false);
          return;
        }
        
        const newPost = {
          title,
          content: content.trim() ? content : null,
          image_url: imageUrl.trim() ? imageUrl : null
        };
        
        const { data, error: supabaseError } = await supabase
          .from('posts')
          .insert([newPost])
          .select();
        
        if (supabaseError) {
          console.error('Error creating post:', supabaseError);
          setError('Failed to create post. Please try again.');
        } else if (data && data.length > 0) {
          navigate(`/posts/${data[0].id}`);
        }
        
        setLoading(false);
    };
    
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
            
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="title">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    className="w-full p-2 border rounded-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                </div>
                
                <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="content">
                    Content (optional)
                </label>
                <textarea
                    id="content"
                    rows="6"
                    className="w-full p-2 border rounded-lg"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                </div>
                
                <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="imageUrl">
                    Image URL (optional)
                </label>
                <input
                    type="url"
                    id="imageUrl"
                    className="w-full p-2 border rounded-lg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                />
                {imageUrl.trim() && (
                    <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Image preview:</p>
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-h-40 rounded-lg"
                        onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                        }}
                    />
                    </div>
                )}
                </div>
                
                <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
                </div>
            </form>
        </div>
    )
}

export default CreatePost