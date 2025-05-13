import React, { useState, useEffect } from 'react';
import API from '../../api';
import DataTable from 'react-data-table-component';
import {  FaPlus, FaTimes, FaSearch, FaBoxOpen } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { Container } from 'react-bootstrap';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    image: null,
    imagePreview: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get('/api/productscategories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.image) data.append('image', formData.image);

    try {
      if (isEditMode) {
        await API.put(`/api/products/${editProductId}`, data);
        toast.success('Product updated successfully');
      } else {
        await API.post('/api/products', data);
        toast.success('Product created successfully');
      }
      fetchProducts();
      resetForm();
      setIsSidebarOpen(false);
    } catch (error) {
      toast.error('Error saving product');
      console.error('Error saving product:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const response = await API.post('/api/productscategories', { name: newCategoryName });
      setCategories([...categories, response.data]);
      setFormData({ ...formData, category: response.data._id });
      setNewCategoryName('');
      setShowCategoryForm(false);
      toast.success('Category added successfully');
    } catch (error) {
      toast.error('Error adding category');
      console.error('Error adding category:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      category: product.category?._id || '',
      description: product.description,
      price: product.price,
      image: null,
      imagePreview: product.image ? `http://localhost:5000/${product.image}` : ''
    });
    setIsEditMode(true);
    setEditProductId(product._id);
    setIsSidebarOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/api/products/${id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          fetchProducts();
        } catch (error) {
          toast.error('Failed to delete product');
          console.error('Error deleting product:', error);
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      price: '',
      image: null,
      imagePreview: ''
    });
    setIsEditMode(false);
    setEditProductId(null);
    setShowCategoryForm(false);
    setNewCategoryName('');
  };

  const filteredProducts = products.filter(item =>
    item.title.toLowerCase().includes(filterText.toLowerCase()) ||
    (item.category?.name && item.category.name.toLowerCase().includes(filterText.toLowerCase())) ||
    item.description.toLowerCase().includes(filterText.toLowerCase()) ||
    item.price.toString().includes(filterText)
  );

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      width: '60px',
      sortable: false
    },
    {
      name: 'Image',
      cell: row => (
        <div className="avatar-container p-2">
          {row.image ? (
            <img
              src={`http://localhost:5000/${row.image}`}
              alt={row.title}
              className="rounded"
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
          ) : (
            <div className="no-image-placeholder bg-light d-flex align-items-center justify-content-center rounded"
              style={{ width: '50px', height: '50px' }}>
              <FaBoxOpen className="text-muted" />
            </div>
          )}
        </div>
      ),
      width: '80px'
    },
{
  name: 'Title',
  selector: row => {
    const title = row.title || '';
    const truncatedTitle = title.length > 80 ? `${title.substring(0, 80)}...` : title;
    return (
      <span style={{  padding: '3px 6px', borderRadius: '4px', fontWeight: 'bold', color: '#000' }}>
        {truncatedTitle}
      </span>
    );
  },
  sortable: true,
  wrap: true
},
{
  name: 'Category',
  selector: row => {
    const categoryName = row.category?.name || 'Uncategorized';
    const truncatedName = categoryName.length > 30 ? `${categoryName.substring(0 , 30)}...` : categoryName;
    return (
      <span style={{
        backgroundColor: '#f9fafb',        // light blue background
        color: '#0369a1',                  // matching blue text
        padding: '4px 10px',
        fontWeight: '600',
        fontSize: '0.85rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        minWidth: '60px',
        textAlign: 'center'
      }}>
        {truncatedName}
      </span>
    );
  },
  sortable: true,
},
{
  name: 'Price',
  selector: row => (
    <span style={{
      backgroundColor: '#d1fae5',       // light green background
      color: '#065f46',                 // dark green text for money
      padding: '2px 8px',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      display: 'inline-block',
      width: 'fit-content',
    }}>
      ₹{parseFloat(row.price).toFixed(2)}
    </span>
  ),
  sortable: true,
  width: '120px'
},
 {
  name: 'Description',
  selector: row => {
    const description = row.description || '';
    const truncated = description.length > 80 ? `${description.substring(0, 80)}...` : description;
    return (
      <span style={{
        color: '#4b5563',               // muted gray text
        padding: '4px 8px',
        borderRadius: '5px',
        display: 'inline-block',
        fontSize: '0.85rem',
        lineHeight: '1.4',
      }}>
        {truncated}
      </span>
    );
  },
  wrap: true
},

    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            title="Edit"
            className="d-flex justify-content-center align-items-center p-0"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(13,110,253,0.1)',
              color: '#0d6efd',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            title="Delete"
            className="d-flex justify-content-center align-items-center p-0"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(220,53,69,0.1)',
              color: '#dc3545',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
      width: '100px'
    }
  ];

  return (
    <Container fluid className="px-4 py-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="card rounded-0">
        <div className="p-3 bg-white d-flex justify-content-between align-items-center">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
              <li className="breadcrumb-item active" aria-current="page">Products</li>
            </ol>
          </nav>
          <div className="d-flex">
            <div className="input-group me-3" style={{ width: '300px' }}>
              <span className="input-group-text bg-white">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                }}
              />
            </div>
            <button
              className="btn"
              style={{
                backgroundColor: "#17c1e8",
                border: "none",
                color: "#ffffff",
                borderRadius: "4px",
                padding: "8px 18px",
                display: "flex",
                alignItems: "center",
                fontWeight: "500",
                fontSize: "16px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
                transition: "all 0.3s ease"
              }}
              onClick={() => {
                resetForm();
                setIsSidebarOpen(true);
              }}
            >
              <FaPlus className="me-1" />
              Add Product
            </button>
          </div>
        </div>
      </div>

