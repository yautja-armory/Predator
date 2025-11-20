import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([]) // Renamed weapons to products
  const [form, setForm] = useState({ name: '', type: '', price: '' }) // Changed damage to price for shop feel
  const [editingId, setEditingId] = useState(null) 

  // 1. READ
  const fetchProducts = () => {
    // Note: We still call the same backend API, we just treat 'damage' as 'price' or keep 'damage' in backend
    fetch('http://localhost:5000/api/weapons')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err))
  }

  useEffect(() => { fetchProducts() }, [])

  // 2. SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!form.name || !form.price) return;

    const url = editingId 
      ? `http://localhost:5000/api/weapons/${editingId}`
      : 'http://localhost:5000/api/weapons'
    
    const method = editingId ? 'PUT' : 'POST'

    // Mapping 'price' back to 'damage' for the backend compatibility
    const payload = {
      name: form.name,
      type: form.type,
      damage: form.price // Sending price as damage to backend
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        setForm({ name: '', type: '', price: '' })
        setEditingId(null)
        fetchProducts()
      }
    } catch (error) {
      console.error("Operation failed:", error)
    }
  }

  // 3. DELETE
  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`http://localhost:5000/api/weapons/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  // 4. EDIT
  const handleEdit = (product) => {
    setForm({ name: product.name, type: product.type, price: product.damage })
    setEditingId(product._id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-container">
      <header className="hud-header">
        <h1>Shopify Inventory</h1>
        <div style={{fontSize: '14px', color: '#6d7175'}}>Logged in as Admin</div>
      </header>

      {/* THE FORM PANEL */}
      <div className="fabricator-panel">
        <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" placeholder="Product Name (e.g. T-Shirt)" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
            <input 
              type="text" placeholder="Category (e.g. Apparel)" 
              value={form.type}
              onChange={(e) => setForm({...form, type: e.target.value})}
            />
            <input 
              type="number" placeholder="Price ($)" 
              value={form.price}
              onChange={(e) => setForm({...form, price: e.target.value})}
            />
          </div>
          
          <div style={{display:'flex'}}>
            <button type="submit" className="action-btn">
              {editingId ? 'Save Changes' : 'Add Product'}
            </button>
            
            {editingId && (
              <button type="button" className="action-btn cancel" onClick={() => {
                setEditingId(null); 
                setForm({name:'', type:'', price:''})
              }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* THE PRODUCT GRID */}
      <div className="weapon-grid">
        {products.map((p) => (
          <div key={p._id} className="weapon-card">
            <div className="card-header">
              <div>
                <h2 className="weapon-name">{p.name}</h2>
                <div className="weapon-details">{p.type}</div>
              </div>
              <div className="price-tag">${p.damage}</div>
            </div>
            
            {/* Visual "Inventory Level" Bar instead of Damage bar */}
            <div style={{height: '4px', background: '#e1e3e5', borderRadius: '2px', marginBottom: '15px', overflow:'hidden'}}>
               <div style={{
                 width: `${Math.min((p.damage/200)*100, 100)}%`, 
                 background: '#008060', 
                 height: '100%'
               }}></div>
            </div>

            <div className="card-actions">
              <button className="icon-btn" onClick={() => handleEdit(p)}>Edit</button>
              <button className="icon-btn delete" onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App