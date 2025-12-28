import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import Login from "./Login";
import "./App.css";

interface HistoryEntry {
  temperature: number;
  time: string;
}

interface SensorData {
  id: number;
  temperature: number;
  online: boolean;
  history: HistoryEntry[];
  showTable: boolean;
}

export default function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("auth") === "true");
  const [sensors, setSensors] = useState<SensorData[]>([]);

  useEffect(() => {
    if (!isAuth) return;
    if (sensors.length === 0) {
      setSensors(
        Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          temperature: 0,
          online: true,
          history: [],
          showTable: false,
        }))
      );
    }

    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          const newTemp = +(20 + Math.random() * 30).toFixed(1);
          const time = new Date().toLocaleTimeString().slice(3, 8);
          const newHistory = [...sensor.history, { temperature: newTemp, time }];
          if (newHistory.length > 20) newHistory.shift();
          return {
            ...sensor,
            temperature: newTemp,
            online: Math.random() > 0.05,
            history: newHistory,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isAuth, sensors.length]);

  if (!isAuth) return <Login onLogin={() => setIsAuth(true)} />;

  const checkTemperature = (t: number) => t < 15 || t > 50;
  const tempDomain: [number, number] = [10, 60];

  const toggleTable = (id: number) => {
    setSensors((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, showTable: !s.showTable } : s
      )
    );
  };

  return (
    <div className="page">
      <div className="card dashboard center">
        <h1>🌡 ESP Temperature Monitoring</h1>

        <div className="grid">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="sensor">
              <h3>ESP #{sensor.id}</h3>
              <p className="temperature">
                🌡 Temperature: <strong>{sensor.temperature} °C</strong>
                {checkTemperature(sensor.temperature) && (
                  <span className="warning"> ⚠ Out of range!</span>
                )}
              </p>
              <span
                className={sensor.online ? "status online" : "status offline"}
              >
                {sensor.online ? "Online" : "Offline"}
              </span>

              <div className="charts">
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={sensor.history}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={tempDomain} />
                    <Tooltip />
                    <ReferenceLine
                      y={15}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                      label="Min"
                    />
                    <ReferenceLine
                      y={50}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                      label="Max"
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#f97316"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <button onClick={() => toggleTable(sensor.id)}>
                {sensor.showTable ? "Hide Table" : "Show Table"}
              </button>

              {sensor.showTable && (<div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Temperature °C</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensor.history
                        .slice()
                        .reverse()
                        .map((entry, idx) => (
                          <tr key={idx}>
                            <td>{entry.time}</td>
                            <td
                              className={
                                checkTemperature(entry.temperature)
                                  ? "warning"
                                  : ""
                              }
                            >
                              {entry.temperature}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("auth");
            setIsAuth(false);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}