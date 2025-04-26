import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();


    return (
        <nav className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-indigo-800'} text-white shadow-lg transition-colors duration-200`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                <Link to="/" className="text-2xl font-bold">AnimeVerse</Link>
                <div className="flex items-center space-x-4">
                    <button 
                    onClick={toggleTheme} 
                    className="p-2 rounded-full hover:bg-opacity-20 hover:bg-white"
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                    {theme === 'light' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                    </button>
                    <Link to="/" className="hover:text-indigo-200 transition">Home</Link>
                    <Link to="/create" className={`${theme === 'dark' ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'} px-4 py-2 rounded-lg transition`}>Create Post</Link>
                </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;