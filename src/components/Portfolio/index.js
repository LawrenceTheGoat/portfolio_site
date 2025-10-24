import React, { useEffect, useState } from "react";
import Loader from "react-loaders";
import AnimatedLetters from "../AnimatedLetters";
import "./index.scss";
import portfolioData from '../../data/portfolio.json';

const Portfolio = () => { 
    const [letterClass, setLetterClass] = useState('text-animate');
    const [portfolio, setPortfolio] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLetterClass('text-animate-hover');
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    });

    useEffect(() => {
        // Use local static data instead of Firestore
        setPortfolio(portfolioData.portfolio || []);
    }, []);

    const renderPortfolio = (portfolio) => {
        return (
            <div className="images-container">
                {
                    portfolio.map((port, idx) => {
                        // support per-item scaling via `scale` (number) in portfolio.json
                        const imgStyle = {};
                        if (port.scale && typeof port.scale === 'number') {
                            imgStyle.transform = `scale(${port.scale})`;
                            imgStyle.transformOrigin = 'center top';
                        }

                        return (
                            <div className="image-box" key={idx}>
                                <img 
                                src={port.cover || port.image}
                                className="portfolio-image"
                                alt={port.title || port.name || 'portfolio'}
                                loading="lazy"
                                style={imgStyle}
                                />
                                <div className="content">
                                    <p className="title">{port.title || port.name}</p>
                                    <h4 className="description">{port.description}</h4>
                                        <div style={{display: 'flex', gap: '10px'}}>
                                            <button
                                                className="btn github-btn"
                                                onClick={() => window.open(port.url, '_blank', 'noopener')}
                                                aria-label="View on GitHub"
                                                title="View on GitHub"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.73-1.3-1.73-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.19-3.07-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 012.9-.39c.98.01 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.82 1.19 3.07 0 4.39-2.69 5.36-5.25 5.64.42.36.8 1.07.8 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.55A11.52 11.52 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/>
                                                </svg>
                                            </button>
                                            {port.demo && (
                                                <button
                                                    className="btn"
                                                    onClick={() => window.open(port.demo, '_blank', 'noopener,noreferrer')}
                                                >Demo Video</button>
                                            )}
                                        </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }


    return (
        <>
            <div className="container portfolio-page">
                <h1 className="page-title">
                    <AnimatedLetters
                        letterClass={letterClass}
                        strArray={"Portfolio".split("")}
                        idx={15}
                    />
                </h1>
                <div>{renderPortfolio(portfolio)}</div>
            </div>
            <Loader type="pacman" />
        </>
    );
}

export default Portfolio;