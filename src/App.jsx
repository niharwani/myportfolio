import React, { useState } from "react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const mockPortfolio = [
  { ticker: "AAPL", name: "Apple Inc.", price: 175.32, change: 1.23, holdings: 25 },
  { ticker: "GOOGL", name: "Alphabet Inc.", price: 2821.12, change: -0.45, holdings: 10 },
  { ticker: "TSLA", name: "Tesla Inc.", price: 785.22, change: 2.75, holdings: 15 },
];

const stockPerformance = {
  AAPL: [
    { time: "Mon", value: 170 },
    { time: "Tue", value: 172 },
    { time: "Wed", value: 174 },
    { time: "Thu", value: 175 },
    { time: "Fri", value: 175.32 },
  ],
  GOOGL: [
    { time: "Mon", value: 2780 },
    { time: "Tue", value: 2795 },
    { time: "Wed", value: 2810 },
    { time: "Thu", value: 2820 },
    { time: "Fri", value: 2821.12 },
  ],
  TSLA: [
    { time: "Mon", value: 765 },
    { time: "Tue", value: 770 },
    { time: "Wed", value: 775 },
    { time: "Thu", value: 780 },
    { time: "Fri", value: 785.22 },
  ],
};

export default function PortfolioApp() {
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const [darkMode, setDarkMode] = useState(false);
  const [stage, setStage] = useState("landing");
  const [username, setUsername] = useState("");

  const totalValue = portfolio.reduce((acc, stock) => acc + stock.price * stock.holdings, 0);
  const pieData = portfolio.map((stock) => ({ name: stock.ticker, value: stock.price * stock.holdings }));
  const COLORS = ["#00bcd4", "#2196f3", "#ffc107", "#4caf50", "#ff5722"];

  if (stage === "landing") {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <h1 className="text-4xl font-bold mb-6">📈 MyPortfolio Dashboard</h1>
        <p className="mb-4 text-center">Manage and visualize your stock portfolio in a clean, interactive dashboard.</p>
        <button className="p-2 bg-blue-500 rounded text-white" onClick={() => setStage("login")}>Get Started</button>
      </div>
    );
  }

  if (stage === "login") {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded mb-4 text-black"
        />
        <button className="p-2 bg-blue-500 rounded text-white disabled:opacity-50" onClick={() => setStage("dashboard")} disabled={!username}>Continue</button>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen p-6 space-y-6 transition-colors`}>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📊 {username}'s Portfolio</h1>
        <button className="p-2 bg-blue-500 rounded text-white" onClick={() => setDarkMode(!darkMode)}>{darkMode ? "Light Mode" : "Dark Mode"}</button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl shadow">
          <h2 className="text-xl font-semibold">Portfolio Value</h2>
          <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
        </div>
        <div className="p-4 border rounded-xl shadow">
          <h2 className="text-xl font-semibold">Stock Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={60}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 border rounded-xl shadow">
          <h2 className="text-xl font-semibold">Add Stock (Mock)</h2>
          <button className="p-2 mt-2 bg-green-500 rounded text-white" onClick={() => {
            const newStock = {
              ticker: "NFLX",
              name: "Netflix Inc.",
              price: 510.33,
              change: 1.15,
              holdings: 5
            };
            setPortfolio([...portfolio, newStock]);
            setSelectedTicker("NFLX");
            stockPerformance["NFLX"] = [
              { time: "Mon", value: 500 },
              { time: "Tue", value: 502 },
              { time: "Wed", value: 507 },
              { time: "Thu", value: 509 },
              { time: "Fri", value: 510.33 },
            ];
          }}>Add Netflix</button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Stocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((stock) => (
            <motion.div key={stock.ticker} whileHover={{ rotateY: 5, scale: 1.05 }} transition={{ duration: 0.3 }} className="p-4 border rounded-xl shadow hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => setSelectedTicker(stock.ticker)}>
              <h3 className="text-xl font-bold">{stock.name} ({stock.ticker})</h3>
              <p>Price: ${stock.price} ({stock.change}%)</p>
              <p>Holdings: {stock.holdings} shares</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Stock Performance: {selectedTicker}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockPerformance[selectedTicker]}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00bcd4" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
