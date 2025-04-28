import ControlsButton from "../atoms/ControlsButton";

export default function ModeSelector({ mode, setMode }) {
    return (
        <>
            <ControlsButton label='words' isActive={mode === 'words'} onClick={() => setMode('words')} />
            <ControlsButton label='time' isActive={mode === 'time'} onClick={() => setMode('time')} />
        </>
    );
}
