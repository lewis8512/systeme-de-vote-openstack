import React from "react";
import { clsx } from "clsx";

type IconButtonProps = {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    theme?: "primary" | "secondary";
    className?: string;
    type?: "button" | "submit" | "reset";
    iconPosition?: "left" | "right";
    disabled?: boolean;
};

export default function IconButton({
    label,
    icon,
    onClick,
    theme = "primary",
    className = "",
    type = "button",
    iconPosition = "left",
    disabled = false,
}: Readonly<IconButtonProps>) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition",
                disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer",
                theme === "primary"
                    ? "text-white bg-blue-500 hover:bg-blue-600"
                    : "border border-blue-500 text-blue-500 bg-white hover:bg-blue-100 hover:text-blue-600",
                className
            )}
        >
            {iconPosition === "left" && icon}
            {label}
            {iconPosition === "right" && icon}
        </button>
    );
}
