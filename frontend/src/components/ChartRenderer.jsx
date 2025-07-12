import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const ChartRenderer = ({ data, xKey, yKey, chartType, mode = "2d" }) => {
  if (!data || !Array.isArray(data)) return <p>No chart data available.</p>;

  const colorPalette = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#8BC34A", "#F44336"
  ];

  // 2D chart
  if (mode === "2d") {
    const chartMap = { bar: Bar, line: Line, pie: Pie, scatter: Scatter };
    const ChartComp = chartMap[chartType] || Bar;
    const chartData =
      chartType === "scatter"
        ? {
            datasets: [
              {
                label: `${yKey} vs ${xKey}`,
                data: data.map((item) => ({
                  x: Number(item[xKey]) || 0,
                  y: Number(item[yKey]) || 0,
                })),
                backgroundColor: "rgba(75,192,192,0.6)",
              },
            ],
          }
        : {
            labels: data.map((item) => item[xKey]),
            datasets: [
              {
                label: `${yKey} by ${xKey}`,
                data: data.map((item) => Number(item[yKey]) || 0),
                backgroundColor:
                  chartType === "pie"
                    ? colorPalette.slice(0, data.length)
                    : "rgba(75,192,192,0.6)",
                borderColor:
                  chartType === "pie" ? "#fff" : "rgba(75,192,192,1)",
                borderWidth: 1,
              },
            ],
          };
    return <ChartComp data={chartData} options={{ responsive: true }} />;
  }

  // 3D chart
  const barSpacing = 1.5;
  const max = Math.max(...data.map((d) => Number(d[yKey]) || 0));
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 10;
  const visibleData = data.slice(startIndex, startIndex + visibleCount);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const moveLeft = () => {
    if (startIndex > 0) setStartIndex((prev) => prev - 1);
  };
  const moveRight = () => {
    if (startIndex + visibleCount < data.length)
      setStartIndex((prev) => prev + 1);
  };

  const Bar3D = () => (
    <group>
      {visibleData.map((item, i) => {
        const height = (Number(item[yKey]) / max) * 5;
        const isHovered = hoveredIndex === i;

        return (
          <mesh
            key={i}
            position={[i * barSpacing, height / 2, 0]}
            onPointerOver={() => setHoveredIndex(i)}
            onPointerOut={() => setHoveredIndex(null)}
          >
            <boxGeometry args={[1, height, 1]} />
            <meshStandardMaterial color={colorPalette[i % colorPalette.length]} />
            {isHovered && (
              <Html position={[0, height + 0.5, 0]} center>
                <div className="bg-white px-2 py-1 text-sm rounded shadow-md border border-gray-300 text-black transition-opacity duration-300 animate-fade-in">
                  {yKey}: {item[yKey]}
                </div>
              </Html>
            )}
          </mesh>
        );
      })}
    </group>
  );

  const Axes3D = () => (
    <group>
      {/* X Axis Line (fixed) */}
      <mesh position={[visibleCount * barSpacing / 2 - barSpacing / 1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, visibleCount * barSpacing, 12]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Y Axis */}
      <mesh position={[-1, 2.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 5, 12]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Y-Axis Label */}
      <Text
        position={[-2.2, 2.5, 0]}
        fontSize={0.4}
        anchorX="center"
        rotation={[0, 0, Math.PI / 2]}
        color="black"
      >
        {yKey}
      </Text>

      {/* Y Ticks */}
      {[...Array(6)].map((_, i) => {
        const val = Math.round((i / 5) * max);
        return (
          <Text
            key={`y-tick-${i}`}
            position={[-1.3, (i / 5) * 5, 0]}
            fontSize={0.3}
            anchorX="right"
            color="black"
          >
            {val}
          </Text>
        );
      })}
    </group>
  );

  const XTicks = () => (
    <group>
      {visibleData.map((item, i) => (
        <Text
          key={`x-label-${i}`}
          position={[i * barSpacing, -0.6, 0]}
          fontSize={0.3}
          anchorX="center"
          color="black"
        >
          {item[xKey]?.toString().slice(0, 6)}
        </Text>
      ))}
      <Text
        position={[visibleCount * barSpacing / 2 - barSpacing / 2, -1.3, 0]}
        fontSize={0.4}
        anchorX="center"
        color="black"
      >
        {xKey}
      </Text>
    </group>
  );

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Chart Container */}
      <div className="relative w-full bg-white rounded-xl h-[500px]">
        <Canvas camera={{ position: [5, 8, 12], fov: 50 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 10, 10]} intensity={0.8} />
          <OrbitControls enablePan enableZoom enableRotate />
          <group position={[-(visibleCount * barSpacing) / 2 + 0.75, -2, 1]}>
            <Axes3D />
            <Bar3D />
            <XTicks />
          </group>
        </Canvas>

        {/* Transparent Navigation Arrows */}
        <div className="absolute inset-0 pointer-events-none flex justify-between items-center">
          <button
            onClick={moveLeft}
            disabled={startIndex === 0}
            className="text-3xl px-4 text-black disabled:opacity-30 pointer-events-auto"
          >
            ◀
          </button>
          <button
            onClick={moveRight}
            disabled={startIndex + visibleCount >= data.length}
            className="text-3xl px-4 text-black disabled:opacity-30 pointer-events-auto"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartRenderer;
