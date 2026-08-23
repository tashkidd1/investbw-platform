import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  color = '#2d9568',
  fill = true,
  strokeWidth = 1.5,
}: SparklineProps) {
  const { path, areaPath } = useMemo(() => {
    if (data.length < 2) return { path: '', areaPath: '' };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const points = data.map((v, i) => ({
      x: i * stepX,
      y: height - ((v - min) / range) * (height - strokeWidth * 2) - strokeWidth,
    }));
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;
    return { path, areaPath };
  }, [data, width, height, strokeWidth]);

  const gradientId = useMemo(() => `spark-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={areaPath} fill={`url(#${gradientId})`} />}
      <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

interface AreaChartProps {
  data: { date: string; value: number }[];
  height?: number;
  color?: string;
}

export function AreaChart({ data, height = 200, color = '#2d9568' }: AreaChartProps) {
  const width = 800;
  const { path, areaPath, ticks } = useMemo(() => {
    if (data.length < 2) return { path: '', areaPath: '', ticks: [] };
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const points = data.map((d, i) => ({
      x: i * stepX,
      y: height - ((d.value - min) / range) * (height - 20) - 10,
    }));
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;
    const tickCount = 4;
    const ticks = Array.from({ length: tickCount }, (_, i) => {
      const v = min + (range * i) / (tickCount - 1);
      return { value: v, y: height - ((v - min) / range) * (height - 20) - 10 };
    });
    return { path, areaPath, ticks };
  }, [data, height]);

  const gradientId = 'area-chart-grad';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => (
        <line key={i} x1="0" y1={t.y} x2={width} y2={t.y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}

export function DonutChart({ segments, size = 160, thickness = 24 }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
      {segments.map((s, i) => {
        const pct = (s.value / total) * circumference;
        const circle = (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${pct} ${circumference}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
          />
        );
        offset += pct;
        return circle;
      })}
    </svg>
  );
}

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
              style={{
                height: `${(d.value / max) * 100}%`,
                backgroundColor: d.color || '#2d9568',
              }}
            />
          </div>
          <span className="text-2xs text-neutral-500 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
