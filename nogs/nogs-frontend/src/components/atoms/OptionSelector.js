
export default function OptionSelector({ options, selectedOption, setSelectedOption }) {
    return (
        <>
            {options?.map((option) => (
                <button
                    key={option}
                    className={`toggle-button ${selectedOption === option ? 'active' : ''}`}
                    onClick={() => setSelectedOption(option)}
                    tabIndex={-1} // se nao quiser que a tab ande de uma lado para outro
                >
                    {option}
                </button>
            ))}
        </>
    );
}
