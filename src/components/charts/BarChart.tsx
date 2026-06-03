"use client";

import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

type Datum = { label: string; value: number; n?: number };

function fmtTick(v: number) {
  return v + "%";
}

function ChartTooltip(props: { active?: boolean; payload?: { payload: Datum }[] }) {
  if (!props.active || !props.payload || props.payload.length === 0) return null;
  var d = props.payload[0].payload;
  return (
    <div className="bg-white border border-[#E6E6E6] rounded-lg px-3 py-2 shadow-sm">
      <p className="text-[12px] font-semibold text-[#1A1F35]">{d.label}</p>
      <p className="font-mono text-[12px] text-[#1566FF]">{d.value + "% abnormal"}</p>
      {d.n ? <p className="font-mono text-[10px] text-[#8B95B8]">{"n = " + d.n}</p> : null}
    </div>
  );
}

export function BarChart(props: { data: Datum[]; highlightTop?: boolean }) {
  var data = props.data;
  var maxVal = Math.max.apply(null, data.map(function pick(d) { return d.value; }));
  var height = data.length * 52 + 24;
  return (
    <div style={{ width: "100%", height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} layout="vertical" margin={{ top: 4, right: 48, bottom: 4, left: 8 }} barCategoryGap={14}>
          <CartesianGrid horizontal={false} stroke="#F0F1F5" />
          <XAxis type="number" tickFormatter={fmtTick} domain={[0, Math.ceil(maxVal / 10) * 10]} tick={{ fill: "#8B95B8", fontSize: 11 }} axisLine={{ stroke: "#E6E6E6" }} tickLine={false} />
          <YAxis type="category" dataKey="label" width={150} tick={{ fill: "#475175", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F7F8FC" }} />
          <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={22}>
            {data.map(function renderCell(d, i) {
              var isTop = props.highlightTop === true && d.value === maxVal;
              return <Cell key={i} fill={isTop ? "#C7AA50" : "#1566FF"} />;
            })}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
