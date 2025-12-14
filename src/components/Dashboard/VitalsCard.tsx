"use client";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { HeartPulse, ActivitySquare, Heart } from "lucide-react";

const vitalsData = [
  {
    title: "Fréquence Cardiaque",
    value: 120,
    unit: "bpm",
    color: "bg-blue-500",
    icon: HeartPulse,
    chartData: [
      { value: 100 }, { value: 110 }, { value: 105 }, { value: 120 }, { value: 118 }
    ],
    lineColor: "#fff",
  },
  {
    title: "Tension Artérielle",
    value: "121/75",
    unit: "mmHg",
    color: "bg-purple-400",
    icon: Heart,
    chartData: [
      { value: 110 }, { value: 120 }, { value: 121 }, { value: 119 }, { value: 121 }
    ],
    lineColor: "#fff",
  },
  {
    title: "Fréquence Respiratoire",
    value: 12,
    unit: "Resp/min",
    color: "bg-emerald-500",
    icon: ActivitySquare,
    chartData: [
      { value: 10 }, { value: 12 }, { value: 11 }, { value: 12 }, { value: 13 }
    ],
    lineColor: "#fff",
  },
];

export default function VitalsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {vitalsData.map((card, i) => (
        <div key={i} className={`rounded-xl shadow-md p-6 text-white ${card.color}`}>
          <div className="flex items-center gap-4 mb-2">
            <card.icon size={24} />
            <span className="text-lg font-semibold">{card.title}</span>
          </div>
          <ResponsiveContainer width="100%" height={40}>
            <LineChart data={card.chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={card.lineColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2">
            <span className="text-3xl font-bold">{card.value}</span>
            <span className="text-base ml-1 font-medium">{card.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
