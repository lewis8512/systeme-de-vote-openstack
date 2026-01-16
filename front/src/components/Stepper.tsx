import { useEffect, useState } from "react";

interface StepperProps {
    activeStep: number;
}

const steps = [
    { label: "Choix du candidat", step: 1 },
    { label: "Confirmation du choix", step: 2 },
    { label: "Récépissé de vote", step: 3 }
];

const Stepper: React.FC<StepperProps> = ({ activeStep }) => {
    const totalSteps = steps.length;
    const [progressWidth, setProgressWidth] = useState("0%");

    const getStepClass = (activeStep: number, step: number) => {
        if (activeStep > step) return "border-blue-500 bg-blue-500 text-white";
        if (activeStep === step) return "border-blue-500 bg-blue-200 text-blue-600";
        return "border-gray-300 bg-gray-200 text-gray-400";
    };

    useEffect(() => {
        setProgressWidth(`${(100 / totalSteps) * (activeStep - 1)}%`);
    }, [activeStep, totalSteps]);

    return (
        <div className="mx-auto w-full max-w-3xl flex flex-col justify-center mt-8">
            <div className="relative flex items-center justify-between w-full">

                {/* Barre de connexion arrière */}
                <div className="absolute top-1/3 left-[15%] right-[15%] h-1 bg-gray-300 transform -translate-y-1/2"></div>

                {/* Barre de progression */}
                <div
                    className="absolute top-1/3 left-[15%] h-1 bg-blue-500 transform -translate-y-1/2 transition-all duration-500"
                    style={{ width: progressWidth }}
                ></div>

                {/* Étapes */}
                {steps.map(({ step, label }) => (
                    <div key={step} className="relative flex flex-col items-center w-1/3">
                        <div
                            className={`flex items-center justify-center size-14 rounded-full border-4 transition-all duration-500 
                                ${getStepClass(activeStep, step)}`}
                        >
                            {activeStep > step ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className="text-lg font-bold">{step}</span>
                            )}
                        </div>

                        <div
                            className={`mt-3 text-center text-sm font-bold ${activeStep === step ? "text-blue-600" : "text-gray-400"}`}
                        >
                            {label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Stepper;
