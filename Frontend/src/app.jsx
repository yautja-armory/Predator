import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [weapons, setWeapons] = useState([])
  const [form, setForm] = useState({ name: '', type: '', damage: '' })
  const [editingId, setEditingId] = useState(null) // Track if we are editing
  const [flash, setFlash] = useState(false) // Visual FX

  // 1. READ
  const fetchWeapons = () => {
    fetch('http://localhost:5000/api/weapons')
      .then(res => res.json())
      .then(data => setWeapons(data))
      .catch(err => console.log(err))
  }

  useEffect(() => { fetchWeapons() }, [])

  // 2. SUBMIT (Create OR Update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!form.name || !form.damage) return;

    const url = editingId 
      ? `http://localhost:5000/api/weapons/${editingId}` // Edit Mode
      : 'http://localhost:5000/api/weapons'              // Create Mode
    
    const method = editingId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      if (res.ok) {
        setForm({ name: '', type: '', damage: '' }) // Clear form
        setEditingId(null) // Exit edit mode
        fetchWeapons() // Refresh list
        triggerFlash()
      }
    } catch (error) {
      console.error("Operation failed:", error)
    }
  }

  // 3. DELETE
  const handleDelete = async (id) => {
    if(!confirm("CONFIRM DESTRUCTION?")) return;
    await fetch(`http://localhost:5000/api/weapons/${id}`, { method: 'DELETE' })
    fetchWeapons()
  }

  // 4. EDIT (Load data into form)
  const handleEdit = (weapon) => {
    setForm({ name: weapon.name, type: weapon.type, damage: weapon.damage })
    setEditingId(weapon._id)
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // FX: Flash Screen
  const triggerFlash = () => {
    setFlash(true)
    setTimeout(() => setFlash(false), 300)
  }

  return (
    <div className={`app-container ${flash ? 'flash-active' : ''}`}>
      <header className="hud-header">
        <h1>YAUTJA ARMORY</h1>
        <div className="status-blink">[ SYSTEM ONLINE ]</div>
      </header>

      {/* THE FABRICATOR PANEL */}
      <div className="fabricator-panel" style={{borderColor: editingId ? 'orange' : 'var(--predator-green)'}}>
        <h3>
          {editingId ? `// MODIFYING WEAPON: ${editingId}` : '// NEW WEAPON FABRICATION'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" placeholder="WEAPON NAME" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
            <input 
              type="text" placeholder="TYPE" 
              value={form.type}
              onChange={(e) => setForm({...form, type: e.target.value})}
            />
            <input 
              type="number" placeholder="DAMAGE" 
              value={form.damage}
              onChange={(e) => setForm({...form, damage: e.target.value})}
            />
          </div>
          <div style={{display:'flex', gap:'10px'}}>
            <button type="submit" className="action-btn" style={{color: editingId ? 'orange' : 'inherit'}}>
              {editingId ? 'CONFIRM UPGRADE' : 'INITIATE UPLOAD'}
            </button>
            
            {/* Cancel Button only shows when editing */}
            {editingId && (
              <button type="button" className="action-btn" onClick={() => {
                setEditingId(null); 
                setForm({name:'', type:'', damage:''})
              }}>
                CANCEL
              </button>
            )}
          </div>
        </form>
      </div>

      {/* THE GRID */}
      <div className="weapon-grid">
        {weapons.map((w) => (
          <div key={w._id} className="weapon-card" style={{
             borderColor: editingId === w._id ? 'orange' : 'var(--predator-green)'
          }}>
            <div className="card-actions">
              <button className="icon-btn edit" onClick={() => handleEdit(w)}>EDIT</button>
              <button className="icon-btn delete" onClick={() => handleDelete(w._id)}>DEL</button>
            </div>
            
            <h2 className="weapon-name">{w.name}</h2>
            <p>TYPE: {w.type} | DMG: {w.damage}</p>
            <div className="damage-bar-container">
               <div className="damage-fill" style={{width: `${Math.min((w.damage/200)*100, 100)}%`}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App