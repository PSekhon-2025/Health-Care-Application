// frontend/src/Analytics.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

// Register necessary ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface AnalyticsData {
  camps: {
    totalCamps: number;
    activeCamps: number;
    inactiveCamps: number;
  };
  users: {
    userRoles: Record<string, number>;
  };
  patients: {
    totalPatients: number;
  };
  medicalHistory: {
    htn: {
      Yes: number;
      No: number;
      Unknown: number;
    };
    dm: {
      Yes: number;
      No: number;
      Unknown: number;
    };
    heartDisease: {
      Yes: number;
      No: number;
      Unknown: number;
    };
  };
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get<AnalyticsData>('/api/analytics/stats');
        setAnalytics(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (!analytics) {
    return <div>Failed to load analytics data.</div>;
  }

  // Prepare chart data for user roles
  const roleLabels = Object.keys(analytics.users.userRoles);
  const roleCounts = Object.values(analytics.users.userRoles);

  const userRolesData = {
    labels: roleLabels,
    datasets: [
      {
        label: 'Number of Users by Role',
        data: roleCounts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#9C27B0'],
      },
    ],
  };

  // Prepare chart data for HTN distribution
  const htnLabels = ['Yes', 'No', 'Unknown'];
  const htnCounts = [
    analytics.medicalHistory.htn.Yes,
    analytics.medicalHistory.htn.No,
    analytics.medicalHistory.htn.Unknown,
  ];

  const htnData = {
    labels: htnLabels,
    datasets: [
      {
        label: 'HTN Distribution',
        data: htnCounts,
        backgroundColor: ['#4caf50', '#f44336', '#9e9e9e'],
      },
    ],
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Healthcare Camp Analytics Dashboard</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Camp Statistics</h2>
        <p>Total Camps: {analytics.camps.totalCamps}</p>
        <p>Active Camps: {analytics.camps.activeCamps}</p>
        <p>Inactive Camps: {analytics.camps.inactiveCamps}</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>User Statistics</h2>
        <div style={{ width: '400px', height: '300px' }}>
          <Bar data={userRolesData} />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Patient Statistics</h2>
        <p>Total Patients: {analytics.patients.totalPatients}</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Medical History: HTN</h2>
        <div style={{ width: '300px', height: '300px' }}>
          <Pie data={htnData} />
        </div>
      </section>
    </div>
  );
};

export default Analytics;
