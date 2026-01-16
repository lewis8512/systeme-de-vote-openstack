interface SubmitButtonProps {
    text: string;
    disabled?: boolean;
}

export default function SubmitButton({ text , disabled}: Readonly<SubmitButtonProps>) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="mx-auto block w-1/2 mt-2 px-6 py-3 rounded-lg font-medium text-white transition bg-blue-500 hover:bg-blue-600 cursor-pointer"
        >
            {text}
        </button>
    );
}