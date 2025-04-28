import ControlsButton from "../atoms/ControlsButton";


export default function OptionSelector({ options, selectedOption, setSelectedOption }) {
    return (
        <>
            {options?.map((option) => (
                <ControlsButton
                    key={option}
                    label={option}
                    isActive={selectedOption === option}
                    onClick={() => setSelectedOption(option)}
                />
            ))}
        </>
    );
}
