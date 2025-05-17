import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="notFoundContainer">
            <div className="notFoundHero">
                <h1>404</h1>
                <h2>Lost in the Void</h2>
                <p>
                    The page you're seeking has drifted into the abyss.
                    <br />
                    Perhaps it never existed—or was consumed by the darkness.
                </p>

                <button
                    className="notFoundButton"
                    onClick={() => navigate('/')}
                >
                    Return to Safety
                </button>
            </div>

            <div className="particles">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="particle" style={{
                        '--size': `${Math.random() * 4 + 2}px`,
                        '--delay': `${Math.random() * 5}s`,
                        '--duration': `${Math.random() * 10 + 10}s`,
                        '--x': `${Math.random() * 100}%`,
                        '--y': `${Math.random() * 100}%`,
                    }} />
                ))}
            </div>
        </div>
    );
};

export default NotFound;
