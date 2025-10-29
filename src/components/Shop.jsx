import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Shop.css';

// For Azure Static Web Apps, API is at /api (no localhost needed in production)
const API_URL = '/api';

const Shop = () => {
  const { user } = useAuth();
  const [shopItems, setShopItems] = useState([]);
  const [balance, setBalance] = useState(0);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch shop items
      const itemsResponse = await fetch(`${API_URL}/shop`);
      const items = await itemsResponse.json();
      setShopItems(items);

      // Fetch user balance
      if (user) {
        const balanceResponse = await fetch(`${API_URL}/balances/${user.role}`);
        const balanceData = await balanceResponse.json();
        setBalance(balanceData.balance);
      }

      // Fetch purchase history
      const historyResponse = await fetch(`${API_URL}/purchases`);
      const history = await historyResponse.json();
      setPurchaseHistory(history);
    } catch (error) {
      console.error('Error fetching shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handlePurchase = async (item) => {
    if (balance >= item.price) {
      try {
        // Update balance
        const newBalance = balance - item.price;
        await fetch(`${API_URL}/balances/${user.role}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ balance: newBalance }),
        });
        setBalance(newBalance);

        // Record purchase
        const purchase = {
          itemName: item.name,
          itemType: item.type,
          price: item.price,
          buyer: user.name,
          date: new Date().toISOString(),
        };

        await fetch(`${API_URL}/purchases`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(purchase),
        });

        // Refresh history
        fetchData();

        alert(`Successfully purchased ${item.name}!`);
      } catch (error) {
        console.error('Error making purchase:', error);
        alert('Error processing purchase. Please try again.');
      }
    } else {
      alert('Insufficient balance!');
    }
  };

  const filteredItems = shopItems.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  if (loading) {
    return (
      <div className="shop-container">
        <h1 className="shop-title">VIP Shop</h1>
        <p className="welcome-text">Loading shop...</p>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <h1 className="shop-title">VIP Shop</h1>
      
      <div className="shop-header">
        <div className="balance-display">
          <span className="balance-label">Your MVP Points:</span>
          <span className="balance-amount">{balance} points</span>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'buff' ? 'active' : ''}`}
            onClick={() => setFilter('buff')}
          >
            Buffs
          </button>
          <button
            className={`filter-btn ${filter === 'nerf' ? 'active' : ''}`}
            onClick={() => setFilter('nerf')}
          >
            Nerfs
          </button>
        </div>
      </div>

      <div className="shop-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className={`shop-item ${item.type}`}>
            <div className="item-icon">{item.icon}</div>
            <h3 className="item-name">{item.name}</h3>
            <p className="item-type">{item.type.toUpperCase()}</p>
            <p className="item-target">Target: {item.target}</p>
            <p className="item-description">{item.description}</p>
            <div className="item-footer">
              <span className="item-price">{item.price} points</span>
              <button
                className="buy-button"
                onClick={() => handlePurchase(item)}
                disabled={balance < item.price}
              >
                {balance < item.price ? 'Not Enough Points' : 'Buy'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-items">
          <p>No items available in this category.</p>
        </div>
      )}

      <div className="purchase-history">
        <h2>Recent Purchases</h2>
        {purchaseHistory.length > 0 ? (
          <div className="history-list">
            {purchaseHistory.slice(-5).reverse().map((purchase) => (
              <div key={purchase.id} className="history-item">
                <span className="history-buyer">{purchase.buyer}</span>
                <span>bought</span>
                <span className="history-item-name">{purchase.itemName}</span>
                <span className="history-price">({purchase.price} points)</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No purchases yet.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;
