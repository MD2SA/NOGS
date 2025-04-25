export default function ToggleButton({ label, isActive, onClick }) {
    return (
        <button
            className={`toggle-button ${isActive ? 'active' : ''}`}
            onClick={onClick}
            // tabIndex={-1} // se nao quiser que a tab ande de uma lado para outro
        >
            {label}
        </button>
    );
}
