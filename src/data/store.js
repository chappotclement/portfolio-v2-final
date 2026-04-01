/**
 * Freelance Dashboard Data Store
 *
 * Data layer for tasks, clients, and invoices.
 * Uses localStorage for persistence.
 *
 * Claude Code sync:
 *   - Export: store.exportAll() -> JSON string
 *   - Import: store.importAll(jsonString)
 */

const STORAGE_KEYS = {
  clients: 'freelance_clients',
  tasks: 'freelance_tasks',
  invoices: 'freelance_invoices',
};

// --- Default clients based on actual projects ---
const DEFAULT_CLIENTS = [
  {
    id: 'helvecy',
    name: 'Helvecy',
    active: true,
    color: '#facc15',
    hourlyRate: null,
    currency: 'CHF',
    sheetsUrl: 'https://docs.google.com/spreadsheets/d/1CoxJYMFHrtDAHXAG7PwcFt3ODylGdAS97JgOFFR31uQ/edit?gid=1177314972#gid=1177314972',
    contactEmail: '',
  },
  {
    id: 'funky-frames',
    name: 'Funky Frames',
    active: true,
    color: '#f97316',
    hourlyRate: null,
    currency: 'CHF',
    sheetsUrl: 'https://docs.google.com/spreadsheets/d/1Sv_u6H3WrRgFdBZsiM_GDIvNBkgV0lb3d1eeKC5m83I/edit?gid=0#gid=0',
    contactEmail: '',
  },
  {
    id: 'europe-cam',
    name: 'Europe Cam',
    active: true,
    color: '#3b82f6',
    hourlyRate: null,
    currency: 'EUR',
    sheetsUrl: '',
    contactEmail: '',
  },
  {
    id: 'la-cave-a-cigare',
    name: 'La Cave à Cigare',
    active: true,
    color: '#8b5cf6',
    hourlyRate: null,
    currency: 'CHF',
    sheetsUrl: '',
    contactEmail: '',
  },
  {
    id: 'stylla',
    name: 'Stylla',
    active: false,
    color: '#ec4899',
    hourlyRate: null,
    currency: 'CHF',
    sheetsUrl: '',
    contactEmail: '',
  },
];

const DEFAULT_TASKS = [
  {
    id: 'demo-1',
    projectId: 'helvecy',
    title: 'Audit complet Google Ads',
    description: 'Analyser les campagnes existantes et proposer des optimisations',
    status: 'done',
    priority: 'high',
    source: 'manual',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z',
  },
  {
    id: 'demo-2',
    projectId: 'helvecy',
    title: 'Briefs créatifs statiques Avril',
    description: 'Préparer les briefs pour les visuels statiques du mois',
    status: 'in_progress',
    priority: 'high',
    source: 'manual',
    createdAt: '2026-03-28T09:00:00Z',
    updatedAt: '2026-04-01T08:00:00Z',
  },
  {
    id: 'demo-3',
    projectId: 'funky-frames',
    title: 'Migration HTTPS complète',
    description: 'Finaliser la redirection HTTP vers HTTPS sur tout le site',
    status: 'todo',
    priority: 'medium',
    source: 'claude-code',
    createdAt: '2026-03-30T11:00:00Z',
    updatedAt: '2026-03-30T11:00:00Z',
  },
  {
    id: 'demo-4',
    projectId: 'funky-frames',
    title: 'SEO descriptions produits',
    description: 'Rédiger les méta descriptions pour toutes les pages produits',
    status: 'in_progress',
    priority: 'medium',
    source: 'claude-code',
    createdAt: '2026-03-25T14:00:00Z',
    updatedAt: '2026-03-31T16:00:00Z',
  },
  {
    id: 'demo-5',
    projectId: 'la-cave-a-cigare',
    title: "Développement app Shopify",
    description: "Continuer le développement de l'app custom Shopify",
    status: 'in_progress',
    priority: 'high',
    source: 'manual',
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-04-01T09:00:00Z',
  },
];

