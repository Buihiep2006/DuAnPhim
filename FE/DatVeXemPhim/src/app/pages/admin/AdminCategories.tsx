import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Tabs, Tab, Pagination, Badge } from 'react-bootstrap';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:9999/api/admin';

interface CategoryItem {
  id: string;
  ten?: string;
  ma?: string;
  moTa?: string;
}

interface CategoryManagerProps {
  title: string;
  endpoint: string;
  hasMa?: boolean;
  hasMoTa?: boolean;
  hasTen?: boolean;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ title, endpoint, hasMa = false, hasMoTa = false, hasTen = true }) => {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState({ ten: '', ma: '', moTa: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState<any>({});
  const itemsPerPage = 5;

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`);
      const json = await res.json();
      if (json.success) setItems(json.data || []);
    } catch (e) {
      console.error('Fetch error', e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  useEffect(() => { setCurrentPage(1); }, [endpoint]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const pagedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pagItems = [];
    for (let i = 1; i <= totalPages; i++) {
      pagItems.push(<Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>);
    }
    return (
      <Pagination className="mb-0">
        <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage((p: number) => p - 1)} />
        {pagItems}
        <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage((p: number) => p + 1)} />
      </Pagination>
    );
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedItem(null);
    setFormData({ ten: '', ma: '', moTa: '' });
    setShowModal(true);
  };

  const handleEdit = (item: CategoryItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({ ten: item.ten || '', ma: item.ma || '', moTa: item.moTa || '' });
    setShowModal(true);
  };

  const handleView = (item: CategoryItem) => {
    setModalMode('view');
    setSelectedItem(item);
    setFormData({ ten: item.ten || '', ma: item.ma || '', moTa: item.moTa || '' });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${title.toLowerCase()} này?`)) return;
    try {
      const res = await fetch(`${API_BASE}${endpoint}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success || res.ok) {
        toast.success(`Xóa ${title.toLowerCase()} thành công!`);
        fetchItems();
      }
      else toast.error('Lỗi: ' + json.message);
    } catch (e) {
      console.error(e);
      toast.error('Lỗi hệ thống');
    }
  };

  const handleSave = async () => {
    const newErrors: any = {};
    const trimmedTen = (formData.ten || '').trim();
    const trimmedMa = (formData.ma || '').trim().toUpperCase();

    if (hasTen && !trimmedTen) newErrors.ten = `Tên ${title.toLowerCase()} không được để trống`;
    if (hasMa) {
      if (!trimmedMa) newErrors.ma = `Mã ${title.toLowerCase()} không được để trống`;
      else if (!/^[A-Z0-9_-]+$/.test(trimmedMa)) newErrors.ma = `Mã ${title.toLowerCase()} không được chứa khoảng trắng hoặc ký tự đặc biệt`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    const method = modalMode === 'add' ? 'POST' : 'PUT';
    const url = modalMode === 'add' ? `${API_BASE}${endpoint}` : `${API_BASE}${endpoint}/${selectedItem?.id}`;
    
    // Cleanup payload to match expected required fields
    const payload: any = {};
    if (hasTen) payload.ten = trimmedTen;
    if (hasMa) payload.ma = trimmedMa;
    if (hasMoTa) payload.moTa = (formData.moTa || '').trim();

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        toast.success(modalMode === 'add' ? `Thêm ${title.toLowerCase()} thành công!` : `Cập nhật ${title.toLowerCase()} thành công!`);
        setShowModal(false);
        fetchItems();
      } else {
        let errorMsg = json.message || 'Không hợp lệ';
        if (json.data && typeof json.data === 'object') {
          errorMsg += '\n' + Object.entries(json.data).map(([k, v]) => `- ${k}: ${v}`).join('\n');
        }
        toast.error('Lỗi: ' + errorMsg);
      }
    } catch (e) {
      console.error(e);
      toast.error('Lỗi hệ thống');
    }
  };

  return (
    <div className="pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Quản lý {title}</h4>
        <Button variant="danger" onClick={handleAdd} size="sm">
          <i className="bi bi-plus-circle me-2"></i>Thêm {title.toLowerCase()}
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                {hasMa && <th className="text-center" style={{ width: '120px' }}>Mã</th>}
                {hasTen && <th className="text-start">Tên</th>}
                {hasMoTa && <th className="text-start">Mô tả</th>}
                <th className="text-center text-nowrap" style={{ width: '120px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((item: CategoryItem) => (
                <tr key={item.id}>
                  {hasMa && <td className="text-center"><Badge bg="light" text="dark" className="border">{item.ma}</Badge></td>}
                  {hasTen && <td className="text-start fw-semibold">{item.ten}</td>}
                  {hasMoTa && <td className="text-start small text-muted">{item.moTa}</td>}
                  <td className="text-center text-nowrap">
                    <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleView(item)}>
                      <i className="bi bi-eye"></i>
                    </Button>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(item)}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4 text-muted">Chưa có dữ liệu</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, items.length)}-{Math.min(currentPage * itemsPerPage, items.length)} / {items.length}</div>
            {renderPagination()}
          </div>
        </Card.Footer>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? `Thêm ${title.toLowerCase()}` : modalMode === 'edit' ? `Cập nhật ${title.toLowerCase()}` : `Chi tiết ${title.toLowerCase()}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {hasMa && (
              <Form.Group className="mb-3">
                <Form.Label>Mã</Form.Label>
                <Form.Control type="text" isInvalid={!!errors.ma} value={formData.ma} onChange={e => setFormData({...formData, ma: e.target.value})} readOnly={modalMode === 'view'} autoFocus={modalMode !== 'view'} />
                <Form.Control.Feedback type="invalid">{errors.ma}</Form.Control.Feedback>
              </Form.Group>
            )}
            {hasTen && (
              <Form.Group className="mb-3">
                <Form.Label>Tên</Form.Label>
                <Form.Control type="text" isInvalid={!!errors.ten} value={formData.ten} onChange={e => setFormData({...formData, ten: e.target.value})} readOnly={modalMode === 'view'} autoFocus={!hasMa && modalMode !== 'view'} />
                <Form.Control.Feedback type="invalid">{errors.ten}</Form.Control.Feedback>
              </Form.Group>
            )}
            {hasMoTa && (
              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control as="textarea" rows={3} value={formData.moTa} onChange={e => setFormData({...formData, moTa: e.target.value})} readOnly={modalMode === 'view'} />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>{modalMode === 'view' ? 'Đóng' : 'Hủy'}</Button>
          {modalMode !== 'view' && <Button variant="danger" onClick={handleSave}>Lưu</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const AdminCategories: React.FC = () => {
  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Danh mục phụ trợ Phim</h2>
        <p className="text-muted mb-0">Quản lý các thuộc tính phân loại của phim</p>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs defaultActiveKey="the-loai" className="mb-3">
            <Tab eventKey="the-loai" title="Thể loại">
              <CategoryManager title="Thể loại" endpoint="/the-loai" hasMa />
            </Tab>
            <Tab eventKey="ngon-ngu" title="Ngôn ngữ">
              <CategoryManager title="Ngôn ngữ" endpoint="/ngon-ngu" hasMa />
            </Tab>
            <Tab eventKey="dao-dien" title="Đạo diễn">
              <CategoryManager title="Đạo diễn" endpoint="/dao-dien" hasMa />
            </Tab>
            <Tab eventKey="dien-vien" title="Diễn viên">
              <CategoryManager title="Diễn viên" endpoint="/dien-vien" hasMa />
            </Tab>
            <Tab eventKey="phan-loai-do-tuoi" title="Độ tuổi">
              <CategoryManager title="Phân loại độ tuổi" endpoint="/phan-loai-do-tuoi" hasTen={false} hasMa={true} hasMoTa={true} />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminCategories;
