import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Form, Button, Table, 
  InputGroup, Tabs, Tab 
} from 'react-bootstrap';
import { toast } from 'sonner';

interface CaiDatChung {
  id?: string;
  thoiGianGiuGhe: number;
  thoiGianNghiSuatChieu: number;
  gioMoCua: string;
  gioDongCua: string;
  giaVeCoBanMacDinh: number;
  tyLeTichDiem: number;
}

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'points' | 'email'>('general');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<CaiDatChung>({
    thoiGianGiuGhe: 10,
    thoiGianNghiSuatChieu: 15,
    gioMoCua: '08:00',
    gioDongCua: '23:00',
    giaVeCoBanMacDinh: 80000,
    tyLeTichDiem: 1000
  });

  const API_BASE = 'http://localhost:9999/api/admin/cai-dat-chung';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(API_BASE);
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        const item = data.data[0];
        setSettings({
          id: item.id,
          thoiGianGiuGhe: item.thoiGianGiuGhe,
          thoiGianNghiSuatChieu: item.thoiGianNghiSuatChieu,
          gioMoCua: item.gioMoCua ? item.gioMoCua.substring(0, 5) : '08:00',
          gioDongCua: item.gioDongCua ? item.gioDongCua.substring(0, 5) : '23:00',
          giaVeCoBanMacDinh: item.giaVeCoBanMacDinh,
          tyLeTichDiem: item.tyLeTichDiem
        });
      }
    } catch (error) {
      console.error('Lỗi khi fetch cài đặt:', error);
      toast.error('Không thể tải cài đặt từ hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = settings.id ? 'PUT' : 'POST';
      const url = settings.id ? `${API_BASE}/${settings.id}` : API_BASE;
      
      const payload = {
        ...settings,
        gioMoCua: settings.gioMoCua + ':00',
        gioDongCua: settings.gioDongCua + ':00'
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Đã lưu cài đặt thành công!');
        if (!settings.id && data.data) {
          setSettings(prev => ({ ...prev, id: data.data.id }));
        }
      } else {
        toast.error(data.message || 'Lưu cài đặt thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt:', error);
      toast.error('Lỗi hệ thống khi lưu cài đặt');
    }
  };

  const handleChange = (field: keyof CaiDatChung, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="p-5 text-center"><div className="spinner-border text-danger" role="status"></div><p className="mt-2">Đang tải cài đặt...</p></div>;
  }

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
                          <Form.Control type="text" defaultValue="DATN Movie Ticketing" disabled />
                          <Form.Text className="text-muted italic">Hiện tại chỉ hỗ trợ xem trong DB</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Email liên hệ</Form.Label>
                          <Form.Control type="email" defaultValue="support@datnmovie.com" disabled />
                        </Form.Group>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Giờ mở cửa</Form.Label>
                              <Form.Control 
                                type="time" 
                                value={settings.gioMoCua} 
                                onChange={e => handleChange('gioMoCua', e.target.value)} 
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Giờ đóng cửa</Form.Label>
                              <Form.Control 
                                type="time" 
                                value={settings.gioDongCua} 
                                onChange={e => handleChange('gioDongCua', e.target.value)} 
                              />
                            </Form.Group>
                          </Col>
                        </Row>
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
                          <Form.Control 
                            type="number" 
                            value={settings.thoiGianGiuGhe} 
                            onChange={e => handleChange('thoiGianGiuGhe', parseInt(e.target.value) || 0)} 
                          />
                          <Form.Text className="text-muted">
                            Thời gian tối đa giữ ghế khi chưa thanh toán
                          </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Thời gian nghỉ giữa suất chiếu (phút)</Form.Label>
                          <Form.Control 
                            type="number" 
                            value={settings.thoiGianNghiSuatChieu} 
                            onChange={e => handleChange('thoiGianNghiSuatChieu', parseInt(e.target.value) || 0)} 
                          />
                        </Form.Group>
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
                            <InputGroup.Text><i className="bi bi-facebook"></i></InputGroup.Text>
                            <Form.Control type="url" placeholder="https://facebook.com/..." disabled />
                          </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Instagram</Form.Label>
                          <InputGroup>
                            <InputGroup.Text><i className="bi bi-instagram"></i></InputGroup.Text>
                            <Form.Control type="url" placeholder="https://instagram.com/..." disabled />
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
                          disabled
                          className="mb-2"
                        />
                        <Form.Check 
                          type="switch"
                          id="auto-logout"
                          label="Tự động đăng xuất sau 30 phút không hoạt động"
                          defaultChecked
                          disabled
                          className="mb-3"
                        />
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
                  <Row className="align-items-center mb-3">
                    <Col md={4}>
                      <Form.Label className="mb-0 fw-bold">Giá vé cơ bản mặc định (VND)</Form.Label>
                    </Col>
                    <Col md={4}>
                      <InputGroup>
                        <Form.Control 
                          type="number" 
                          value={settings.giaVeCoBanMacDinh} 
                          onChange={e => handleChange('giaVeCoBanMacDinh', parseFloat(e.target.value) || 0)} 
                        />
                        <InputGroup.Text>VND</InputGroup.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                  <hr />
                  <Table bordered>
                    <thead className="bg-light">
                      <tr>
                        <th>Loại phòng</th>
                        <th className="text-end">Phụ thu cuối tuần (%)</th>
                        <th className="text-end">Phụ thu lễ (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2D Standard</td>
                        <td className="text-end">10% (Tĩnh)</td>
                        <td className="text-end">20% (Tĩnh)</td>
                      </tr>
                      <tr>
                        <td>3D / IMAX</td>
                        <td className="text-end">15% (Tĩnh)</td>
                        <td className="text-end">25% (Tĩnh)</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Form.Text className="text-muted">Lưu ý: Các mức phụ thu hiện đang được cấu hình cứng trong hệ thống.</Form.Text>
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
                            <Form.Control 
                              type="number" 
                              value={settings.tyLeTichDiem} 
                              onChange={e => handleChange('tyLeTichDiem', parseInt(e.target.value) || 0)} 
                            />
                            <InputGroup.Text>VND = 1 điểm</InputGroup.Text>
                          </InputGroup>
                          <Form.Text className="text-muted">
                            Ví dụ: {settings.tyLeTichDiem.toLocaleString()} VND chi tiêu được 1 điểm
                          </Form.Text>
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            {/* Email Settings */}
            <Tab eventKey="email" title={<><i className="bi bi-envelope me-2"></i>Email & Thông báo</>}>
              <Card className="border mb-4">
                <Card.Header className="bg-light">
                  <h6 className="mb-0 fw-semibold">Cấu hình Email SMTP</h6>
                </Card.Header>
                <Card.Body>
                  <div className="text-center py-4">
                    <i className="bi bi-shield-lock-fill text-muted fs-1 mb-3 d-block"></i>
                    <p className="mb-0">Cấu hình Email hiện được quản lý qua file <code>application.properties</code> trong Backend.</p>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminSettings;

