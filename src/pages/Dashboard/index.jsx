import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatsCard from './components/StatsCard';
import RecentList from './components/RecentList';
import api from '../../services/api';
import styles from './styles.module.css';

const Dashboard = () => {
  const [statsData, setStatsData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await api.getStats();
        const monthlyResponse = await api.getMonthlyData();
        setStatsData(statsResponse);
        setMonthlyData(monthlyResponse);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h3>Denúncias por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="denuncias" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <RecentList />
      </div>
    </div>
  );
};

export default Dashboard;