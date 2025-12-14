import {
  AreaChart,
  Area,
  Line,
  ResponsiveContainer,
  YAxis,
  DotProps,
} from "recharts";

interface CustomDotProps extends DotProps {
  index: number;
  data: any[];
  stroke: string;
  payload: string;
}

// Offline graph
const offlineLineData = [
  { name: "Premier", value: 50 },
  { name: "Deuxième", value: 40 },
  { name: "Troisième", value: 60 },
  { name: "Quatrième", value: 30 },
  // last point
];

// Custom dot renderer for the end point only
function RedEndDot(props: CustomDotProps) {
  const { cx, cy, index, payload, data } = props;
  if (index === data.length - 1) {
    return (
      <g key={`red-dot-${index}`}>
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill="#ff6a6a"
          stroke={props.stroke}
          strokeWidth={1}
        />
      </g>
    );
  }
  return (
    <g key={`red-dot-hidden-${index}`}>
      <circle
        cx={cx}
        cy={cy}
        r={0} // radius 0 (hidden)
        fill="transparent"
        stroke="none"
      />
    </g>
  );
}

export function OfflineGraph() {
  return (
    <ResponsiveContainer width={110} height={100}>
      <AreaChart data={offlineLineData}>
        <YAxis domain={["auto", "auto"]} hide />
        <defs>
          <linearGradient id="colorOffline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff6a6a" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#ff6a6a" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Area drawn first */}
        <Area
          type="monotone"
          dataKey="value"
          stroke="none"
          fill="url(#colorOffline)"
          fillOpacity={1}
        />
        {/* Line drawn above */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#ff6a6a"
          strokeWidth={2}
          dot={(props) =>
            RedEndDot({ ...props, data: offlineLineData, stroke: "#ff6a6a" })
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function BlueEndDot(props: CustomDotProps) {
  const { cx, cy, index, data } = props;
  if (index === data.length - 1) {
    return (
      <g key={`blue-dot-${index}`}>
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill="#2dd6c1"
          stroke={props.stroke}
          strokeWidth={1}
        />
      </g>
    );
  }
  return (
    <g key={`blue-dot-hidden-${index}`}>
      <circle
        cx={cx}
        cy={cy}
        r={0} // radius 0 (hidden)
        fill="transparent"
        stroke="none"
      />
    </g>
  );
}
// Online graph
const onlineLineData = [
  { name: "Lun", value: 15 },
  { name: "Mar", value: 7 },
  { name: "Mer", value: 18 },
  { name: "Jeu", value: 40 }, // last point
];
export function OnlineGraph() {
  return (
    <ResponsiveContainer width={110} height={100}>
      <AreaChart data={onlineLineData}>
        <YAxis domain={["auto", "auto"]} hide />
        <defs>
          <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1.1">
            <stop offset="5%" stopColor="#2dd6c1" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#2dd6c1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="none"
          fill="url(#colorOnline)"
          fillOpacity={1}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2dd6c1"
          strokeWidth={2}
          dot={(props) =>
            BlueEndDot({ ...props, data: offlineLineData, stroke: "#2dd6c1" })
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function DBlueEndDot(props: CustomDotProps) {
  const { cx, cy, index, data } = props;
  if (index === data.length - 1) {
    return (
      <g key={`dblue-dot-${index}`}>
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill="#2d52d6"
          stroke={props.stroke}
          strokeWidth={1}
        />
      </g>
    );
  }
  return (
    <g key={`dblue-dot-hidden-${index}`}>
      <circle
        cx={cx}
        cy={cy}
        r={0} // radius 0 (hidden)
        fill="transparent"
        stroke="none"
      />
    </g>
  );
}
// Lab graph
const labLineData = [
  { name: "Lun", value: 4 },
  { name: "Mar", value: 4 },
  { name: "Mer", value: 4 },
  { name: "Jeu", value: 4 }, // last point
];
export function LabGraph() {
  return (
    <ResponsiveContainer width={110} height={100}>
      <AreaChart data={labLineData}>
        <YAxis domain={["auto", "auto"]} hide />
        <defs>
          <linearGradient id="colorLab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2d52d6" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#2d52d6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="none"
          fill="url(#colorLab)"
          fillOpacity={1}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2d52d6"
          strokeWidth={2}
          dot={(props) =>
            DBlueEndDot({ ...props, data: offlineLineData, stroke: "#2d52d6" })
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