// --- Utility functions ---
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn(`Failed to load ${key} from localStorage`, e);
  }
  return defaultValue;
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage`, e);
  }
}

// --- Store API ---
const store = {
  // --- Clients ---
  getClients() {
    return loadFromStorage(STORAGE_KEYS.clients, DEFAULT_CLIENTS);
  },

  getActiveClients() {
    return this.getClients().filter(c => c.active);
  },

  getClient(id) {
    return this.getClients().find(c => c.id === id);
  },

  saveClient(client) {
    const clients = this.getClients();
    const idx = clients.findIndex(c => c.id === client.id);
    if (idx >= 0) {
      clients[idx] = { ...clients[idx], ...client };
    } else {
      clients.push({ ...client, id: client.id || generateId() });
    }
    saveToStorage(STORAGE_KEYS.clients, clients);
    return clients;
  },

  // --- Tasks ---
  getTasks() {
    return loadFromStorage(STORAGE_KEYS.tasks, DEFAULT_TASKS);
  },

  getTasksByProject(projectId) {
    return this.getTasks().filter(t => t.projectId === projectId);
  },

  getTasksByStatus(status) {
    return this.getTasks().filter(t => t.status === status);
  },

  addTask(task) {
    const tasks = this.getTasks();
    const newTask = {
      id: generateId(),
      status: 'todo',
      priority: 'medium',
      source: 'manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...task,
    };
    tasks.push(newTask);
    saveToStorage(STORAGE_KEYS.tasks, tasks);
    return newTask;
  },

  updateTask(id, updates) {
    const tasks = this.getTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx >= 0) {
      tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
      saveToStorage(STORAGE_KEYS.tasks, tasks);
      return tasks[idx];
    }
    return null;
  },

  deleteTask(id) {
    const tasks = this.getTasks().filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.tasks, tasks);
    return tasks;
  },

  // --- Invoices ---
  getInvoices() {
    return loadFromStorage(STORAGE_KEYS.invoices, []);
  },

  getInvoicesByProject(projectId) {
    return this.getInvoices().filter(i => i.projectId === projectId);
  },

  addInvoice(invoice) {
    const invoices = this.getInvoices();
    const newInvoice = {
      id: generateId(),
      status: 'to_create',
      createdAt: new Date().toISOString(),
      sentAt: null,
      paidAt: null,
      ...invoice,
    };
    invoices.push(newInvoice);
    saveToStorage(STORAGE_KEYS.invoices, invoices);
    return newInvoice;
  },

  updateInvoice(id, updates) {
    const invoices = this.getInvoices();
    const idx = invoices.findIndex(i => i.id === id);
    if (idx >= 0) {
      invoices[idx] = { ...invoices[idx], ...updates };
      saveToStorage(STORAGE_KEYS.invoices, invoices);
      return invoices[idx];
    }
    return null;
  },

  deleteInvoice(id) {
    const invoices = this.getInvoices().filter(i => i.id !== id);
    saveToStorage(STORAGE_KEYS.invoices, invoices);
    return invoices;
  },

  // --- Import / Export (for Claude Code sync) ---
  exportAll() {
    return JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      clients: this.getClients(),
      tasks: this.getTasks(),
      invoices: this.getInvoices(),
    }, null, 2);
  },

  importAll(jsonString) {
    try {
      const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      if (data.clients) saveToStorage(STORAGE_KEYS.clients, data.clients);
      if (data.tasks) saveToStorage(STORAGE_KEYS.tasks, data.tasks);
      if (data.invoices) saveToStorage(STORAGE_KEYS.invoices, data.invoices);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  // --- Reset ---
  reset() {
    localStorage.removeItem(STORAGE_KEYS.clients);
    localStorage.removeItem(STORAGE_KEYS.tasks);
    localStorage.removeItem(STORAGE_KEYS.invoices);
  },
};

export default store;
export { generateId, DEFAULT_CLIENTS, DEFAULT_TASKS };
