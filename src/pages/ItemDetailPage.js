import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from '../services/itemService';
import '../styles/ItemDetailPage.css';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    getItemById(id).then(res => setItem(res.data));
  }, [id]);

  if (!item) return <p>Loading item details...</p>;

  return (
    <div className="item-detail-container">
      <h2>{item.name}</h2>
      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="item-detail-image" />}
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Tags:</strong> {item.tags}</p>
      <p><strong>Reported by:</strong> {item.userEmail}</p>
      <p><strong>Status:</strong> {item.status || 'unclaimed'}</p>

      {/* ✅ Edit Button */}
      <button onClick={() => navigate(`/edit/${item.id}`)} className="edit-btn">
        ✏️ Edit Item
      </button>
    </div>
  );
};

export default ItemDetailPage;