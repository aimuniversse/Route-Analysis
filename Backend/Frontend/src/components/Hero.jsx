import React from "react";
import SearchBox from "./SearchBox";
import "../styles/hero.css";

const Hero = ({ onResults }) => {
    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-text animate-slide-up">
                    <h1>
                        Next-Gen  <span>Route Analysis AI</span>
                    </h1>
                    <p className="animate-fade delay-1">
                        Our AI analyzes more than 1000+ routes and finds the best option .
                    </p>
                </div>

                <div className="animate-slide-up delay-2">
                    <SearchBox onResults={onResults} />
                </div>
            </div>
        </section>
    );
};

export default Hero;