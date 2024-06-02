/* eslint-disable no-unused-vars */
import { UserContext } from "@/App";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { Line } from "react-chartjs-2";
import "./Dashboard.css"; // Import your CSS file for styling

const Dashboard = () => {
  const { status, setStatus, BASE, company, loading, setLoading } =
    useContext(UserContext);
  const [earnings, setEarnings] = useState([]);

  async function DashboardData() {
    try {
      setLoading(true);
      const response = await Axios.post(`${BASE}/affiliates/comissions`, {
        affiliate: company._id,
      });

      if (response.status === 200) {
        setEarnings(response.data);
        setStatus("Found");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setStatus("No results found!");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    DashboardData();
  }, []);

  const data = {
    labels: earnings.map((entry) => entry.date),
    datasets: [
      {
        label: "Earnings",
        data: earnings.map((entry) => entry.amount),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Earnings Over Time",
      },
    },
  };

  return (
    <div className="dashboard-container">
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="dashboard-content">
          <h1>Dashboard</h1>
          <br />
          <div className="welcome-message">
            <h1>{`Welcome back, ${company?.username}!`}</h1>
          </div>
          <div className="earnings-info">
            <div className="total-earnings">
              <label>Your total earnings : </label>
              <span>${earnings.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</span>
            </div>
            <div className="rank-info">
              <label>Your Rank : </label>
              <span>
                {(company.rank || "bronze").charAt(0).toUpperCase() +
                  (company.rank || "bronze").slice(1)}
              </span>
            </div>
          </div>
          {earnings.length > 0 && (
            <div className="earnings-chart">
              <Line data={data} options={options} />
            </div>
          )}
          {/* <div className="status">
            <h1>{status}</h1>
          </div> */}
          <div className="transaction-history">
            <h1>Transaction History</h1>
            <ul>
              {earnings.map((entry, index) => (
                <li key={index}>
                  {entry.date}: ${entry.amount}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;