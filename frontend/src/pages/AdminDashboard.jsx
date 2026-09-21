import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "product",
    category: "",
    tags: "",
    imageUrl: "",
    price: "",
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const response = await api.get("/items");

        setItems(response.data.data.items || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load items"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        imageUrl: formData.imageUrl,
        price: Number(formData.price) || 0,
      };

      const response = await api.post(
        "/items",
        payload
      );

      const newItem =
        response.data.data.item ||
        response.data.data;

      setItems((previous) => [
        newItem,
        ...previous,
      ]);

      setMessage("Item created successfully");

      setFormData({
        title: "",
        description: "",
        type: "product",
        category: "",
        tags: "",
        imageUrl: "",
        price: "",
      });

      setShowForm(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create item"
      );
    }
  };

  const handleEditClick = (item) => {
    setEditingItemId(item._id);
    setShowForm(true);
    setMessage("");
    setError("");

    setFormData({
      title: item.title || "",
      description: item.description || "",
      type: item.type || "product",
      category: item.category || "",
      tags: item.tags?.join(", ") || "",
      imageUrl: item.imageUrl || "",
      price: item.price ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        imageUrl: formData.imageUrl,
        price: Number(formData.price) || 0,
      };

      const response = await api.put(
        `/items/${editingItemId}`,
        payload
      );

      const updatedItem =
        response.data.data.item ||
        response.data.data;

      setItems((previous) =>
        previous.map((item) =>
          item._id === editingItemId
            ? updatedItem
            : item
        )
      );

      setMessage("Item updated successfully");

      setEditingItemId(null);
      setShowForm(false);

      setFormData({
        title: "",
        description: "",
        type: "product",
        category: "",
        tags: "",
        imageUrl: "",
        price: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update item"
      );
    }
  };

  const handleDeleteItem = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(`/items/${item._id}`);

      setItems((previous) =>
        previous.filter(
          (currentItem) =>
            currentItem._id !== item._id
        )
      );

      setMessage("Item deleted successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete item"
      );
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <main>
        <h1>Access Denied</h1>
        <p>
          You must be an administrator to access
          this page.
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main>
        <p>Loading admin dashboard...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>

      <p>
        Manage recommendation items.
      </p>

      {error && <p>{error}</p>}

      <button
        type="button"
        onClick={() => {
          if (showForm) {
            setShowForm(false);
            setEditingItemId(null);

            setFormData({
              title: "",
              description: "",
              type: "product",
              category: "",
              tags: "",
              imageUrl: "",
              price: "",
            });
          } else {
            setShowForm(true);
          }
        }}
      >
        {showForm ? "Cancel" : "+ Add New Item"}
      </button>

      {message && <p>{message}</p>}

      {showForm && (
        <form
          onSubmit={
            editingItemId
              ? handleUpdateItem
              : handleCreateItem
          }
        >
          <h2>
            {editingItemId ? "Edit Item" : "Create Item"}
          </h2>

          <div>
            <label>Title</label>
            <br />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Description</label>
            <br />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Type</label>
            <br />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="product">Product</option>
              <option value="course">Course</option>
              <option value="content">Content</option>
            </select>
          </div>

          <div>
            <label>Category</label>
            <br />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Tags</label>
            <br />
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="javascript, react, frontend"
            />
          </div>

          <div>
            <label>Image URL</label>
            <br />
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Price</label>
            <br />
            <input
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <br />

          <button type="submit">
            {editingItemId
              ? "Update Item"
              : "Create Item"}
          </button>
        </form>
      )}

      <hr />

      <h2>Items</h2>

      {items.length === 0 && (
        <p>No items available.</p>
      )}

      {items.map((item) => (
        <div
          key={item._id}
          className="admin-item-card"
        >
          <h3>{item.title}</h3>

          <p>
            <strong>Type:</strong> {item.type}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {item.category}
          </p>

          <p>
            <strong>Price:</strong>{" "}
            {item.price > 0
              ? `₦${item.price.toLocaleString()}`
              : "Free"}
          </p>

          <button
            type="button"
            onClick={() => handleEditClick(item)}
          >
            Edit
          </button>

          {" "}

          <button
            type="button"
            onClick={() => handleDeleteItem(item)}
          >
            Delete
          </button>
        </div>
      ))}
    </main>
  );
}

export default AdminDashboard;
