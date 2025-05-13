import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, ListGroup, Spinner, Badge } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit2, FiTrash2, FiPlus,  FiCheck } from 'react-icons/fi';
import Swal from 'sweetalert2';
import API from '../../api'; // Use custom API instance
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Category.css"

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await API.get('/api/blogscategories');
        setCategories(response.data);
      } catch (error) {
        toast.error('Error fetching categories: ' + (error.response?.data?.error || 'Server error'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle input change for category name
  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  // Handle create or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const response = await API.put(`/api/blogscategories/${editCategoryId}`, { name: categoryName });
        setCategories(prev => prev.map(cat => cat._id === editCategoryId ? response.data : cat));
        toast.success('Category updated successfully');
      } else {
        const response = await API.post('/api/blogscategories', { name: categoryName });
        setCategories(prev => [...prev, response.data]);
        toast.success('Category created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error('Error saving category: ' + (error.response?.data?.error || 'Server error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit category
  const handleEdit = (category) => {
    setCategoryName(category.name);
    setIsEditMode(true);
    setEditCategoryId(category._id);
  };

  // Handle delete category with SweetAlert2 confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await API.delete(`/api/blogscategories/${id}`);
        setCategories(prev => prev.filter(cat => cat._id !== id));
        Swal.fire(
          'Deleted!',
          'Your category has been deleted.',
          'success'
        );
      } catch (error) {
        toast.error('Error deleting category: ' + (error.response?.data?.error || 'Server error'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setCategoryName('');
    setIsEditMode(false);
    setEditCategoryId(null);
  };

  // Truncate category name if too long
  const truncateName = (name) => {
    return name.length > 30 ? `${name.substring(0, 30)}...` : name;
  };

  return (
    <Container fluid className="px-4 py-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
              <li className="breadcrumb-item active" aria-current="page">Blog Categories</li>
            </ol>
          </nav>
        </div>
        <Badge pill bg="light" className="text-dark">
          {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
        </Badge>
      </div>

      {/* Category Form Card */}
      <Card className="mb-4 border rounded-0">
        <Card.Body>
          <Card.Title className="mb-2">
            {isEditMode ? (
              <span className="d-flex align-items-center">
                <FiEdit2 className="me-2" /> Edit Category
              </span>
            ) : (
              <span className="d-flex align-items-center">
                <FiPlus className="me-2" /> Add New Category
              </span>
            )}
          </Card.Title>
          <Form
            onSubmit={handleSubmit}
            style={{
              padding: '1.5rem',
              borderRadius: '0.5rem',
            }}
          >
            <div className="d-flex gap-2 align-items-stretch">
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={handleChange}
                disabled={isSubmitting}
                className="flex-grow-1"
                style={{
                  border: '1px solid #e0e0e0',
                  padding: '0.55rem 1rem',
                  fontSize: '0.95rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.3s ease',
                  boxShadow: 'none',
                }}
              />

              <Button
                type="submit"
                size="sm"
                disabled={!categoryName.trim() || isSubmitting}
                className="d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: isEditMode ? '#000' : '#17c1e8',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '4px',
                  padding: '8px 18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontWeight: '500',
                  fontSize: '16px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  width: 'fit-content',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: '0.5rem' }}
                    />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {isEditMode ? (
                      <>
                        <FiCheck style={{ marginRight: '0.25rem', fontSize: '1.1rem' }} />
                        Update
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2" style={{ fontSize: '18px' }}></i>
                        Create
                      </>
                    )}
                  </>
                )}
              </Button>

              {isEditMode && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    minWidth: '100px',
                    fontWeight: '500',
                    borderRadius: '0.175rem',
                    border: '1px solid #e0e0e0',
                    backgroundColor: 'white',
                    color: '#495057',
                    transition: 'all 0.2s ease',
                    padding: '0.5rem 1.25rem',
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Category List Card */}
      <Card className="border rounded-0">
        <Card.Body>
          <Card.Title className="mb-3">All Blog Categories</Card.Title>

          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '30vh' }}>
              <div className="custom-loader"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-5" style={{ height: '30vh' }}>
              <h5 className="text-muted">No categories found</h5>
              <p className="text-muted">Create your first category using the form above</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {categories.map((category, index) => (
                <ListGroup.Item
                  key={category._id}
                  className="d-flex justify-content-between align-items-center px-0 py-2 border-0"
                >
                  <div className="d-flex align-items-center">
                    <span
                      className="fw-medium me-3"
                      style={{
                        minWidth: '30px',
                        textAlign: 'right',
                        color: '#6c757d',
                      }}
                    >
                      {index + 1}.
                    </span>
                    <span className="fw-medium text-dark  px-2 rounded-1"
                      style={{
                        backgroundColor: '#f9fafb',     // soft gray background
                        padding: '4px 8px',
                        display: 'inline-block',
                        fontSize: '0.85rem',
                        lineHeight: '1.4',
                      }}>
                      {truncateName(category.name)}
                    </span>
                  </div>
                  <div className="d-flex gap-3">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      disabled={isLoading || isSubmitting}
                      className="d-flex justify-content-center align-items-center p-0"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'rgba(13,110,253,0.1)',
                        color: '#0d6efd',
                        border: 'none',
                        borderRadius: '4px',
                      }}
                    >
                      <FiEdit2 size={16} />
                    </Button>

                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => handleDelete(category._id)}
                      disabled={isLoading || isSubmitting}
                      className="d-flex justify-content-center align-items-center p-0"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'rgba(220,53,69,0.1)',
                        color: '#dc3545',
                        border: 'none',
                        borderRadius: '4px',
                      }}
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Category;