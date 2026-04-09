'use client';

import { useTranslations } from 'next-intl';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@t1d/ui';

interface GlucoseChartProps {
  /** Glucose readings as serializable data (ISO strings + values) */
  data: { time: string; value: number }[];
}

// In-range band: 70-180 mg/dL (standard T1D target)
const TARGET_LOW = 70;
const TARGET_HIGH = 180;

export function GlucoseChart({ data }: GlucoseChartProps) {
  const t = useTranslations('patientDetail');

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('glucoseTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">{t('noGlucoseData')}</p>
        </CardContent>
      </Card>
    );
  }

  // Downsample to ~500 points for chart performance (every Nth point)
  const maxPoints = 500;
  const step = Math.max(1, Math.floor(data.length / maxPoints));
  const chartData = data.filter((_, i) => i % step === 0).map((d) => ({
    time: new Date(d.time).getTime(),
    value: d.value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('glucoseTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(ts: number) => {
                  const d = new Date(ts);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                domain={[40, 350]}
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 11 }}
                width={40}
              />
              <Tooltip
                labelFormatter={(ts: number) => new Date(ts).toLocaleString()}
                formatter={(value: number) => [`${value} mg/dL`, t('glucose')]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--card-foreground))',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
              />
              <ReferenceLine y={TARGET_LOW} stroke="hsl(var(--chart-2))" strokeDasharray="4 4" />
              <ReferenceLine y={TARGET_HIGH} stroke="hsl(var(--chart-3))" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 bg-[hsl(var(--chart-2))]" /> {TARGET_LOW} mg/dL
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 bg-[hsl(var(--chart-3))]" /> {TARGET_HIGH} mg/dL
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
