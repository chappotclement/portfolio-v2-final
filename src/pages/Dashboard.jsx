import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Plus,
  CheckCircle2,
  Clock,
  ListTodo,
  FileText,
  Send,
  CreditCard,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Trash2,
  GripVertical,
  ArrowRight,
  ArrowLeft,
  X,
  AlertCircle,
  Download,
  Upload,
  Receipt,
  CalendarDays,
  CircleDot,
  Filter,
} from 'lucide-react';
import store from '../data/store';

// ─── Helpers ───────────────────────────────────────────────
const STATUS_CONFIG = {
  todo: { label: '\u00c0 faire', icon: ListTodo, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.25)' },
  in_progress: { label: 'En cours', icon: Clock, color: '#facc15', bg: 'rgba(250,204,21,0.1)', border: 'rgba(250,204,21,0.25)' },
  done: { label: 'Termin\u00e9', icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
};

const INVOICE_STATUS = {
  to_create: { label: '\u00c0 cr\u00e9er', icon: FileText, color: '#94a3b8' },
  created: { label: 'Cr\u00e9\u00e9e', icon: FileText, color: '#facc15' },
  sent: { label: 'Envoy\u00e9e', icon: Send, color: '#3b82f6' },
  paid: { label: 'Pay\u00e9e', icon: CreditCard, color: '#22c55e' },
  overdue: { label: 'En retard', icon: AlertCircle, color: '#ef4444' },
};

const PRIORITY_CONFIG = {
  low: { label: 'Basse', color: '#64748b' },
  medium: { label: 'Moyenne', color: '#f59e0b' },
  high: { label: 'Haute', color: '#ef4444' },
};

const MONTHS_FR = ['Janvier', 'F\u00e9vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao\u00fbt', 'Septembre', 'Octobre', 'Novembre', 'D\u00e9cembre'];

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatMonth(monthStr) {
  if (!monthStr) return '';
  const [y, m] = monthStr.split('-');
  return `${MONTHS_FR[parseInt(m) - 1]} ${y}`;
}

// ─── Modal Component ───────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Task Card ─────────────────────────────────────────────
function TaskCard({ task, clients, onUpdate, onDelete, onMove }) {
  const client = clients.find(c => c.id === task.projectId);
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-white leading-snug flex-1">{task.title}</h4>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all shrink-0"
          title="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {client && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: client.color + '20', color: client.color, border: `1px solid ${client.color}40` }}
            >
              {client.name}
            </span>
          )}
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: priority.color + '20', color: priority.color }}
          >
            {priority.label}
          </span>
          {task.source === 'claude-code' && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Claude
            </span>
          )}
        </div>

        <div className="flex gap-1">
          {task.status !== 'todo' && (
            <button
              onClick={() => {
                const prev = task.status === 'done' ? 'in_progress' : 'todo';
                onMove(task.id, prev);
              }}
              className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-700/50"
              title="Reculer"
            >
              <ArrowLeft size={14} />
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => {
                const next = task.status === 'todo' ? 'in_progress' : 'done';
                onMove(task.id, next);
              }}
              className="text-gray-500 hover:text-yellow-400 transition-colors p-1 rounded hover:bg-slate-700/50"
              title="Avancer"
            >
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Kanban Column ─────────────────────────────────────────
function KanbanColumn({ status, tasks, clients, onUpdateTask, onDeleteTask, onMoveTask }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="flex-1 min-w-[280px]">
      <div
        className="flex items-center gap-2 mb-4 pb-3 border-b"
        style={{ borderColor: config.border }}
      >
        <Icon size={18} style={{ color: config.color }} />
        <h3 className="font-semibold text-sm" style={{ color: config.color }}>{config.label}</h3>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: config.bg, color: config.color }}
        >
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            clients={clients}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            onMove={onMoveTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-600 text-sm border border-dashed border-slate-700 rounded-xl">
            Aucune t\u00e2che
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Add Task Modal ────────────────────────────────────────
function AddTaskModal({ open, onClose, clients, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(clients[0]?.id || '');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), projectId, priority });
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle t\u00e2che">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Titre *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Optimiser les campagnes Google Ads"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="D\u00e9tails de la t\u00e2che..."
            rows={3}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Projet</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Priorit\u00e9</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
            >
              {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-yellow-500 text-slate-900 font-semibold text-sm rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Add Invoice Modal ─────────────────────────────────────
function AddInvoiceModal({ open, onClose, clients, onAdd }) {
  const now = new Date();
  const [projectId, setProjectId] = useState(clients[0]?.id || '');
  const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  const [amount, setAmount] = useState('');
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');

  const client = clients.find(c => c.id === projectId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectId) return;
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 30);
    onAdd({
      projectId,
      month,
      amount: parseFloat(amount) || 0,
      hours: parseFloat(hours) || 0,
      currency: client?.currency || 'CHF',
      notes: notes.trim(),
      dueDate: dueDate.toISOString(),
    });
    setAmount('');
    setHours('');
    setNotes('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle facture">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Client</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Mois</label>
            <input
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Montant ({client?.currency || 'CHF'})</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Heures</label>
            <input
              type="number"
              step="0.5"
              value={hours}
              onChange={e => setHours(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="D\u00e9tails suppl\u00e9mentaires..."
            rows={2}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors resize-none"
          />
        </div>
        {client?.sheetsUrl && (
          <a
            href={client.sheetsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ExternalLink size={14} />
            Voir les heures sur Google Sheets
          </a>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            Annuler
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-yellow-500 text-slate-900 font-semibold text-sm rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Cr\u00e9er
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Invoice Row ───────────────────────────────────────────
function InvoiceRow({ invoice, clients, onUpdate, onDelete }) {
  const client = clients.find(c => c.id === invoice.projectId);
  const statusConf = INVOICE_STATUS[invoice.status] || INVOICE_STATUS.to_create;
  const StatusIcon = statusConf.icon;

  const isOverdue = invoice.status === 'sent' && invoice.dueDate && new Date(invoice.dueDate) < new Date();
  const displayStatus = isOverdue ? INVOICE_STATUS.overdue : statusConf;

  const nextStatus = {
    to_create: 'created',
    created: 'sent',
    sent: 'paid',
  };

  const nextAction = {
    to_create: 'Marquer cr\u00e9\u00e9e',
    created: 'Marquer envoy\u00e9e',
    sent: 'Marquer pay\u00e9e',
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl hover:border-slate-600/50 transition-all group">
      <div className="flex items-center gap-3 min-w-[180px]">
        {client && (
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: client.color }} />
        )}
        <div>
          <p className="text-sm font-medium text-white">{client?.name || 'Client inconnu'}</p>
          <p className="text-xs text-gray-500">{formatMonth(invoice.month)}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-4">
        {invoice.amount > 0 && (
          <span className="text-sm font-semibold text-white">
            {invoice.amount.toLocaleString('fr-CH')} {invoice.currency || 'CHF'}
          </span>
        )}
        {invoice.hours > 0 && (
          <span className="text-xs text-gray-400">{invoice.hours}h</span>
        )}
      </div>

      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: displayStatus.color + '15', color: displayStatus.color, border: `1px solid ${displayStatus.color}30` }}
      >
        <CircleDot size={12} />
        {displayStatus.label}
      </div>

      <div className="flex items-center gap-2">
        {client?.sheetsUrl && (
          <a
            href={client.sheetsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-yellow-400 transition-colors p-1.5 rounded-lg hover:bg-slate-700/50"
            title="Google Sheets"
          >
            <ExternalLink size={14} />
          </a>
        )}
        {invoice.status !== 'paid' && (
          <button
            onClick={() => {
              const updates = { status: nextStatus[invoice.status] };
              if (nextStatus[invoice.status] === 'sent') updates.sentAt = new Date().toISOString();
              if (nextStatus[invoice.status] === 'paid') updates.paidAt = new Date().toISOString();
              onUpdate(invoice.id, updates);
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors font-medium"
          >
            {nextAction[invoice.status]}
          </button>
        )}
        <button
          onClick={() => onDelete(invoice.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-slate-700/50"
          title="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Stats Card ────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: color + '15' }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────
export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [filterProject, setFilterProject] = useState('all');
  const [showImportExport, setShowImportExport] = useState(false);
  const fileInputRef = useRef(null);

  // Load data on mount
  useEffect(() => {
    setClients(store.getClients());
    setTasks(store.getTasks());
    setInvoices(store.getInvoices());
  }, []);

  const activeClients = clients.filter(c => c.active);

  // --- Task handlers ---
  const handleAddTask = (taskData) => {
    const newTask = store.addTask(taskData);
    setTasks(store.getTasks());
  };

  const handleUpdateTask = (id, updates) => {
    store.updateTask(id, updates);
    setTasks(store.getTasks());
  };

  const handleDeleteTask = (id) => {
    store.deleteTask(id);
    setTasks(store.getTasks());
  };

  const handleMoveTask = (id, newStatus) => {
    store.updateTask(id, { status: newStatus });
    setTasks(store.getTasks());
  };

  // --- Invoice handlers ---
  const handleAddInvoice = (invoiceData) => {
    store.addInvoice(invoiceData);
    setInvoices(store.getInvoices());
  };

  const handleUpdateInvoice = (id, updates) => {
    store.updateInvoice(id, updates);
    setInvoices(store.getInvoices());
  };

  const handleDeleteInvoice = (id) => {
    store.deleteInvoice(id);
    setInvoices(store.getInvoices());
  };

  // --- Import/Export ---
  const handleExport = () => {
    const json = store.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freelance-dashboard-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const success = store.importAll(evt.target.result);
      if (success) {
        setClients(store.getClients());
        setTasks(store.getTasks());
        setInvoices(store.getInvoices());
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- Filtered data ---
  const filteredTasks = filterProject === 'all' ? tasks : tasks.filter(t => t.projectId === filterProject);
  const filteredInvoices = filterProject === 'all' ? invoices : invoices.filter(i => i.projectId === filterProject);
  const sortedInvoices = [...filteredInvoices].sort((a, b) => (b.month || '').localeCompare(a.month || ''));

  // --- Stats ---
  const tasksTodo = tasks.filter(t => t.status === 'todo').length;
  const tasksInProgress = tasks.filter(t => t.status === 'in_progress').length;
  const tasksDone = tasks.filter(t => t.status === 'done').length;
  const invoicesPending = invoices.filter(i => i.status !== 'paid').length;
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                \u2190 Portfolio
              </a>
              <div className="w-px h-6 bg-slate-700" />
              <div className="flex items-center gap-2">
                <LayoutDashboard size={20} className="text-yellow-400" />
                <h1 className="text-lg font-bold">Freelance Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
                title="Exporter les donn\u00e9es"
              >
                <Download size={14} />
                Export
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
                title="Importer des donn\u00e9es"
              >
                <Upload size={14} />
                Import
              </button>
              <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={ListTodo} label="\u00c0 faire" value={tasksTodo} color="#94a3b8" />
          <StatCard icon={Clock} label="En cours" value={tasksInProgress} color="#facc15" />
          <StatCard icon={CheckCircle2} label="Termin\u00e9es" value={tasksDone} color="#22c55e" />
          <StatCard icon={Receipt} label="Factures en attente" value={invoicesPending} color="#f97316" />
          <StatCard icon={CreditCard} label="Revenus encaiss\u00e9s" value={`${totalRevenue.toLocaleString('fr-CH')}`} color="#22c55e" />
        </div>

        {/* Tabs + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tasks' ? 'bg-yellow-500 text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ListTodo size={16} />
              T\u00e2ches
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'invoices' ? 'bg-yellow-500 text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Receipt size={16} />
              Factures
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Project filter */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-500" />
              <select
                value={filterProject}
                onChange={e => setFilterProject(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
              >
                <option value="all">Tous les projets</option>
                {activeClients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Add button */}
            <button
              onClick={() => activeTab === 'tasks' ? setShowAddTask(true) : setShowAddInvoice(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-slate-900 font-semibold text-sm rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <Plus size={16} />
              {activeTab === 'tasks' ? 'Nouvelle t\u00e2che' : 'Nouvelle facture'}
            </button>
          </div>
        </div>

        {/* ─── Tasks Tab: Kanban ─── */}
        {activeTab === 'tasks' && (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {['todo', 'in_progress', 'done'].map(status => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={filteredTasks.filter(t => t.status === status)}
                clients={clients}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
              />
            ))}
          </div>
        )}

        {/* ─── Invoices Tab ─── */}
        {activeTab === 'invoices' && (
          <div className="space-y-8">
            {/* Pipeline */}
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(INVOICE_STATUS).filter(([k]) => k !== 'overdue').map(([key, conf]) => {
                const count = filteredInvoices.filter(i => i.status === key).length;
                const Icon = conf.icon;
                return (
                  <div key={key} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 text-center">
                    <Icon size={20} className="mx-auto mb-2" style={{ color: conf.color }} />
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-xs text-gray-400">{conf.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Google Sheets links */}
            <div className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <ExternalLink size={14} className="text-yellow-400" />
                Feuilles de temps Google Sheets
              </h3>
              <div className="flex flex-wrap gap-3">
                {clients.filter(c => c.sheetsUrl).map(c => (
                  <a
                    key={c.id}
                    href={c.sheetsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-gray-300 hover:text-white hover:border-slate-600 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                    <ExternalLink size={12} className="text-gray-500" />
                  </a>
                ))}
              </div>
            </div>

            {/* Invoice list */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <CalendarDays size={14} className="text-yellow-400" />
                Historique des factures
              </h3>
              <div className="space-y-2">
                {sortedInvoices.length === 0 ? (
                  <div className="text-center py-12 text-gray-600 border border-dashed border-slate-700 rounded-xl">
                    <Receipt size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Aucune facture pour le moment</p>
                    <p className="text-xs mt-1">Clique sur "Nouvelle facture" pour commencer</p>
                  </div>
                ) : (
                  sortedInvoices.map(invoice => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      clients={clients}
                      onUpdate={handleUpdateInvoice}
                      onDelete={handleDeleteInvoice}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddTaskModal
        open={showAddTask}
        onClose={() => setShowAddTask(false)}
        clients={activeClients}
        onAdd={handleAddTask}
      />
      <AddInvoiceModal
        open={showAddInvoice}
        onClose={() => setShowAddInvoice(false)}
        clients={activeClients}
        onAdd={handleAddInvoice}
      />
    </div>
  );
}