<div className="card rounded-0 mt-3">
<div className="card-body" style={{ minHeight: '350px' }}>
  <DataTable
    columns={columns}
    data={filteredProducts}
    progressPending={isLoading}
    progressComponent={
      <div
        style={{
          height: '350px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div className="custom-loader"></div>
      </div>
    }
    pagination
    highlightOnHover
    responsive
    paginationPerPage={10}
    paginationRowsPerPageOptions={[10, 25, 50, 100]}
    noDataComponent={
      <div className="py-4 text-center"
              style={{
          height: '350px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <FaBoxOpen size={48} className="text-muted mb-3" />
        <h5>No products found</h5>
        <p className="text-muted">Click "Add Product" to create one</p>
      </div>
    }
    customStyles={{
      headCells: {
        style: {
          fontWeight: '600',
          fontSize: '0.9rem'
        }
      }
    }}
  />
</div>
</div>

      {/* Sidebar Form */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}></div>

      <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">{isEditMode ? 'Edit Product' : 'Add New Product'}</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              resetForm();
              setIsSidebarOpen(false);
            }}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-control"
              required
              placeholder="Enter product title"
              style={{
                outline: 'none',
                boxShadow: 'none',
              }}
            />
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label">Category *</label>
            </div>

            {showCategoryForm ? (
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={{
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                >
                  <FiPlus />
                </button>
              </div>
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                required
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name.length > 20 ? `${cat.name.substring(0, 20)}...` : cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="form-control"
              required
              placeholder="Enter price"
              step="0.01"
              min="0"
              style={{
                outline: 'none',
                boxShadow: 'none',
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control"
              rows="5"
              required
              placeholder="Enter product description"
              style={{
                outline: 'none',
                boxShadow: 'none',
              }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Product Image {!isEditMode && '*'}</label>
            <div className="d-flex flex-column">
              {formData.imagePreview && (
                <div className="mb-2">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxHeight: '150px' }}
                  />
                </div>
              )}
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="form-control"
                accept="image/*"
                required={!isEditMode}
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                }}
              />
              {isEditMode && (
                <small className="text-muted">Leave empty to keep current image</small>
              )}
            </div>
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditMode ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                resetForm();
                setIsSidebarOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          z-index: 1040;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        
        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        
        .sidebar {
          position: fixed;
          top: 0;
          right: -400px;
          width: 400px;
          height: 100vh;
          background-color: white;
          box-shadow: -5px 0 15px rgba(0,0,0,0.1);
          z-index: 1050;
          padding: 20px;
          overflow-y: auto;
          transition: right 0.3s ease;
        }
        
        .sidebar.active {
          right: 0;
        }
        
        @media (max-width: 576px) {
          .sidebar {
            width: 100%;
            right: -100%;
          }
        }
      `}</style>
    </Container>
  );
};

export default Products;
