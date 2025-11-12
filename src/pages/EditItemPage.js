import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, updateItemById } from '../services/itemService';
import '../styles/SubmitItemPage.css';

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getItemById(id);
        const item = res.data;
        setFormData({
          title: item.name || '',
          description: item.description || '',
          date: item.date ? item.date.substring(0, 10) : '',
          location: item.location || '',
          category: item.category || '',
          tags: item.tags || '',
          type: item.type || 'lost',
          userEmail: item.userEmail || '',
          image: null,
        });
      } catch (err) {
        console.error('Failed to load item:', err);
        alert('Could not load item. Please try again.');
      }
    };
    fetchItem();
  }, [id]);

  const handleUpdate = async () => {
    const data = new FormData();
    data.append('name', formData.title);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('date', formData.date); // backend appends T00:00:00
    data.append('type', formData.type);
    data.append('userEmail', formData.userEmail);
    data.append('category', formData.category);
    data.append('tags', formData.tags);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await updateItemById(id, data);
      alert('Item updated successfully!');
      navigate(`/item/${id}`);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed. Please check your inputs and try again.');
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h2>Edit {formData.type} Item</h2>

      <input
        type="text"
        value={formData.title}
        placeholder="Title"
        onChange={e => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        value={formData.description}
        placeholder="Description"
        onChange={e => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="date"
        value={formData.date}
        onChange={e => setFormData({ ...formData, date: e.target.value })}
      />
      <input
        type="text"
        value={formData.location}
        placeholder="Location"
        onChange={e => setFormData({ ...formData, location: e.target.value })}
      />
      <select
        value={formData.category}
        onChange={e => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="">Select Category</option>
        <option value="electronics">Electronics</option>
        <option value="documents">Documents</option>
        <option value="clothing">Clothing</option>
      </select>
      <input
        type="text"
        value={formData.tags}
        placeholder="Tags (comma separated)"
        onChange={e => setFormData({ ...formData, tags: e.target.value })}
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
      />

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default EditItemPage;