import React, { useState } from 'react';
import { 
  Row, Col, Card, Form, Button, Table, Badge, Alert, 
  InputGroup, Tabs, Tab 
} from 'react-bootstrap';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'points' | 'email'>('general');
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const handleSave = () => {
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Cài đặt hệ thống</h2>
          <p className="text-muted mb-0">Cấu hình và tùy chỉnh hệ thống</p>
        </div>
        <Button variant="danger" onClick={handleSave}>
          <i className="bi bi-save me-2"></i>
          Lưu thay đổi
        </Button>
      </div>

      {showSaveAlert && (
        <Alert variant="success" dismissible onClose={() => setShowSaveAlert(false)}>
          <i className="bi bi-check-circle me-2"></i>
          Đã lưu cài đặt thành công!
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k as 'general' | 'pricing' | 'points' | 'email')}
            className="mb-4"
          >
            {/* General Settings */}
            <Tab eventKey="general" title={<><i className="bi bi-gear me-2"></i>Cài đặt chung</>}>
              <Row>
                <Col lg={6}>
                  <Card className="border mb-4">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0 fw-semibold">Thông tin hệ thống</h6>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Tên hệ thống</Form.Label>
                          <Form.Control type="text" defaultValue="DATN Movie Ticketing" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Slogan</Form.Label>
                          <Form.Control type="text" defaultValue="Trải nghiệm điện ảnh đỉnh cao" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Email liên hệ</Form.Label>
                          <Form.Control type="email" defaultValue="support@datnmovie.com" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Hotline</Form.Label>
                          <Form.Control type="text" defaultValue="1900-xxxx" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Địa chỉ</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={2} 
                            defaultValue="72 Lê Thánh Tôn, Quận 1, TP.HCM" 
                          />
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Card>

                  <Card className="border">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0 fw-semibold">Cài đặt đặt vé</h6>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Thời gian giữ ghế (phút)</Form.Label>
                          <Form.Control type="number" defaultValue="10" />
                          <Form.Text className="text-muted">
                            Thời gian tối đa giữ ghế khi chưa thanh toán
                          </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Số vé tối đa mỗi lần đặt</Form.Label>
                          <Form.Control type="number" defaultValue="10" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Thời gian hủy vé trước suất chiếu (giờ)</Form.Label>
                          <Form.Control type="number" defaultValue="2" />
                          <Form.Text className="text-muted">
                            Khách hàng chỉ có thể hủy vé trước giờ chiếu X giờ
                          </Form.Text>
                        </Form.Group>
                        <Form.Check 
                          type="switch"
                          id="auto-release-seats"
                          label="Tự động giải phóng ghế khi hết thời gian giữ"
                          defaultChecked
                          className="mb-2"
                        />
                        <Form.Check 
                          type="switch"
                          id="allow-guest-booking"
                          label="Cho phép đặt vé không cần đăng nhập"
                          defaultChecked={false}
                        />
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card className="border mb-4">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0 fw-semibold">Mạng xã hội</h6>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Facebook</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <i className="bi bi-facebook"></i>
                            </InputGroup.Text>
                            <Form.Control type="url" placeholder="https://facebook.com/..." />
                          </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Instagram</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <i className="bi bi-instagram"></i>
                            </InputGroup.Text>
                            <Form.Control type="url" placeholder="https://instagram.com/..." />
                          </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>YouTube</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <i className="bi bi-youtube"></i>
                            </InputGroup.Text>
                            <Form.Control type="url" placeholder="https://youtube.com/..." />
                          </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>TikTok</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <i className="bi bi-tiktok"></i>
                            </InputGroup.Text>
                            <Form.Control type="url" placeholder="https://tiktok.com/..." />
                          </InputGroup>
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Card>

                  <Card className="border">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0 fw-semibold">Bảo mật</h6>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Check 
                          type="switch"
                          id="require-email-verify"
                          label="Yêu cầu xác thực email khi đăng ký"
                          defaultChecked
                          className="mb-2"
                        />
                        <Form.Check 
                          type="switch"
                          id="enable-2fa"
                          label="Bật xác thực 2 yếu tố (2FA)"
                          defaultChecked={false}
                          className="mb-2"
                        />
                        <Form.Check 
                          type="switch"
                          id="auto-logout"
                          label="Tự động đăng xuất sau 30 phút không hoạt động"
                          defaultChecked
                          className="mb-3"
                        />
                        <Form.Group className="mb-3">
                          <Form.Label>Độ dài mật khẩu tối thiểu</Form.Label>
                          <Form.Control type="number" defaultValue="8" />
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            {/* Pricing Settings */}
            <Tab eventKey="pricing" title={<><i className="bi bi-currency-dollar me-2"></i>Giá vé</>}>
              <Card className="border mb-4">
                <Card.Header className="bg-light">
                  <h6 className="mb-0 fw-semibold">Cấu hình giá vé cơ bản</h6>
                </Card.Header>
                <Card.Body>
                  <Table bordered>
                    <thead className="bg-light">
                      <tr>
                        <th>Loại phòng</th>
                        <th className="text-end">Giá cơ bản (VND)</th>
                        <th className="text-end">Phụ thu cuối tuần (%)</th>
                        <th className="text-end">Phụ thu lễ (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2D Standard</td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="80000" size="sm" />
                        </td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="10" size="sm" />
                        </td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="20" size="sm" />
                        </td>
                      </tr>
                      <tr>
                        <td>3D</td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="100000" size="sm" />
                        </td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="15" size="sm" />
                        </td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="25" size="sm" />
                        </td>
                      </tr>
                      <tr>
                        <td>IMAX</td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="150000" size="sm" />
                        </td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="20" size="sm" />
                        </td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="30" size="sm" />
                        </td>
                      </tr>
                      <tr>
                        <td>4DX</td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="180000" size="sm" />
                        </td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="20" size="sm" />
                        </td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="30" size="sm" />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              <Card className="border">
                <Card.Header className="bg-light">
                  <h6 className="mb-0 fw-semibold">Phụ thu theo loại ghế</h6>
                </Card.Header>
                <Card.Body>
                  <Table bordered>
                    <thead className="bg-light">
                      <tr>
                        <th>Loại ghế</th>
                        <th className="text-end">Phụ thu (VND)</th>
                        <th>Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><Badge bg="secondary">Standard</Badge></td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="0" size="sm" disabled />
                        </td>
                        <td>Ghế thường</td>
                      </tr>
                      <tr>
                        <td><Badge bg="warning">VIP</Badge></td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="20000" size="sm" />
                        </td>
                        <td>Ghế VIP cao cấp</td>
                      </tr>
                      <tr>
                        <td><Badge bg="danger">Couple</Badge></td>
                        <td className="text-end">
                          <Form.Control type="number" defaultValue="30000" size="sm" />
                        </td>
                        <td>Ghế đôi</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>

            {/* Points Settings */}
            <Tab eventKey="points" title={<><i className="bi bi-star me-2"></i>Tích điểm</>}>
              <Row>
                <Col lg={6}>
                  <Card className="border mb-4">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0 fw-semibold">Quy tắc tích điểm</h6>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Tỷ lệ quy đổi</Form.Label>
                          <InputGroup>
                            <Form.Control type="number" defaultValue="1000" />
                            <InputGroup.Text>VND = 1 điểm</InputGroup.Text>
                          </InputGroup>
                          <Form.Text className="text-muted">
                            Cứ 1,000 VND chi tiêu được 1 điểm
                          </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Điểm thưởng sinh nhật</Form.Label>
                          <Form.Control type="number" defaultValue="100" />
                          <Form.Text className="text-muted">
                            Điểm thưởng tự động trong tháng sinh nhật
                          </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Điểm thưởng đăng ký mới</Form.Label>
                          <Form.Control type="number" defaultValue="50" />
                        </Form.Group>
                        <Form.Check 
                          type="switch"
                          id="points-expire"
                          label="Điểm có thời hạn sử dụng"
                          defaultChecked
                          className="mb-2"
                        />
                        <Form.Group className="mb-3">
                          <Form.Label>Thời hạn điểm (tháng)</Form.Label>
                          <Form.Control type="number" defaultValue="12" />
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card className="border">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0 fw-semibold">Hạng thành viên</h6>
                    </Card.Header>
                    <Card.Body>
                      <Table bordered>
                        <thead className="bg-light">
                          <tr>
                            <th>Hạng</th>
                            <th className="text-end">Điểm tối thiểu</th>
                            <th className="text-end">Hệ số tích điểm</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><Badge bg="danger">Bronze</Badge></td>
                            <td className="text-end">
                              <Form.Control type="number" defaultValue="0" size="sm" disabled />
                            </td>
                            <td className="text-end">
                              <Form.Control type="number" defaultValue="1" size="sm" step="0.1" />
                            </td>
                          </tr>
                          <tr>
                            <td><Badge bg="light" text="dark" className="border">Silver</Badge></td>
                            <td className="text-end">
                              <Form.Control type="number" defaultValue="1000" size="sm" />
                            </td>
                            <td className="text-end">
                              <Form.Control type="number" defaultValue="1.2" size="sm" step="0.1" />
                            </td>
                          </tr>
                          <tr>
                            <td><Badge bg="warning" text="dark">Gold</Badge></td>
                            <td className="text-end">
                              <Form.Control type="number" defaultValue="2000" size="sm" />
                            </td>
                            <td className="text-end">
                              <Form.Control type="number" defaultValue="1.5" size="sm" step="0.1" />
                            </td>
                          </tr>
                          <tr>
                            <td><Badge bg="dark">Platinum</Badge></td>
                            <td className="text-end">
                              <Form.Control type="number" defaultValue="5000" size="sm" />
                            </td>
                            <td className="text-end">
                              <Form.Control type="number" defaultValue="2" size="sm" step="0.1" />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Form.Text className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Hệ số tích điểm: Bronze x1, Silver x1.2, Gold x1.5, Platinum x2
                      </Form.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            {/* Email Settings */}
            <Tab eventKey="email" title={<><i className="bi bi-envelope me-2"></i>Email & Thông báo</>}>
              <Row>
                <Col lg={6}>
                  <Card className="border mb-4">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0 fw-semibold">Cấu hình Email SMTP</h6>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>SMTP Host</Form.Label>
                          <Form.Control type="text" defaultValue="smtp.gmail.com" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>SMTP Port</Form.Label>
                          <Form.Control type="number" defaultValue="587" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Username</Form.Label>
                          <Form.Control type="email" defaultValue="noreply@datnmovie.com" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control type="password" defaultValue="********" />
                        </Form.Group>
                        <Form.Check 
                          type="switch"
                          id="use-ssl"
                          label="Sử dụng SSL/TLS"
                          defaultChecked
                        />
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card className="border">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0 fw-semibold">Thông báo tự động</h6>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <div className="mb-3">
                          <Form.Check 
                            type="switch"
                            id="email-booking-confirm"
                            label="Gửi email xác nhận đặt vé"
                            defaultChecked
                            className="mb-2"
                          />
                          <Form.Check 
                            type="switch"
                            id="email-payment-success"
                            label="Gửi email thanh toán thành công"
                            defaultChecked
                            className="mb-2"
                          />
                          <Form.Check 
                            type="switch"
                            id="email-reminder"
                            label="Gửi email nhắc nhở trước giờ chiếu"
                            defaultChecked
                            className="mb-2"
                          />
                          <Form.Check 
                            type="switch"
                            id="email-promotion"
                            label="Gửi email khuyến mãi/tin tức"
                            defaultChecked={false}
                            className="mb-2"
                          />
                          <Form.Check 
                            type="switch"
                            id="email-birthday"
                            label="Gửi email chúc mừng sinh nhật"
                            defaultChecked
                            className="mb-2"
                          />
                        </div>

                        <Form.Group className="mb-3">
                          <Form.Label>Thời gian gửi email nhắc nhở (giờ trước suất chiếu)</Form.Label>
                          <Form.Control type="number" defaultValue="2" />
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminSettings;
