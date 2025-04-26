import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const EditPost = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPost();
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
          setTitle(data.title || '');
          setContent(data.content || '');
          setImageUrl(data.image_url || '');
        }
        
        setLoading(false);
    };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        
        if (!title.trim()) {
          setError('Title is required');
          setSaving(false);
          return;
        }
        
        const updates = {
          title,
          content: content.trim() ? content : null,
          image_url: imageUrl.trim() ? imageUrl : null
        };
        
        const { data, error: supabaseError } = await supabase
          .from('posts')
          .update(updates)
          .eq('id', id)
          .select();
        
        if (supabaseError) {
          console.error('Error updating post:', supabaseError);
          setError('Failed to update post. Please try again.');
        } else if (data && data.length > 0) {
          navigate(`/posts/${id}`);
        }
        
        setSaving(false);
    };

    if (loading) {
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading post...</p>
          </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
            
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
                    onClick={() => navigate(`/posts/${id}`)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2"
                    disabled={saving}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
                </div>
            </form>
        </div>
    )
}

export default EditPost