export const ProgressBar = ({ currentStep, totalSteps, className = "" }: { currentStep: number, totalSteps: number, className?: string }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className={`w-full h-2 bg-white/10 rounded-full overflow-hidden ${className}`}>
            <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};
