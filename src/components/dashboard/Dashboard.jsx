import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
 
  const pieData = [
    { name: "Diamond", value: 400 },
    { name: "Gold", value: 300 },
    { name: "Silver", value: 300 },
    { name: "Platinum", value: 200 },
  ];

  const barData = [
    { name: "Jan", sales: 4000, revenue: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398 },
    { name: "Mar", sales: 2000, revenue: 9800 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Container fluid className="px-4 py-4">


      {/* Key Metrics */}
      <Row className="g-4 mb-4">
        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Total Revenue</h6>
                  <h2 className="mb-1">$124,780</h2>
                  <span className="badge bg-success bg-opacity-10 text-success">
                    <i className="bi bi-arrow-up me-1"></i>12.5%
                  </span>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-gem text-primary fs-4"></i>
                </div>
              </div>
  
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Orders</h6>
                  <h2 className="mb-1">1,248</h2>
                  <span className="badge bg-success bg-opacity-10 text-success">
                    <i className="bi bi-arrow-up me-1"></i>8.3%
                  </span>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="bi bi-cart-check text-info fs-4"></i>
                </div>
              </div>

            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Customers</h6>
                  <h2 className="mb-1">486</h2>
                  <span className="badge bg-success bg-opacity-10 text-success">
                    <i className="bi bi-arrow-up me-1"></i>5.7%
                  </span>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="bi bi-people text-warning fs-4"></i>
                </div>
              </div>

            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Inventory</h6>
                  <h2 className="mb-1">2,450</h2>
                  <span className="badge bg-danger bg-opacity-10 text-danger">
                    <i className="bi bi-arrow-down me-1"></i>3.2%
                  </span>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded">
                  <i className="bi bi-box-seam text-danger fs-4"></i>
                </div>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col xl={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <Card.Title className="mb-4">Product Distribution</Card.Title>
              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <Card.Title className="mb-4">Sales & Revenue</Card.Title>
              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}

    </Container>
  );
};

export default Dashboard;