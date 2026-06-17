import { useEffect, useState } from 'react';
import {
  DatePicker, Select, Button, List, Card, Modal, Form, Input,
  Typography, Popconfirm, message, Space,
} from 'antd';
import dayjs from 'dayjs';
import {
  getCustomers, createCustomer, getAttendance, addAttendance, removeAttendance,
} from '../api.js';

const { Title, Text } = Typography;

// Shows "Name · phone" when a phone exists, otherwise just the name.
function customerLabel(c) {
  return c.phone ? `${c.name} · ${c.phone}` : c.name;
}

export default function Attendance() {
  const [date, setDate] = useState(dayjs());
  const [customers, setCustomers] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const dateStr = date.format('YYYY-MM-DD');

  const loadCustomers = async () => setCustomers(await getCustomers());
  const loadAttendance = async () => setAttendees(await getAttendance(dateStr));

  useEffect(() => { loadCustomers(); }, []);
  useEffect(() => { loadAttendance(); }, [dateStr]);

  async function handleSelect(customerId) {
    try {
      await addAttendance(customerId, dateStr);
      message.success('Checked in');
      loadAttendance();
    } catch (e) {
      message.error(e.message);
    }
  }

  async function handleAddNew(values) {
    try {
      const c = await createCustomer(values);
      await loadCustomers();
      await addAttendance(c.id, dateStr);
      message.success(`${c.name} added & checked in`);
      setModalOpen(false);
      form.resetFields();
      loadAttendance();
    } catch (e) {
      message.error(e.message);
    }
  }

  async function handleRemove(id) {
    await removeAttendance(id);
    loadAttendance();
  }

  const attendingIds = new Set(attendees.map((a) => a.customer_id));
  const options = customers
    .filter((c) => !attendingIds.has(c.id))
    .map((c) => ({ value: c.id, label: customerLabel(c) }));

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Class Attendance</Title>

      <Space>
        <Text>Class date:</Text>
        <DatePicker value={date} onChange={(d) => d && setDate(d)} allowClear={false} />
      </Space>

      <Card title="Add attendee">
        <Space wrap>
          <Select
            showSearch
            style={{ width: 340 }}
            placeholder="Search by name or phone"
            optionFilterProp="label"
            options={options}
            value={null}
            onChange={handleSelect}
            notFoundContent="No match — use + New customer"
          />
          <Button type="primary" onClick={() => setModalOpen(true)}>
            + New customer
          </Button>
        </Space>
      </Card>

      <Card title={`Attending on ${dateStr} (${attendees.length})`}>
        <List
          dataSource={attendees}
          locale={{ emptyText: 'Nobody checked in yet' }}
          renderItem={(a) => (
            <List.Item
              actions={[
                <Popconfirm
                  key="del"
                  title="Remove from this date?"
                  onConfirm={() => handleRemove(a.id)}
                >
                  <Button danger size="small">Remove</Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={a.name}
                description={a.phone || <Text type="secondary">No phone</Text>}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="New customer"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={() => form.submit()}
        okText="Add & check in"
      >
        <Form form={form} layout="vertical" onFinish={handleAddNew}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item name="phone" label="Phone (optional)">
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="Notes (optional)">
            <Input.TextArea rows={2} placeholder="e.g. child's age, allergies" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
