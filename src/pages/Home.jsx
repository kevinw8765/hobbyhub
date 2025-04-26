import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { formatDistanceToNow } from 'date-fns';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('created_at');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPosts();
    }, [sortBy]);

    const fetchPosts = async () => {
        setLoading(true);
        
        let query = supabase
          .from('posts')
          .select('*');
        
        // Apply sorting
        if (sortBy === 'created_at') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'upvotes') {
          query = query.order('upvotes', { ascending: false });
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching posts:', error);
        } else {
          setPosts(data);
        }
        
        setLoading(false);
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-2">Welcome to AnimeVerse</h1>
                <p className="text-gray-600 text-center">Join the discussion about your favorite anime!</p>
            </div>
            
            <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full px-4 py-2 border rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                
                <div className="flex items-center">
                <label className="mr-2">Sort by:</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white"
                >
                    <option value="created_at">Latest</option>
                    <option value="upvotes">Most Upvoted</option>
                </select>
                </div>
            </div>
            
            {loading ? (
                <div className="text-center py-8">
                <p className="text-gray-500">Loading posts...</p>
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                <p className="text-gray-500">No posts found. Why not create one?</p>
                <Link to="/create" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg">
                    Create Post
                </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                {filteredPosts.map((post) => (
                    <Link 
                    key={post.id} 
                    to={`/posts/${post.id}`}
                    className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                    >
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold text-indigo-800">{post.title}</h2>
                        <div className="flex items-center text-gray-500">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {post.upvotes}
                        </div>
                    </div>
                    <p className="text-gray-500 mt-2">
                        Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                    </Link>
                ))}
                </div>
            )}
        </div>
    )
}

export default Home