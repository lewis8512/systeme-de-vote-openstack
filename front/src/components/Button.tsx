import { clsx } from "clsx";

interface ButtonProps {
    label: string;
    onClick: () => void;
    theme?: "primary" | "secondary";
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, theme = "primary", className }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={clsx(
                "px-6 py-3 px-6 py-3 rounded-lg cursor-pointer transition",
                theme === "primary"
                    ? "text-white bg-blue-500 hover:bg-blue-600"
                    : "border border-blue-500 text-blue-500 bg-white hover:bg-blue-100 hover:text-blue-600",
                className
            )}
        >
            {label}
        </button>
    );
};

export default Button;