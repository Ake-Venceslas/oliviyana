"use client";

import { Ellipsis } from "lucide-react";
import Link from "next/link";

// Props: graphComponent, value, label, subLabel, diffLabel, diffColor


type StatCardProps = {
  graph: React.ReactNode;
  value: number;
  label: string;
  subLabel: string;
  diffLabel: string;
  diffColor: string;
};

export function StatCard({
  graph,
  value,
  label,
  subLabel,
  diffLabel,
  diffColor,
}: StatCardProps) {
  return (
    <div className="w-full h-full bg-white p-6 shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">{subLabel}</h5>
        <Link href="" className="text-gray-400 hover:text-gray-600 transition-colors">
          <Ellipsis size={18} />
        </Link>
      </div>
      <div className="flex items-center justify-between gap-6">
        <div className="flex-shrink-0 h-20 flex items-center justify-center">
          {graph}
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{label}</p>
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${diffColor}`}>
            {diffLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
