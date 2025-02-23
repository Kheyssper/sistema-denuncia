import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart, Pie, Cell, Legend } from 'recharts'
import StatsCard from './components/StatsCard'
import RecentList from './components/RecentList'
import styles from './styles.module.css'

const Dashboard = () => {
  const statsData = [
    {
      icon: Users,
      title: "Total Denúncias",
      value: "91",
      trend: true,
      trendValue: "12%",
      bgColor: "#e0f2fe",
      iconColor: "#0284c7"
    },
    {
      icon: AlertTriangle,
      title: "Pendentes",
      value: "15",
      bgColor: "#fef9c3",
      iconColor: "#ca8a04"
    },
    // ... outros cards
  ]

  const monthlyData = [
    { month: 'Jan', denuncias: 65 },
    { month: 'Fev', denuncias: 78 },
    { month: 'Mar', denuncias: 91 },
    { month: 'Abr', denuncias: 84 },
    { month: 'Mai', denuncias: 70 }
  ]

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
  )
}

export default Dashboard