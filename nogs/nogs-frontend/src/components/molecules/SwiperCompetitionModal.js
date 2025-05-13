import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

export default function SwiperCompetitionModal({ isOpen, onClose, data }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.classList.add("modal-open");
        } else {
            document.body.style.overflow = "auto";
            document.body.classList.remove("modal-open");
        }

        return () => {
            document.body.style.overflow = "auto";
            document.body.classList.remove("modal-open");
        };
    }, [isOpen]);

    const goToNext = () => {
        if (currentIndex + 1 >= data.length) {
            onClose(currentIndex+1);
            return;
        }
        setCurrentIndex(prev => prev + 1);
    };

    if (!data || data.length === 0 || !isOpen) return null;

    const currentItem = data[currentIndex];

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-content swiper-content">
                <button
                    className="modal-close-button"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    &times;
                </button>

                <div className="swiper-slide">
                    <h3>Competition #{currentItem.competition}</h3>
                    <p>WPM: {currentItem.wpm}</p>
                    <p>Accuracy: {currentItem.accuracy}%</p>
                    <p>Position: {currentIndex + 1} of {data.length}</p>
                </div>

                <div className="swiper-navigation">
                    <button
                        onClick={goToNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
