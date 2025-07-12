import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
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

const ChartRenderer = ({ data, xKey, yKey, chartType, mode = "2d", onCanvasReady }) => {
  if (!data || !Array.isArray(data)) return <p>No chart data available.</p>;

  const colorPalette = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#8BC34A", "#F44336"
  ];

  // ===== 2D Chart =====
  if (mode === "2d") {
    const chartMap = { bar: Bar, line: Line, pie: Pie, scatter: Scatter };
    const ChartComp = chartMap[chartType] || Bar;
    const chartData =
      chartType === "scatter"
        ? {
            datasets: [{
              label: `${yKey} vs ${xKey}`,
              data: data.map((item) => ({
                x: Number(item[xKey]) || 0,
                y: Number(item[yKey]) || 0,
              })),
              backgroundColor: "rgba(75,192,192,0.6)",
            }],
          }
        : {
            labels: data.map((item) => item[xKey]),
            datasets: [{
              label: `${yKey} by ${xKey}`,
              data: data.map((item) => Number(item[yKey]) || 0),
              backgroundColor:
                chartType === "pie"
                  ? colorPalette.slice(0, data.length)
                  : "rgba(75,192,192,0.6)",
              borderColor:
                chartType === "pie" ? "#fff" : "rgba(75,192,192,1)",
              borderWidth: 1,
            }],
          };
    return <ChartComp data={chartData} options={{ responsive: true }} />;
  }

  // ===== 3D Setup =====
  const barSpacing = 1.5;
  const max = Math.max(...data.map((d) => Number(d[yKey]) || 0));
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 11;
  const visibleData = data.slice(startIndex, startIndex + visibleCount);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const canvasRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (canvasRef.current && onCanvasReady) {
        const canvas = canvasRef.current.querySelector("canvas");
        if (canvas) onCanvasReady(canvas);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [onCanvasReady]);

  const moveLeft = () => {
    if (startIndex > 0) setStartIndex((prev) => prev - 1);
  };
  const moveRight = () => {
    if (startIndex + visibleCount < data.length)
      setStartIndex((prev) => prev + 1);
  };

  // ===== 3D Pie Chart =====
  const Pie3D = () => {
    const radius = 5;
    const height = 1.5;
    const total = data.reduce((sum, item) => sum + (Number(item[yKey]) || 0), 0);
    let startAngle = 0;

    return (
      <group position={[0, 0.5, 0]}>
        {data.map((item, index) => {
          const value = Number(item[yKey]) || 0;
          const angle = (value / total) * Math.PI * 2;
          const midAngle = startAngle + angle / 2;
          const labelX = Math.cos(midAngle) * (radius * 0.6);
          const labelZ = Math.sin(midAngle) * (radius * 0.6);
          const geometry = new THREE.CylinderGeometry(
            radius,
            radius,
            height,
            32,
            1,
            false,
            startAngle,
            angle
          );
          const color = colorPalette[index % colorPalette.length];
          const isHovered = hoveredIndex === index;

          const slice = (
            <group key={index}>
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                onPointerOver={() => setHoveredIndex(index)}
                onPointerOut={() => setHoveredIndex(null)}
              >
                <primitive object={geometry} attach="geometry" />
                <meshStandardMaterial color={color} />
              </mesh>

              {isHovered && (
                <Html position={[labelX, height + 0.3, labelZ]} center>
                  <div
                    className={`text-sm font-semibold text-center animate-fade-in pointer-events-none px-3 py-1 rounded-md border shadow-md`}
                    style={{
                      color,
                      backgroundColor: "#fff",
                      borderColor: color,
                    }}
                  >
                    {item[xKey]} <br />
                    {yKey}: {item[yKey]}
                  </div>
                </Html>
              )}
            </group>
          );

          startAngle += angle;
          return slice;
        })}
      </group>
    );
  };

  // ===== Other 3D Charts =====
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
                <div className="bg-white px-2 py-1 text-sm rounded shadow-md border border-gray-300 text-black">
                  {yKey}: {item[yKey]}
                </div>
              </Html>
            )}
          </mesh>
        );
      })}
    </group>
  );

  const Line3D = () => {
    const points = visibleData.map((item, i) => {
      const x = i * barSpacing;
      const y = (Number(item[yKey]) / max) * 5;
      return [x, y, 0];
    });

    return (
      <group>
        {/* Line Path */}
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flat())}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="blue" />
        </line>

        {/* Points with Hover Tooltip */}
        {points.map(([x, y], i) => {
          const isHovered = hoveredIndex === i;
          return (
            <group key={i}>
              <mesh
                position={[x, y, 0]}
                onPointerOver={() => setHoveredIndex(i)}
                onPointerOut={() => setHoveredIndex(null)}
                scale={isHovered ? 1.3 : 1}
              >
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="red" />
                {isHovered && (
                  <Html position={[0, 0.5, 0]} center>
                    <div
                      className="text-sm font-semibold px-2 py-1 bg-white rounded shadow border border-gray-300 text-black animate-pulse"
                      style={{ transform: "translateY(-20%)" }}
                    >
                      {yKey}: {visibleData[i][yKey]}
                    </div>
                  </Html>
                )}
              </mesh>
            </group>
          );
        })}
      </group>
    );
  };


  const Scatter3D = () => (
    <group>
      {visibleData.map((item, i) => {
        const x = i * barSpacing;
        const y = (Number(item[yKey]) / max) * 5;
        const z = Math.random() * 3;
        const isHovered = hoveredIndex === i;

        return (
          <group key={i}>
            <mesh
              position={[x, y, z]}
              onPointerOver={() => setHoveredIndex(i)}
              onPointerOut={() => setHoveredIndex(null)}
              scale={isHovered ? 1.2 : 1}
            >
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color={colorPalette[i % colorPalette.length]} />
              {isHovered && (
                <Html position={[0, 0.5, 0]} center>
                  <div className="bg-white px-2 py-1 text-sm font-semibold rounded shadow border border-gray-300 text-black animate-pulse">
                    {yKey}: {item[yKey]}
                  </div>
                </Html>
              )}
            </mesh>
          </group>
        );
      })}
    </group>
);


  const Axes3D = () => (
    <group>
      <mesh position={[visibleCount * barSpacing / 2 - barSpacing / 1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, visibleCount * barSpacing, 12]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-1, 2.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 5, 12]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <Text position={[-2.2, 2.5, 0]} fontSize={0.4} anchorX="center" rotation={[0, 0, Math.PI / 2]} color="black">
        {yKey}
      </Text>
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
      <div className="relative w-full bg-white rounded-xl h-[500px]" ref={canvasRef}>
        <Canvas
          gl={{ preserveDrawingBuffer: true, alpha: false }}
          onCreated={({ gl }) => gl.setClearColor("#ffffff", 1)}
          camera={{ position: [5, 8, 12], fov: 50 }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 10, 10]} intensity={0.8} />
          <OrbitControls enablePan enableZoom enableRotate />
          {chartType === "pie" ? (
            <group position={[0, -1, 0]}>
              <Pie3D />
            </group>
          ) : (
            <group scale={[1.0, 1.0, 1.0]} position={[-(visibleCount * barSpacing) / 2 + 0.75, -2, 0]}>
              <Axes3D />
              {chartType === "bar" && <Bar3D />}
              {chartType === "line" && <Line3D />}
              {chartType === "scatter" && <Scatter3D />}
              <XTicks />
            </group>
          )}
        </Canvas>

        {chartType !== "pie" && (
          <div className="inset-0 pointer-events-none flex justify-between items-center">
            <button
              onClick={moveLeft}
              disabled={startIndex === 0}
              className="text-3xl -px-8 text-black disabled:opacity-30 pointer-events-auto"
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
        )}
      </div>
    </div>
  );
};

export default ChartRenderer;