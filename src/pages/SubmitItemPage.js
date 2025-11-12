import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { postLostItem, postFoundItem } from '../services/itemService';
import '../styles/SubmitItemPage.css';

const SubmitItemPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') || 'lost';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    tags: '',
    type: initialType,
    userEmail: localStorage.getItem('userEmail') || '', // ✅ Pull from localStorage
    image: null,
  });

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('name', formData.title);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('date', formData.date);
    data.append('type', formData.type);
    data.append('userEmail', formData.userEmail); // ✅ No fallback
    data.append('category', formData.category);
    data.append('tags', formData.tags);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (formData.type === 'lost') {
        await postLostItem(data);
      } else {
        await postFoundItem(data);
      }
      alert('Item submitted successfully!');
    } catch (err) {
      alert('Submission failed');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Submit a {formData.type} Item</h2>

      <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>

      <input type="text" placeholder="Title" onChange={e => setFormData({ ...formData, title: e.target.value })} />
      <textarea placeholder="Description" onChange={e => setFormData({ ...formData, description: e.target.value })} />
      <input type="date" onChange={e => setFormData({ ...formData, date: e.target.value })} />
      <input type="text" placeholder="Location" onChange={e => setFormData({ ...formData, location: e.target.value })} />
      <select onChange={e => setFormData({ ...formData, category: e.target.value })}>
        <option value="">Select Category</option>
        <option value="electronics">Electronics</option>
        <option value="documents">Documents</option>
        <option value="clothing">Clothing</option>
      </select>
      <input type="text" placeholder="Tags (comma separated)" onChange={e => setFormData({ ...formData, tags: e.target.value })} />
      <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SubmitItemPage;