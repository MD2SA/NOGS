import ToggleButton from "../atoms/ToggleButton";

export default function ModeSelector({ mode, setMode }) {
    return (
        <>
            <ToggleButton label='words' isActive={mode === 'words'} onClick={() => setMode('words')} />
            <ToggleButton label='time' isActive={mode === 'time'} onClick={() => setMode('time')} />
        </>
    );
}
