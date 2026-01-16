import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, TooltipItem } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface BarChartProps {
    candidates: { name: string; votes: number; color: string }[];
}

const BarChart: React.FC<BarChartProps> = ({ candidates }) => {
    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

    const data = {
        labels: candidates.map(c => c.name),
        datasets: [
            {
                data: candidates.map(c => c.votes),
                backgroundColor: candidates.map(c => c.color),
                borderRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Nombre de votes" },
                ticks: {
                    callback: function (tickValue: string | number) {
                        return typeof tickValue === "number" && Number.isInteger(tickValue) ? tickValue : null; // Affiche uniquement les entiers
                    },
                },
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem<'bar'>) => {
                        const value = tooltipItem.raw as number | undefined;

                        if (value === undefined) {
                            return "0 votes (0.0%)";
                        }

                        const percentage = totalVotes > 0 ? ((value / totalVotes) * 100).toFixed(1) : "0.0";
                        return `${value.toLocaleString()} votes (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="w-full h-[46vh]">
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
