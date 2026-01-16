import { TrophyIcon } from "lucide-react";

interface CandidateResultProps {
    name: string,
    party: string,
    votes: number,
    percentage: string,
    color: string,
    isWinner: boolean,
}

const CandidateResult: React.FC<CandidateResultProps> = ({ name, party, votes, percentage, color, isWinner }) => {
    return (
        <div className="flex items-center w-full py-2">

            <div className="w-2 h-12 rounded-l-lg shrink-0" style={{ backgroundColor: color }}></div>

            <div className="flex flex-col pl-3 min-w-1/4">
                <div className="flex items-center space-x-2">
                    <span className="font-bold">{name}</span>
                    {isWinner && <TrophyIcon className="text-yellow-500 shrink-0" size={18} />}
                </div>
                <span className="text-gray-500 text-sm">{party}</span>
            </div>

            <div className="flex items-center flex-grow space-x-3">
                <div className="relative flex-grow bg-gray-200 rounded-full h-3">
                    <div
                        className="absolute left-0 h-3 rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                    ></div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="font-bold text-gray-900">{percentage}%</span>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{votes} votes</span>
                </div>
            </div>
        </div>
    );
};

export default CandidateResult;
