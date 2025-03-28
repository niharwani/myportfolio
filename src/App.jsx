// MyPortfolio - Financial Dashboard App (Modern UI)
// Tech Stack: React + Tailwind CSS + Recharts + Framer Motion

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
  const [darkMode, setDarkMode] = useState(true);
  const [stage, setStage] = useState("landing");
  const [username, setUsername] = useState("");

  const totalValue = portfolio.reduce((acc, stock) => acc + stock.price * stock.holdings, 0);
  const pieData = portfolio.map((stock) => ({ name: stock.ticker, value: stock.price * stock.holdings }));
  const COLORS = ["#00bcd4", "#2196f3", "#ffc107", "#4caf50", "#ff5722"];

  const cardStyle = "bg-gray-800/80 border border-gray-700 rounded-2xl p-4 shadow-xl backdrop-blur-xl text-white";
  const buttonStyle = "bg-lime-400 text-black px-4 py-2 rounded-full hover:opacity-80 transition";

  if (stage === "landing") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950 text-white">
        <h1 className="text-5xl font-extrabold mb-6">💹 MyPortfolio</h1>
        <p className="mb-4 text-center text-gray-400">Your Modern Portfolio Dashboard</p>
        <button className={buttonStyle} onClick={() => setStage("login")}>Enter Dashboard</button>
      </div>
    );
  }

  if (stage === "login") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950 text-white">
        <h1 className="text-3xl font-bold mb-4">Welcome</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded-xl mb-4 text-black"
        />
        <button className={`${buttonStyle} disabled:opacity-50`} onClick={() => setStage("dashboard")} disabled={!username}>Continue</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 space-y-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-extrabold">📊 {username}'s Dashboard</h1>
        <button className={buttonStyle} onClick={() => setDarkMode(!darkMode)}>{darkMode ? "🌙" : "☀️"}</button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cardStyle}>
          <h2 className="text-xl font-semibold">Portfolio Value</h2>
          <p className="text-3xl font-bold mt-2">${totalValue.toLocaleString()}</p>
        </div>
        <div className={cardStyle}>
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
        <div className={cardStyle}>
          <h2 className="text-xl font-semibold">Add Stock (Mock)</h2>
          <button className={`${buttonStyle} mt-4`} onClick={() => {
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

      <section className={cardStyle}>
        <h2 className="text-2xl font-semibold mb-4">Your Stocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((stock) => (
            <motion.div key={stock.ticker} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="p-4 bg-gray-900 rounded-xl shadow hover:shadow-lg cursor-pointer" onClick={() => setSelectedTicker(stock.ticker)}>
              <h3 className="text-xl font-bold">{stock.name} ({stock.ticker})</h3>
              <p>Price: ${stock.price} ({stock.change}%)</p>
              <p>Holdings: {stock.holdings} shares</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={cardStyle}>
        <h2 className="text-2xl font-semibold mb-4">Performance: {selectedTicker}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockPerformance[selectedTicker]}>
            <XAxis dataKey="time" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00bcd4" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
