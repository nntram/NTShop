import React, { useState, useEffect } from "react"
import "./scrollToTop.css"

const ScrollToTop = () => {
    const [showTopBtn, setShowTopBtn] = useState(false)
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                setShowTopBtn(true)
            } else {
                setShowTopBtn(false)
            }
        });
    }, []);
    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <div className="top-to-btm">
            {" "}
            {showTopBtn && (
                <button onClick={goToTop} className="icon-position icon-style">
                    <i className="ri-arrow-up-s-line"></i>
                </button>
            )}{" "}
        </div>
    );
};
export default ScrollToTop