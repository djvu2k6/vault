import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Trash2, Edit, Save, X, RefreshCw } from 'lucide-react';

const DatabaseView = () => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Load Data
  const loadData = async () => {
    const records = await api.fetchAll();
    setData(records);
  };

  useEffect(() => { loadData(); }, []);

  // DELETE Handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record from the REAL Database?")) {
      await api.deleteRecord(id);
      loadData(); // Refresh table
    }
  };

  // EDIT Handler (Start Editing)
  const handleEditClick = (record) => {
    setEditingId(record.id);
    setEditForm(record); // Load current values into form
  };

  // SAVE Handler (Send to DB)
  const handleSave = async () => {
    await api.updateRecord(editingId, editForm);
    setEditingId(null);
    loadData(); // Refresh to see calculated updates
  };

  // INPUT Handler (For editing)
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Database Management (Real-Time)</h2>
        <button onClick={loadData} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
          <RefreshCw size={18} /> Refresh Data
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
              <th className="p-4 border-b">ID</th>
              <th className="p-4 border-b">Date</th>
              <th className="p-4 border-b">Industry</th>
              <th className="p-4 border-b">Price ($)</th>
              <th className="p-4 border-b">Cost ($)</th>
              <th className="p-4 border-b">Units</th>
              <th className="p-4 border-b">Revenue ($)</th>
              <th className="p-4 border-b">Net Profit ($)</th>
              <th className="p-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 border-b last:border-0 transition-colors">
                
                {/* ID & DATE (Read Only) */}
                <td className="p-4 font-mono text-xs text-slate-400">#{row.id}</td>
                <td className="p-4 text-xs">{new Date(row.createdAt).toLocaleDateString()}</td>

                {/* EDITABLE FIELDS */}
                {editingId === row.id ? (
                  <>
                    <td className="p-2"><input name="industry_type" value={editForm.industry_type} onChange={handleChange} className="w-24 p-1 border rounded"/></td>
                    <td className="p-2"><input type="number" name="selling_price" value={editForm.selling_price} onChange={handleChange} className="w-16 p-1 border rounded"/></td>
                    <td className="p-2"><input type="number" name="variable_cost_unit" value={editForm.variable_cost_unit} onChange={handleChange} className="w-16 p-1 border rounded"/></td>
                    <td className="p-2"><input type="number" name="units_sold" value={editForm.units_sold} onChange={handleChange} className="w-16 p-1 border rounded"/></td>
                    {/* Computed fields are hidden during edit */}
                    <td colSpan="2" className="p-4 text-xs text-slate-400 italic">Will Recalculate...</td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium">{row.industry_type}</td>
                    <td className="p-4">${row.selling_price}</td>
                    <td className="p-4 text-red-500">${row.variable_cost_unit}</td>
                    <td className="p-4">{row.units_sold}</td>
                    <td className="p-4 font-bold text-blue-600">${row.revenue?.toLocaleString()}</td>
                    <td className="p-4 font-bold text-green-600">${row.cm2_margin?.toLocaleString()}</td>
                  </>
                )}

                {/* ACTION BUTTONS */}
                <td className="p-4 text-center">
                  {editingId === row.id ? (
                    <div className="flex justify-center gap-2">
                      <button onClick={handleSave} className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"><Save size={16}/></button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-slate-100 text-slate-500 rounded hover:bg-slate-200"><X size={16}/></button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditClick(row)} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(row.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 size={16}/></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <div className="p-8 text-center text-slate-500">No records found in Database.</div>}
      </div>
    </div>
  );
};

export default DatabaseView;