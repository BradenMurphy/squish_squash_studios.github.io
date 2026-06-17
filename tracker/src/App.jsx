import { Layout, Menu, Typography } from 'antd';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Attendance from './pages/Attendance.jsx';
import Stats from './pages/Stats.jsx';

const { Header, Content } = Layout;

export default function App() {
  const location = useLocation();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Typography.Text strong style={{ color: '#fff', marginRight: 32, fontSize: 16 }}>
          Messy Play Tracker
        </Typography.Text>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: 1, minWidth: 0 }}
          selectedKeys={[location.pathname]}
          items={[
            { key: '/', label: <Link to="/">Attendance</Link> },
            { key: '/stats', label: <Link to="/stats">Stats</Link> },
          ]}
        />
      </Header>
      <Content style={{ padding: 24, maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Attendance />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </Content>
    </Layout>
  );
}
