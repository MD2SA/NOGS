import { useState } from 'react';
import { useEffect } from 'react';
import Modal from "../atoms/Modal";

export default function AcknowledgeCompetitions({ isOpen, onClose, data }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
        if (currentIndex + 1 >= data.length) {
            onClose(currentIndex + 1);
            return;
        }
        setCurrentIndex(prev => prev + 1);
    };

    if (!data || data.length === 0) return null;

    const currentItem = data[currentIndex];

    return (
        <Modal isOpen={data && data.length !== 0 && isOpen}>
            <div className="swiper-modal-content">
                <button className="close-button" onClick={onClose}>
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
        </Modal>
    );
}
