import { useEffect, useState } from 'react';
import { Table, Card, Statistic, Row, Col, Typography, Space, Input } from 'antd';
import { getStats } from '../api.js';

const { Title } = Typography;

export default function Stats() {
  const [data, setData] = useState({ customers: [], summary: {} });
  const [search, setSearch] = useState('');

  useEffect(() => { getStats().then(setData); }, []);

  const filtered = data.customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || '').includes(search)
  );

  const columns = [
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Phone', dataIndex: 'phone', render: (p) => p || '—' },
    {
      title: 'Visits',
      dataIndex: 'visits',
      sorter: (a, b) => a.visits - b.visits,
      defaultSortOrder: 'descend',
    },
    { title: 'First visit', dataIndex: 'first_visit', render: (d) => d || '—' },
    { title: 'Last visit', dataIndex: 'last_visit', render: (d) => d || '—' },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Stats</Title>

      <Row gutter={16}>
        <Col span={8}>
          <Card><Statistic title="Total customers" value={data.summary.totalCustomers || 0} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Returning (2+ visits)" value={data.summary.returning || 0} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="First-timers" value={data.summary.firstTimers || 0} /></Card>
        </Col>
      </Row>

      <Input.Search
        placeholder="Filter by name or phone"
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320 }}
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 20 }}
      />
    </Space>
  );
}
