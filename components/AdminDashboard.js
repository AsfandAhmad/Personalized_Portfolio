import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import NeonButton from './NeonButton';
import {
  FaProjectDiagram, FaCogs, FaUser, FaBriefcase, FaCertificate,
  FaEnvelope, FaRobot, FaSignOutAlt, FaPlus,
  FaTrash, FaEdit, FaSave, FaTimes, FaChevronDown, FaChevronUp,
  FaExternalLinkAlt, FaHome, FaSlidersH,
} from 'react-icons/fa';

// ─── API Helper ──────────────────────────────────────────────────────────────
async function api(table, method = 'GET', body = null, id = null) {
  const url = `/api/admin/${table}${id ? `?id=${id}` : ''}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API request failed');
  return data;
}

// ─── Tab Navigation ──────────────────────────────────────────────────────────
const tabs = [
  { id: 'overview', label: 'Overview', icon: FaHome },
  { id: 'about', label: 'About / Bio', icon: FaUser },
  { id: 'skills', label: 'Skills', icon: FaSlidersH },
  { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
  { id: 'experience', label: 'Experience', icon: FaBriefcase },
  { id: 'certifications', label: 'Certifications', icon: FaCertificate },
  { id: 'messages', label: 'Messages', icon: FaEnvelope },
  { id: 'chatbot', label: 'Chat Logs', icon: FaRobot },
];

// ─── Toast Notification ──────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className={`fixed top-4 left-1/2 z-50 px-6 py-3 rounded-lg text-sm font-medium shadow-lg ${
        type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
        type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      }`}
    >
      {message}
    </motion.div>
  );
}

// ─── Overview Dashboard ──────────────────────────────────────────────────────
function OverviewPanel({ counts }) {
  const stats = [
    { label: 'Skills', count: counts.skills, icon: FaSlidersH, color: 'text-blue-400' },
    { label: 'Projects', count: counts.projects, icon: FaProjectDiagram, color: 'text-green-400' },
    { label: 'Experience', count: counts.experience, icon: FaBriefcase, color: 'text-purple-400' },
    { label: 'Certifications', count: counts.certifications, icon: FaCertificate, color: 'text-yellow-400' },
    { label: 'Messages', count: counts.messages, icon: FaEnvelope, color: 'text-neon-red' },
    { label: 'Chat Logs', count: counts.chatbot_logs, icon: FaRobot, color: 'text-cyan-400' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FaHome className="text-neon-red" size={18} /> Dashboard Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5 text-center">
            <s.icon className={`mx-auto mb-2 ${s.color}`} size={24} />
            <p className="text-2xl font-bold text-white">{s.count ?? '...'}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 glass-card rounded-xl p-6">
        <h3 className="text-white font-semibold mb-3">Quick Tips</h3>
        <ul className="text-gray-400 text-sm space-y-2">
          <li>&bull; <strong className="text-gray-300">Skills:</strong> Use sliders to adjust skill percentages (0-100%)</li>
          <li>&bull; <strong className="text-gray-300">Projects:</strong> Add, edit, delete projects. Mark featured ones to highlight them</li>
          <li>&bull; <strong className="text-gray-300">Experience:</strong> Manage your work history with dates and descriptions</li>
          <li>&bull; <strong className="text-gray-300">Certifications:</strong> Add certificates with links and badge emojis</li>
          <li>&bull; <strong className="text-gray-300">Messages:</strong> View and manage contact form submissions</li>
          <li>&bull; All changes are saved to Supabase and reflect on the live site immediately</li>
        </ul>
      </div>
    </div>
  );
}

// ─── About Editor ────────────────────────────────────────────────────────────
function AboutEditor({ showToast }) {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api('about');
        const row = res.data?.[0] || null;
        setData(row);
        setForm(row || { name: '', title: '', tagline: '', bio: '', photo_url: '', resume_url: '' });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (data?.id) {
        await api('about', 'PUT', form, data.id);
      } else {
        const res = await api('about', 'POST', form);
        setData(res.data);
      }
      showToast('About saved successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
    setSaving(false);
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>;

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text' },
    { key: 'title', label: 'Job Title', type: 'text' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
    { key: 'photo_url', label: 'Photo URL', type: 'text' },
    { key: 'resume_url', label: 'Resume URL', type: 'text' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FaUser className="text-neon-red" size={18} /> About / Bio
      </h2>
      <div className="glass-card rounded-xl p-6 space-y-5">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={form[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                rows={5}
                className="neon-input text-sm"
              />
            ) : (
              <input
                type="text"
                value={form[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="neon-input text-sm"
              />
            )}
          </div>
        ))}
        <div className="pt-2">
          <NeonButton variant="solid" onClick={handleSave} disabled={saving}>
            <FaSave className="mr-2" size={12} />
            {saving ? 'Saving...' : 'Save About'}
          </NeonButton>
        </div>
      </div>
    </div>
  );
}

// ─── Skills Manager with Sliders ─────────────────────────────────────────────
function SkillsManager({ showToast, onCountChange }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Core', level: 50, order: 0 });

  const categories = ['Core', 'AI & ML', 'Backend', 'Frontend', 'Tools', 'Leadership'];

  const fetchSkills = useCallback(async () => {
    try {
      const res = await api('skills');
      setSkills(res.data || []);
      onCountChange?.(res.data?.length || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [onCountChange]);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const handleAdd = async () => {
    if (!newSkill.name.trim()) { showToast('Skill name is required', 'error'); return; }
    try {
      await api('skills', 'POST', newSkill);
      setNewSkill({ name: '', category: 'Core', level: 50, order: skills.length + 1 });
      setShowAdd(false);
      showToast('Skill added!', 'success');
      fetchSkills();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSave = async (id) => {
    try {
      await api('skills', 'PUT', editForm, id);
      setEditingId(null);
      showToast('Skill updated!', 'success');
      fetchSkills();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    try {
      await api('skills', 'DELETE', null, id);
      showToast('Skill deleted!', 'success');
      fetchSkills();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleQuickLevelChange = async (skill, newLevel) => {
    try {
      await api('skills', 'PUT', { ...skill, level: newLevel }, skill.id);
    } catch (err) {
      showToast(err.message, 'error');
      fetchSkills();
    }
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaSlidersH className="text-neon-red" size={18} /> Skills ({skills.length})
        </h2>
        <NeonButton size="sm" onClick={() => setShowAdd(!showAdd)}>
          <FaPlus className="mr-1" size={10} /> Add Skill
        </NeonButton>
      </div>

      {/* Add New Skill Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-xl p-5 mb-6 overflow-hidden"
          >
            <h3 className="text-white font-semibold mb-4">New Skill</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g. React / Next.js"
                  className="neon-input text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="neon-input text-sm bg-dark-800"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Level: <span className="text-neon-red font-bold">{newSkill.level}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                  className="w-full accent-[#FF073A] h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Display Order</label>
                <input
                  type="number"
                  value={newSkill.order}
                  onChange={(e) => setNewSkill({ ...newSkill, order: parseInt(e.target.value) || 0 })}
                  className="neon-input text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <NeonButton size="sm" variant="solid" onClick={handleAdd} disabled={!newSkill.name}>
                <FaSave className="mr-1" size={10} /> Save
              </NeonButton>
              <NeonButton size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
                <FaTimes className="mr-1" size={10} /> Cancel
              </NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills List with Sliders */}
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="glass-card rounded-xl p-4">
            {editingId === skill.id ? (
              /* Edit Mode */
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="neon-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Category</label>
                    <select
                      value={editForm.category || 'Core'}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="neon-input text-sm bg-dark-800"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Level: <span className="text-neon-red font-bold">{editForm.level}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editForm.level || 50}
                    onChange={(e) => setEditForm({ ...editForm, level: parseInt(e.target.value) })}
                    className="w-full accent-[#FF073A] h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Order</label>
                  <input
                    type="number"
                    value={editForm.order || 0}
                    onChange={(e) => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })}
                    className="neon-input text-sm w-24"
                  />
                </div>
                <div className="flex gap-2">
                  <NeonButton size="sm" variant="solid" onClick={() => handleSave(skill.id)}>
                    <FaSave className="mr-1" size={10} /> Save
                  </NeonButton>
                  <NeonButton size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    <FaTimes className="mr-1" size={10} /> Cancel
                  </NeonButton>
                </div>
              </div>
            ) : (
              /* View Mode with Quick Slider */
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium text-sm">{skill.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-dark-700 text-gray-400">
                      {skill.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neon-red font-bold text-sm min-w-[3rem] text-right">
                      {skill.level}%
                    </span>
                    <button
                      onClick={() => { setEditingId(skill.id); setEditForm({ ...skill }); }}
                      className="text-gray-500 hover:text-neon-red transition-colors p-1"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id, skill.name)}
                      className="text-gray-500 hover:text-red-500 transition-colors p-1"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
                {/* Quick Level Slider - drag to adjust */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value);
                    setSkills((prev) => prev.map((s) => s.id === skill.id ? { ...s, level: newVal } : s));
                  }}
                  onMouseUp={(e) => handleQuickLevelChange(skill, parseInt(e.target.value))}
                  onTouchEnd={() => handleQuickLevelChange(skill, skill.level)}
                  className="w-full accent-[#FF073A] h-1.5 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center py-12 text-gray-600 text-sm">
            No skills yet. Click &quot;Add Skill&quot; to get started.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Generic List Manager (Projects, Experience, Certifications) ─────────────
function ListManager({ tableName, label, icon: Icon, columns, emptyRow, showToast, onCountChange }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ ...emptyRow });
  const [expandedId, setExpandedId] = useState(null);

  const fetchRows = useCallback(async () => {
    try {
      const res = await api(tableName);
      setRows(res.data || []);
      onCountChange?.(res.data?.length || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [tableName, onCountChange]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const handleAdd = async () => {
    try {
      await api(tableName, 'POST', newForm);
      setNewForm({ ...emptyRow });
      setShowAdd(false);
      showToast(`Added successfully!`, 'success');
      fetchRows();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSave = async (id) => {
    try {
      await api(tableName, 'PUT', editForm, id);
      setEditingId(null);
      showToast(`Updated successfully!`, 'success');
      fetchRows();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await api(tableName, 'DELETE', null, id);
      showToast(`Deleted successfully!`, 'success');
      fetchRows();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const renderField = (col, form, setFormFn) => {
    if (col.type === 'textarea') {
      return (
        <textarea
          value={form[col.key] || ''}
          onChange={(e) => setFormFn({ ...form, [col.key]: e.target.value })}
          rows={3}
          className="neon-input text-sm"
          placeholder={col.placeholder || ''}
        />
      );
    }
    if (col.type === 'number') {
      return (
        <input
          type="number"
          value={form[col.key] ?? 0}
          onChange={(e) => setFormFn({ ...form, [col.key]: parseInt(e.target.value) || 0 })}
          className="neon-input text-sm"
        />
      );
    }
    if (col.type === 'boolean') {
      return (
        <label className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={form[col.key] || false}
            onChange={(e) => setFormFn({ ...form, [col.key]: e.target.checked })}
            className="accent-[#FF073A] w-4 h-4"
          />
          <span className="text-sm text-gray-400">{col.label}</span>
        </label>
      );
    }
    if (col.type === 'tags') {
      return (
        <input
          type="text"
          value={Array.isArray(form[col.key]) ? form[col.key].join(', ') : (form[col.key] || '')}
          onChange={(e) => setFormFn({ ...form, [col.key]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
          placeholder="Comma separated: React, Node.js, Python"
          className="neon-input text-sm"
        />
      );
    }
    if (col.type === 'date') {
      return (
        <input
          type="date"
          value={form[col.key] ? form[col.key].substring(0, 10) : ''}
          onChange={(e) => setFormFn({ ...form, [col.key]: e.target.value })}
          className="neon-input text-sm"
        />
      );
    }
    if (col.type === 'select') {
      return (
        <select
          value={form[col.key] || ''}
          onChange={(e) => setFormFn({ ...form, [col.key]: e.target.value })}
          className="neon-input text-sm bg-dark-800"
        >
          {col.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );
    }
    return (
      <input
        type="text"
        value={form[col.key] || ''}
        onChange={(e) => setFormFn({ ...form, [col.key]: e.target.value })}
        placeholder={col.placeholder || ''}
        className="neon-input text-sm"
      />
    );
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Icon className="text-neon-red" size={18} /> {label} ({rows.length})
        </h2>
        <NeonButton size="sm" onClick={() => setShowAdd(!showAdd)}>
          <FaPlus className="mr-1" size={10} /> Add New
        </NeonButton>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-xl p-5 mb-6 overflow-hidden"
          >
            <h3 className="text-white font-semibold mb-4">Add New</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {columns.map((col) => (
                <div key={col.key} className={col.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs text-gray-500 mb-1">{col.label}</label>
                  {renderField(col, newForm, setNewForm)}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <NeonButton size="sm" variant="solid" onClick={handleAdd}>
                <FaSave className="mr-1" size={10} /> Save
              </NeonButton>
              <NeonButton size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
                <FaTimes className="mr-1" size={10} /> Cancel
              </NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rows List */}
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="glass-card rounded-xl overflow-hidden">
            {editingId === row.id ? (
              /* Edit Mode */
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {columns.map((col) => (
                    <div key={col.key} className={col.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-xs text-gray-500 mb-1">{col.label}</label>
                      {renderField(col, editForm, setEditForm)}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <NeonButton size="sm" variant="solid" onClick={() => handleSave(row.id)}>
                    <FaSave className="mr-1" size={10} /> Save
                  </NeonButton>
                  <NeonButton size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    <FaTimes className="mr-1" size={10} /> Cancel
                  </NeonButton>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-sm truncate">
                        {row[columns[0]?.key] || 'Record'}
                      </p>
                      {row.featured && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-red/20 text-neon-red">Featured</span>
                      )}
                      {row.current && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">Current</span>
                      )}
                      {row.badge && (
                        <span className="text-sm">{row.badge}</span>
                      )}
                    </div>
                    {columns[1] && (
                      <p className="text-gray-500 text-xs mt-1 truncate">{row[columns[1].key]}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                    <button
                      onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                      className="text-gray-500 hover:text-white transition-colors p-1.5"
                    >
                      {expandedId === row.id ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                    </button>
                    <button
                      onClick={() => { setEditingId(row.id); setEditForm({ ...row }); }}
                      className="text-gray-500 hover:text-neon-red transition-colors p-1.5"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id, row[columns[0]?.key])}
                      className="text-gray-500 hover:text-red-500 transition-colors p-1.5"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId === row.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-dark-600 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {columns.slice(2).map((col) => {
                          const val = row[col.key];
                          if (val === null || val === undefined || val === '') return null;
                          return (
                            <div key={col.key}>
                              <p className="text-[10px] text-gray-600 uppercase tracking-wider">{col.label}</p>
                              <p className="text-gray-400 text-xs mt-0.5 break-words">
                                {col.type === 'boolean' ? (val ? '✅ Yes' : '❌ No') :
                                 col.type === 'tags' ? (Array.isArray(val) ? val.join(', ') : String(val)) :
                                 String(val)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        ))}

        {rows.length === 0 && (
          <div className="text-center py-12 text-gray-600 text-sm">
            No {label.toLowerCase()} yet. Click &quot;Add New&quot; to get started.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Messages / Chat Logs Viewer ─────────────────────────────────────────────
function MessagesViewer({ tableName, label, icon: Icon, showToast, onCountChange }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = useCallback(async () => {
    try {
      const res = await api(tableName);
      setRows(res.data || []);
      onCountChange?.(res.data?.length || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [tableName, onCountChange]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await api(tableName, 'DELETE', null, id);
      showToast('Deleted!', 'success');
      fetchRows();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Icon className="text-neon-red" size={18} /> {label} ({rows.length})
      </h2>

      <div className="space-y-3">
        {rows.map((msg) => (
          <div key={msg.id} className="glass-card rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-white text-sm">
                  {msg.name || msg.session_id?.slice(0, 12) || 'Anonymous'}
                </p>
                {msg.email && <p className="text-neon-red text-xs">{msg.email}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-[10px]">
                  {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                </span>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <FaTrash size={10} />
                </button>
              </div>
            </div>
            {msg.subject && (
              <p className="text-gray-400 text-xs mb-1 font-medium">{msg.subject}</p>
            )}
            <p className="text-gray-500 text-sm">{msg.message || msg.user_message}</p>
            {msg.bot_response && (
              <p className="text-green-400/60 text-xs mt-2 pl-3 border-l-2 border-green-400/30">
                Bot: {msg.bot_response.substring(0, 200)}{msg.bot_response.length > 200 ? '...' : ''}
              </p>
            )}
          </div>
        ))}

        {rows.length === 0 && (
          <div className="text-center py-12 text-gray-600 text-sm">
            No {label.toLowerCase()} yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [counts, setCounts] = useState({
    skills: null,
    projects: null,
    experience: null,
    certifications: null,
    messages: null,
    chatbot_logs: null,
  });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  const updateCount = useCallback((key) => (count) => {
    setCounts((prev) => ({ ...prev, [key]: count }));
  }, []);

  // Load initial counts
  useEffect(() => {
    const tables = ['skills', 'projects', 'experience', 'certifications', 'messages', 'chatbot_logs'];
    tables.forEach(async (t) => {
      try {
        const res = await api(t);
        setCounts((prev) => ({ ...prev, [t]: res.data?.length || 0 }));
      } catch {}
    });
  }, []);

  const handleLogout = async () => {
    try { await fetch('/api/admin/auth', { method: 'DELETE' }); } catch {}
    onLogout();
  };

  // ─── Column Definitions ──────────────────────────────────────────────────
  const projectColumns = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
    { key: 'live_url', label: 'Live URL', type: 'text', placeholder: 'https://...' },
    { key: 'github_url', label: 'GitHub URL', type: 'text', placeholder: 'https://github.com/...' },
    { key: 'technologies', label: 'Technologies', type: 'tags' },
    { key: 'featured', label: 'Featured', type: 'boolean' },
    { key: 'impact', label: 'Impact', type: 'textarea' },
    { key: 'learnings', label: 'Learnings', type: 'textarea' },
    { key: 'order', label: 'Order', type: 'number' },
  ];

  const experienceColumns = [
    { key: 'title', label: 'Job Title', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'current', label: 'Currently Working', type: 'boolean' },
    { key: 'order', label: 'Order', type: 'number' },
  ];

  const certColumns = [
    { key: 'title', label: 'Certificate Title', type: 'text' },
    { key: 'issuer', label: 'Issuer', type: 'text', placeholder: 'Kaggle, Coursera, etc.' },
    { key: 'date', label: 'Date', type: 'text', placeholder: '2026' },
    { key: 'url', label: 'Certificate URL', type: 'text', placeholder: 'https://...' },
    { key: 'badge', label: 'Badge Emoji', type: 'text', placeholder: '🏅' },
    { key: 'order', label: 'Order', type: 'number' },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="border-b border-dark-600 bg-dark-800/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-display font-bold">
            <span className="text-white">Admin </span>
            <span className="neon-text">Dashboard</span>
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-1"
            >
              <FaExternalLinkAlt size={10} /> View Site
            </Link>
            <NeonButton size="sm" variant="ghost" onClick={handleLogout}>
              <FaSignOutAlt className="mr-1" size={12} /> Logout
            </NeonButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-neon-red/10 text-neon-red border border-neon-red/30'
                      : 'text-gray-500 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
                  {counts[tab.id] !== null && counts[tab.id] !== undefined && !['overview', 'about'].includes(tab.id) && (
                    <span className="ml-auto text-[10px] bg-dark-700 px-1.5 py-0.5 rounded-full text-gray-500">
                      {counts[tab.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <OverviewPanel counts={counts} />}

              {activeTab === 'about' && <AboutEditor showToast={showToast} />}

              {activeTab === 'skills' && (
                <SkillsManager showToast={showToast} onCountChange={updateCount('skills')} />
              )}

              {activeTab === 'projects' && (
                <ListManager
                  tableName="projects"
                  label="Projects"
                  icon={FaProjectDiagram}
                  columns={projectColumns}
                  emptyRow={{ title: '', description: '', technologies: [], featured: false, order: 0 }}
                  showToast={showToast}
                  onCountChange={updateCount('projects')}
                />
              )}

              {activeTab === 'experience' && (
                <ListManager
                  tableName="experience"
                  label="Experience"
                  icon={FaBriefcase}
                  columns={experienceColumns}
                  emptyRow={{ title: '', company: '', description: '', current: false, order: 0 }}
                  showToast={showToast}
                  onCountChange={updateCount('experience')}
                />
              )}

              {activeTab === 'certifications' && (
                <ListManager
                  tableName="certifications"
                  label="Certifications"
                  icon={FaCertificate}
                  columns={certColumns}
                  emptyRow={{ title: '', issuer: '', date: '', url: '', badge: '🏅', order: 0 }}
                  showToast={showToast}
                  onCountChange={updateCount('certifications')}
                />
              )}

              {activeTab === 'messages' && (
                <MessagesViewer
                  tableName="messages"
                  label="Messages"
                  icon={FaEnvelope}
                  showToast={showToast}
                  onCountChange={updateCount('messages')}
                />
              )}

              {activeTab === 'chatbot' && (
                <MessagesViewer
                  tableName="chatbot_logs"
                  label="Chat Logs"
                  icon={FaRobot}
                  showToast={showToast}
                  onCountChange={updateCount('chatbot_logs')}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
