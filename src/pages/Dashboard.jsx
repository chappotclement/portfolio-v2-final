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
  TrendingUp,
  Zap,
  Pencil,
  RotateCcw,
} from 'lucide-react';
import store from '../data/store';

// ─── Helpers ───────────────────────────────────────────────
const STATUS_CONFIG = {
  todo: { label: 'À faire', icon: ListTodo, color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', gradient: 'from-slate-500/10 to-transparent' },
  in_progress: { label: 'En cours', icon: Clock, color: '#facc15', bg: 'rgba(250,204,21,0.08)', border: 'rgba(250,204,21,0.2)', gradient: 'from-yellow-500/10 to-transparent' },
  done: { label: 'Terminé', icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', gradient: 'from-green-500/10 to-transparent' },
};

const INVOICE_STATUS = {
  to_create: { label: 'À créer', icon: FileText, color: '#94a3b8', step: 0 },
  created: { label: 'Créée', icon: FileText, color: '#facc15', step: 1 },
  sent: { label: 'Envoyée', icon: Send, color: '#3b82f6', step: 2 },
  paid: { label: 'Payée', icon: CreditCard, color: '#22c55e', step: 3 },
  overdue: { label: 'En retard', icon: AlertCircle, color: '#ef4444', step: -1 },
};

const PRIORITY_CONFIG = {
  low: { label: 'Basse', color: '#64748b' },
  medium: { label: 'Moyenne', color: '#f59e0b' },
  high: { label: 'Haute', color: '#ef4444' },
};

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

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

function formatCurrency(amount) {
  return amount.toLocaleString('fr-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getDeadlineInfo(deadline) {
  if (!deadline) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  const diff = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `${Math.abs(diff)}j retard`, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
  if (diff === 0) return { label: "Aujourd'hui", color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
  if (diff <= 3) return { label: `${diff}j`, color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
  if (diff <= 7) return { label: `${diff}j`, color: '#facc15', bg: 'rgba(250,204,21,0.12)' };
  return { label: `${diff}j`, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
}

// ─── Modal Component ───────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-in"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'fadeInUp 0.2s ease-out' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Task Card ─────────────────────────────────────────────
function TaskCard({ task, clients, onUpdate, onDelete, onMove, onEdit, compact }) {
  const client = clients.find(c => c.id === task.projectId);
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const deadlineInfo = getDeadlineInfo(task.deadline);

  return (
    <div
      className={`bg-slate-800/40 border border-slate-700/40 rounded-lg hover:border-slate-600/60 hover:bg-slate-800/60 transition-all duration-200 group relative overflow-hidden cursor-pointer ${compact ? 'p-2.5' : 'p-4 rounded-xl'}`}
      onClick={() => onEdit && onEdit(task)}
    >
      {/* Priority indicator bar */}
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg" style={{ backgroundColor: priority.color + '80' }} />

      <div className="pl-2">
        <div className="flex items-start justify-between gap-1.5 mb-1">
          <h4 className={`font-semibold text-white leading-snug flex-1 ${compact ? 'text-[11px]' : 'text-[13px]'}`}>{task.title}</h4>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task); }}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-yellow-400 transition-all p-0.5 rounded hover:bg-yellow-500/10"
              title="Modifier"
            >
              <Pencil size={11} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-0.5 rounded hover:bg-red-500/10"
              title="Supprimer"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>

        {task.description && !compact && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-wrap">
            {!compact && client && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{ backgroundColor: client.color + '18', color: client.color }}
              >
                {client.name}
              </span>
            )}
            {task.source === 'claude-code' && (
              <span className={`font-semibold rounded-md bg-violet-500/15 text-violet-400 ${compact ? 'text-[9px] px-1.5 py-px' : 'text-[10px] px-2 py-0.5'}`}>
                Claude
              </span>
            )}
            <span className={`font-semibold rounded-md ${compact ? 'text-[9px] px-1.5 py-px' : 'text-[10px] px-2 py-0.5'}`} style={{ backgroundColor: priority.color + '15', color: priority.color }}>
              {priority.label}
            </span>
            {deadlineInfo && (
              <span className={`font-semibold rounded-md flex items-center gap-0.5 ${compact ? 'text-[9px] px-1.5 py-px' : 'text-[10px] px-2 py-0.5'}`} style={{ backgroundColor: deadlineInfo.bg, color: deadlineInfo.color }}>
                <CalendarDays size={compact ? 8 : 9} />
                {deadlineInfo.label}
              </span>
            )}
          </div>

          <div className="flex gap-0.5">
            {task.status !== 'todo' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const prev = task.status === 'done' ? 'in_progress' : 'todo';
                  onMove(task.id, prev);
                }}
                className="text-gray-600 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700/50"
                title="Reculer"
              >
                <ArrowLeft size={compact ? 11 : 13} />
              </button>
            )}
            {task.status !== 'done' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const next = task.status === 'todo' ? 'in_progress' : 'done';
                  onMove(task.id, next);
                }}
                className="text-gray-600 hover:text-yellow-400 transition-colors p-1 rounded-md hover:bg-yellow-500/10"
                title="Avancer"
              >
                <ArrowRight size={compact ? 11 : 13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Task Modal ────────────────────────────────────────
function AddTaskModal({ open, onClose, clients, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (open && clients.length > 0 && !clients.find(c => c.id === projectId)) {
      setProjectId(clients[0].id);
    }
  }, [open, clients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;
    onAdd({ title: title.trim(), description: description.trim(), projectId, priority, deadline: deadline || null });
    setTitle('');
    setDescription('');
    setDeadline('');
    onClose();
  };

  const inputClasses = "w-full bg-slate-900/80 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20 transition-all placeholder:text-gray-600";

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle tâche">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Titre *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Optimiser les campagnes Google Ads" className={inputClasses} autoFocus />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Détails de la tâche..." rows={3} className={inputClasses + " resize-none"} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Projet</label>
            <select value={projectId} onChange={e => setProjectId(e.target.value)} className={inputClasses}>
              {clients.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Priorité</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} className={inputClasses}>
              {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (<option key={key} value={key}>{val.label}</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Deadline</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputClasses} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/30">Annuler</button>
          <button type="submit" className="px-5 py-2 bg-yellow-500 text-slate-900 font-bold text-sm rounded-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/10">Ajouter</button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Edit Task Modal ──────────────────────────────────────
function EditTaskModal({ open, onClose, clients, task, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (open && task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setProjectId(task.projectId || '');
      setPriority(task.priority || 'medium');
      setDeadline(task.deadline ? task.deadline.slice(0, 10) : '');
    }
  }, [open, task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !task) return;
    onSave(task.id, { title: title.trim(), description: description.trim(), projectId, priority, deadline: deadline || null });
    onClose();
  };

  const inputClasses = "w-full bg-slate-900/80 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20 transition-all placeholder:text-gray-600";

  return (
    <Modal open={open} onClose={onClose} title="Modifier la tâche">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Titre *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClasses} autoFocus />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Description / Notes</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Ajouter des notes, liens, détails..." rows={5} className={inputClasses + " resize-none"} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Projet</label>
            <select value={projectId} onChange={e => setProjectId(e.target.value)} className={inputClasses}>
              {clients.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Priorité</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} className={inputClasses}>
              {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (<option key={key} value={key}>{val.label}</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Deadline</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputClasses} />
            {deadline && (
              <button type="button" onClick={() => setDeadline('')} className="text-[10px] text-gray-500 hover:text-red-400 mt-1 transition-colors">
                Retirer la deadline
              </button>
            )}
          </div>
        </div>
        {task && (
          <div className="text-[10px] text-gray-600 pt-2 border-t border-slate-700/30">
            Créée le {formatDate(task.createdAt)} · Modifiée le {formatDate(task.updatedAt)}
          </div>
        )}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/30">Annuler</button>
          <button type="submit" className="px-5 py-2 bg-yellow-500 text-slate-900 font-bold text-sm rounded-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/10">Enregistrer</button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Add Invoice Modal ─────────────────────────────────────
function AddInvoiceModal({ open, onClose, clients, onAdd }) {
  const now = new Date();
  const [projectId, setProjectId] = useState('');
  const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  const [amount, setAmount] = useState('');
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open && clients.length > 0 && !clients.find(c => c.id === projectId)) {
      setProjectId(clients[0].id);
    }
  }, [open, clients]);

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

  const inputClasses = "w-full bg-slate-900/80 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20 transition-all placeholder:text-gray-600";

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle facture">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Client</label>
            <select value={projectId} onChange={e => setProjectId(e.target.value)} className={inputClasses}>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Mois</label>
            <input type="month" value={month} onChange={e => setMonth(e.target.value)} className={inputClasses} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Montant ({client?.currency || 'CHF'})</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className={inputClasses} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Heures</label>
            <input type="number" step="0.5" value={hours} onChange={e => setHours(e.target.value)} placeholder="0" className={inputClasses} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Détails supplémentaires..." rows={2} className={inputClasses + " resize-none"} />
        </div>
        {client?.sheetsUrl && (
          <a href={client.sheetsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
            <ExternalLink size={14} />
            Voir les heures sur Google Sheets
          </a>
        )}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/30">
            Annuler
          </button>
          <button type="submit" className="px-5 py-2 bg-yellow-500 text-slate-900 font-bold text-sm rounded-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/10">
            Créer
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
  const isOverdue = invoice.status === 'sent' && invoice.dueDate && new Date(invoice.dueDate) < new Date();
  const displayStatus = isOverdue ? INVOICE_STATUS.overdue : statusConf;

  const nextStatus = { to_create: 'created', created: 'sent', sent: 'paid' };
  const prevStatus = { created: 'to_create', sent: 'created', paid: 'sent' };
  const nextAction = { to_create: 'Marquer créée', created: 'Marquer envoyée', sent: 'Marquer payée' };
  const prevAction = { created: 'À créer', sent: 'Créée', paid: 'Envoyée' };

  // Step progress (0-3)
  const currentStep = INVOICE_STATUS[invoice.status]?.step ?? 0;

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl hover:border-slate-600/40 hover:bg-slate-800/40 transition-all duration-200 group">
      {/* Client color bar */}
      <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: client?.color || '#666' }} />

      <div className="min-w-[140px]">
        <p className="text-sm font-semibold text-white">{client?.name || 'Client inconnu'}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{formatMonth(invoice.month)}</p>
      </div>

      <div className="flex-1 flex items-center gap-3">
        <span className="text-sm font-bold text-white tabular-nums">
          {invoice.amount > 0 ? `${formatCurrency(invoice.amount)} ${invoice.currency || 'CHF'}` : '-'}
        </span>
        {invoice.hours > 0 && (
          <span className="text-[11px] text-gray-500 bg-slate-700/30 px-2 py-0.5 rounded-md">{invoice.hours}h</span>
        )}
      </div>

      {/* Mini step progress */}
      <div className="hidden md:flex items-center gap-1">
        {[0, 1, 2, 3].map(step => (
          <div key={step} className="flex items-center">
            <div
              className="w-2 h-2 rounded-full transition-colors"
              style={{
                backgroundColor: step <= currentStep ? displayStatus.color : 'rgba(100,116,139,0.2)',
              }}
            />
            {step < 3 && (
              <div
                className="w-4 h-0.5 transition-colors"
                style={{
                  backgroundColor: step < currentStep ? displayStatus.color : 'rgba(100,116,139,0.15)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Status badge */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0"
        style={{ backgroundColor: displayStatus.color + '12', color: displayStatus.color }}
      >
        <CircleDot size={10} />
        {displayStatus.label}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {client?.sheetsUrl && (
          <a
            href={client.sheetsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-yellow-400 transition-colors p-1.5 rounded-lg hover:bg-slate-700/40"
            title="Google Sheets"
          >
            <ExternalLink size={13} />
          </a>
        )}
        {prevStatus[invoice.status] && (
          <button
            onClick={() => {
              const updates = { status: prevStatus[invoice.status] };
              if (prevStatus[invoice.status] !== 'paid') updates.paidAt = null;
              if (prevStatus[invoice.status] === 'to_create') updates.sentAt = null;
              onUpdate(invoice.id, updates);
            }}
            className="text-[11px] px-2 py-1 rounded-md text-gray-500 hover:text-white hover:bg-slate-700/40 transition-all font-medium"
            title={`Revenir : ${prevAction[invoice.status]}`}
          >
            <ArrowLeft size={13} />
          </button>
        )}
        {invoice.status !== 'paid' && (
          <button
            onClick={() => {
              const updates = { status: nextStatus[invoice.status] };
              if (nextStatus[invoice.status] === 'sent') updates.sentAt = new Date().toISOString();
              if (nextStatus[invoice.status] === 'paid') updates.paidAt = new Date().toISOString();
              onUpdate(invoice.id, updates);
            }}
            className="text-[11px] px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors font-bold"
          >
            {nextAction[invoice.status]}
          </button>
        )}
        <button
          onClick={() => onDelete(invoice.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-500/10"
          title="Supprimer"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Stats Card ────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, suffix, color }) {
  return (
    <div className="relative overflow-hidden bg-slate-800/30 border border-slate-700/25 rounded-xl p-4 hover:border-slate-600/40 transition-all duration-200">
      {/* Subtle glow */}
      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-[0.04]" style={{ backgroundColor: color }} />
      <div className="flex items-center gap-3 relative">
        <div className="p-2 rounded-lg" style={{ backgroundColor: color + '12' }}>
          <Icon size={17} style={{ color }} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-xl font-bold text-white tabular-nums">
            {value}{suffix && <span className="text-sm font-semibold text-gray-400 ml-1">{suffix}</span>}
          </p>
          <p className="text-[11px] text-gray-500 font-medium">{label}</p>
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
  const [showEditTask, setShowEditTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterProject, setFilterProject] = useState('all');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setClients(store.getClients());
    setTasks(store.getTasks());
    setInvoices(store.getInvoices());
  }, []);

  const activeClients = clients.filter(c => c.active);

  const handleAddTask = (taskData) => { store.addTask(taskData); setTasks(store.getTasks()); };
  const handleUpdateTask = (id, updates) => { store.updateTask(id, updates); setTasks(store.getTasks()); };
  const handleDeleteTask = (id) => { store.deleteTask(id); setTasks(store.getTasks()); };
  const handleMoveTask = (id, newStatus) => { store.updateTask(id, { status: newStatus }); setTasks(store.getTasks()); };
  const handleEditTask = (task) => { setEditingTask(task); setShowEditTask(true); };
  const handleAddInvoice = (data) => { store.addInvoice(data); setInvoices(store.getInvoices()); };
  const handleUpdateInvoice = (id, updates) => { store.updateInvoice(id, updates); setInvoices(store.getInvoices()); };
  const handleDeleteInvoice = (id) => { store.deleteInvoice(id); setInvoices(store.getInvoices()); };

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
      if (store.importAll(evt.target.result)) {
        setClients(store.getClients());
        setTasks(store.getTasks());
        setInvoices(store.getInvoices());
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredTasks = filterProject === 'all' ? tasks : tasks.filter(t => t.projectId === filterProject);
  const filteredInvoices = filterProject === 'all' ? invoices : invoices.filter(i => i.projectId === filterProject);
  const sortedInvoices = [...filteredInvoices].sort((a, b) => (b.month || '').localeCompare(a.month || ''));

  const tasksTodo = tasks.filter(t => t.status === 'todo').length;
  const tasksInProgress = tasks.filter(t => t.status === 'in_progress').length;
  const tasksDone = tasks.filter(t => t.status === 'done').length;
  const invoicesPending = invoices.filter(i => i.status !== 'paid').length;
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0c1021] text-white">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0c1021]/90 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-500 hover:text-white transition-colors text-xs font-medium flex items-center gap-1">
              <ArrowLeft size={12} />
              Portfolio
            </a>
            <div className="w-px h-5 bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-yellow-500/10">
                <Zap size={14} className="text-yellow-400" />
              </div>
              <h1 className="text-sm font-bold tracking-tight">Freelance Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-gray-500 hover:text-white border border-slate-800 rounded-lg hover:border-slate-700 hover:bg-slate-800/50 transition-all font-medium"
            >
              <Download size={12} />
              Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-gray-500 hover:text-white border border-slate-800 rounded-lg hover:border-slate-700 hover:bg-slate-800/50 transition-all font-medium"
            >
              <Upload size={12} />
              Import
            </button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-7">
          <StatCard icon={ListTodo} label="À faire" value={tasksTodo} color="#94a3b8" />
          <StatCard icon={Clock} label="En cours" value={tasksInProgress} color="#facc15" />
          <StatCard icon={CheckCircle2} label="Terminées" value={tasksDone} color="#22c55e" />
          <StatCard icon={Receipt} label="Factures en attente" value={invoicesPending} color="#f97316" />
          <StatCard icon={TrendingUp} label="Revenus encaissés" value={formatCurrency(totalRevenue)} suffix="CHF" color="#22c55e" />
        </div>

        {/* Tabs + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex bg-slate-800/40 rounded-lg p-0.5 border border-slate-700/40">
            {[
              { key: 'tasks', label: 'Tâches', icon: ListTodo },
              { key: 'done', label: 'Terminé', icon: CheckCircle2, count: tasks.filter(t => t.status === 'done').length },
              { key: 'invoices', label: 'Factures', icon: Receipt },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-150 ${
                  activeTab === tab.key
                    ? 'bg-yellow-500 text-slate-900 shadow-sm shadow-yellow-500/20'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${activeTab === tab.key ? 'bg-slate-900/20 text-slate-900' : 'bg-green-500/15 text-green-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <Filter size={13} className="text-gray-600" />
              <select
                value={filterProject}
                onChange={e => setFilterProject(e.target.value)}
                className="bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-yellow-500/40 transition-colors font-medium"
              >
                <option value="all">Tous les projets</option>
                {activeClients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {activeTab !== 'done' && (
              <button
                onClick={() => activeTab === 'tasks' ? setShowAddTask(true) : setShowAddInvoice(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 text-slate-900 font-bold text-xs rounded-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/10"
              >
                <Plus size={14} strokeWidth={3} />
                {activeTab === 'tasks' ? 'Nouvelle tâche' : 'Nouvelle facture'}
              </button>
            )}
          </div>
        </div>

        {/* ─── Tasks Tab: Kanban par client (todo + in_progress only) ─── */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Column headers */}
            <div className="grid grid-cols-2 gap-4">
              {['todo', 'in_progress'].map(status => {
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;
                const count = filteredTasks.filter(t => t.status === status).length;
                return (
                  <div key={status} className="flex items-center gap-2">
                    <div className="p-1 rounded-md" style={{ backgroundColor: config.bg }}>
                      <Icon size={13} style={{ color: config.color }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-400">{config.label}</span>
                    <span className="text-[10px] min-w-[18px] text-center px-1 py-0.5 rounded-md font-bold" style={{ backgroundColor: config.bg, color: config.color }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Rows per client */}
            {(() => {
              const activeTasks = filteredTasks.filter(t => t.status !== 'done');
              const clientsWithTasks = (filterProject === 'all' ? activeClients : activeClients.filter(c => c.id === filterProject))
                .filter(c => activeTasks.some(t => t.projectId === c.id));

              if (clientsWithTasks.length === 0) {
                return (
                  <div className="text-center py-16 text-gray-600 border border-dashed border-slate-700/40 rounded-xl bg-slate-800/10">
                    <ListTodo size={28} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium text-gray-500">Aucune tâche active</p>
                    <p className="text-xs mt-1 text-gray-600">Clique sur "Nouvelle tâche" pour commencer</p>
                  </div>
                );
              }

              return clientsWithTasks.map(client => {
                const clientTasks = activeTasks.filter(t => t.projectId === client.id);
                return (
                  <div key={client.id} className="bg-slate-800/15 border border-slate-700/20 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-slate-700/20">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: client.color }} />
                      <span className="text-xs font-bold text-gray-300">{client.name}</span>
                      <span className="text-[10px] text-gray-600 font-medium ml-1">
                        {clientTasks.length} tâche{clientTasks.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-slate-700/10">
                      {['todo', 'in_progress'].map(status => {
                        const statusTasks = clientTasks.filter(t => t.status === status);
                        return (
                          <div key={status} className="p-3 min-h-[80px] bg-[#0c1021]/50">
                            <div className="space-y-2">
                              {statusTasks.map(task => (
                                <TaskCard
                                  key={task.id}
                                  task={task}
                                  clients={clients}
                                  onUpdate={handleUpdateTask}
                                  onDelete={handleDeleteTask}
                                  onMove={handleMoveTask}
                                  onEdit={handleEditTask}
                                  compact
                                />
                              ))}
                              {statusTasks.length === 0 && (
                                <div className="text-center py-4 text-gray-700 text-[10px]">-</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* ─── Done Tab: Tâches terminées ─── */}
        {activeTab === 'done' && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={13} className="text-green-500" />
              Tâches terminées
            </h3>
            {(() => {
              const doneTasks = (filterProject === 'all' ? tasks : tasks.filter(t => t.projectId === filterProject))
                .filter(t => t.status === 'done')
                .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

              if (doneTasks.length === 0) {
                return (
                  <div className="text-center py-16 text-gray-600 border border-dashed border-slate-700/40 rounded-xl bg-slate-800/10">
                    <CheckCircle2 size={28} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium text-gray-500">Aucune tâche terminée</p>
                  </div>
                );
              }

              return doneTasks.map(task => {
                const client = clients.find(c => c.id === task.projectId);
                const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-3.5 bg-slate-800/30 border border-slate-700/30 rounded-xl hover:border-slate-600/40 hover:bg-slate-800/40 transition-all duration-200 group cursor-pointer"
                    onClick={() => handleEditTask(task)}
                  >
                    <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: client?.color || '#666' }} />
                    <CheckCircle2 size={16} className="text-green-500/60 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-300 line-through decoration-gray-600">{task.title}</p>
                      {task.description && <p className="text-[11px] text-gray-600 mt-0.5 truncate">{task.description}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {client && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: client.color + '18', color: client.color }}>
                          {client.name}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-600">{formatDate(task.updatedAt)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveTask(task.id, 'in_progress'); }}
                        className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors font-bold opacity-0 group-hover:opacity-100"
                        title="Remettre en cours"
                      >
                        <RotateCcw size={11} />
                        Reprendre
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* ─── Invoices Tab ─── */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            {/* Pipeline summary */}
            <div className="bg-slate-800/20 border border-slate-700/25 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                {Object.entries(INVOICE_STATUS).filter(([k]) => k !== 'overdue').map(([key, conf], idx) => {
                  const count = filteredInvoices.filter(i => i.status === key).length;
                  const Icon = conf.icon;
                  const isLast = idx === 3;
                  return (
                    <React.Fragment key={key}>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: conf.color + '12' }}>
                          <Icon size={16} style={{ color: conf.color }} />
                        </div>
                        <p className="text-lg font-bold text-white">{count}</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{conf.label}</p>
                      </div>
                      {!isLast && (
                        <div className="flex-shrink-0 px-2">
                          <ArrowRight size={14} className="text-slate-700" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Google Sheets links */}
            {clients.some(c => c.sheetsUrl) && (
              <div className="flex items-center gap-3 px-1">
                <span className="text-[11px] text-gray-600 font-medium uppercase tracking-wider">Feuilles de temps</span>
                <div className="flex flex-wrap gap-2">
                  {clients.filter(c => c.sheetsUrl).map(c => (
                    <a
                      key={c.id}
                      href={c.sheetsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/40 border border-slate-700/30 rounded-md text-[11px] text-gray-400 hover:text-white hover:border-slate-600/50 transition-all font-medium"
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                      <ExternalLink size={10} className="text-gray-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Invoice list */}
            <div>
              <h3 className="text-[11px] font-semibold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <CalendarDays size={13} className="text-gray-600" />
                Historique des factures
              </h3>
              <div className="space-y-2">
                {sortedInvoices.length === 0 ? (
                  <div className="text-center py-16 text-gray-600 border border-dashed border-slate-700/40 rounded-xl bg-slate-800/10">
                    <Receipt size={28} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium text-gray-500">Aucune facture</p>
                    <p className="text-xs mt-1 text-gray-600">Clique sur "Nouvelle facture" pour commencer</p>
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
      <AddTaskModal open={showAddTask} onClose={() => setShowAddTask(false)} clients={activeClients} onAdd={handleAddTask} />
      <AddInvoiceModal open={showAddInvoice} onClose={() => setShowAddInvoice(false)} clients={activeClients} onAdd={handleAddInvoice} />
      <EditTaskModal open={showEditTask} onClose={() => { setShowEditTask(false); setEditingTask(null); }} clients={activeClients} task={editingTask} onSave={handleUpdateTask} />
    </div>
  );
}
