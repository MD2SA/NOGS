import ToggleButton from "../atoms/ToggleButton";


export default function OptionSelector({ options, selectedOption, setSelectedOption }) {
    return (
        <>
            {options?.map((option) => (
                <ToggleButton
                    key={option}
                    label={option}
                    isActive={selectedOption === option}
                    onClick={() => setSelectedOption(option)}
                />
            ))}
        </>
    );
}
