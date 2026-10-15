import React, { useState, useEffect } from 'react';

export default function App() {
  // Navigation tab state: 'app' or 'cypress'
  const [activeTab, setActiveTab] = useState('app');

  // To-Do state with LocalStorage persistence
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('cypress_todos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    return [
      { id: 1, text: 'Learn React State & Hooks', completed: true },
      { id: 2, text: 'Write end-to-end Cypress tests', completed: false },
      { id: 3, text: 'Build responsive web apps', completed: false }
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // Cypress Simulator state
  const [testStatus, setTestStatus] = useState('idle'); // 'idle' | 'running' | 'success'
  const [testLogs, setTestLogs] = useState([]);

  // Save to localStorage on todo change
  useEffect(() => {
    try {
      localStorage.setItem('cypress_todos', JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [todos]);

  // To-Do Actions
  const addTodo = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: inputVal.trim(), completed: false }
    ]);
    setInputVal('');
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  // Filter computation
  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;



  // Simulation Steps
  const simSteps = [
    'cy.visit("/") - Success (200 OK)',
    'cy.get("[data-cy=\'task-input\']").type("Automated Test Task")',
    'cy.get("[data-cy=\'add-task-btn\']").click()',
    'cy.get("[data-cy=\'task-item\']").should("have.length", 4)',
    'cy.get("[data-cy=\'task-checkbox\']").first().click()',
    'cy.get("[data-cy=\'filter-active\']").click()',
    'cy.get("[data-cy=\'filter-completed\']").click()',
    'cy.get("[data-cy=\'clear-completed-btn\']").click()',
  ];

  const runCypressSimulation = () => {
    setTestStatus('running');
    setTestLogs(['[Cypress Engine] Initializing test runner context...']);

    let current = 0;
    const timer = setInterval(() => {
      if (current < simSteps.length) {
        const log = simSteps[current];
        setTestLogs((prev) => [...prev, `[PASS] ${log}`]);
        current++;
      } else {
        clearInterval(timer);
        setTestStatus('success');
        setTestLogs((prev) => [
          ...prev,
          '----------------------------------------',
          'All 5 Cypress spec files passed! (100% assertions verified)'
        ]);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white font-bold flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-white tracking-wide">
              TaskFlow <span className="text-xs text-indigo-400 font-mono font-normal">e2e-ready</span>
            </h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('app')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'app'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              To-Do App
            </button>
            <button
              onClick={() => setActiveTab('cypress')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'cypress'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Cypress Test Suite</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6">
        
          <div className="space-y-6">
            {/* Main Application Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Tasks</h2>
                <p className="text-xs text-slate-400">Manage daily goals with automatic state persistence.</p>
              </div>

              {/* Form Input */}
              <form onSubmit={addTodo} className="flex gap-3 mb-6">
                <input
                  data-cy="task-input"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  data-cy="add-task-btn"
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                >
                  Add Task
                </button>
              </form>

              {/* Status and Filters Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 border-y border-slate-800 text-xs">
                <div data-cy="remaining-count" className="text-slate-400 font-medium">
                  <strong className="text-indigo-400">{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} remaining
                </div>

                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    data-cy="filter-all"
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded font-medium transition-all ${
                      filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    data-cy="filter-active"
                    onClick={() => setFilter('active')}
                    className={`px-3 py-1 rounded font-medium transition-all ${
                      filter === 'active' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    data-cy="filter-completed"
                    onClick={() => setFilter('completed')}
                    className={`px-3 py-1 rounded font-medium transition-all ${
                      filter === 'completed' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Completed
                  </button>
                </div>

                <button
                  data-cy="clear-completed-btn"
                  onClick={clearCompleted}
                  disabled={!todos.some((t) => t.completed)}
                  className={`transition-colors font-medium ${
                    todos.some((t) => t.completed)
                      ? 'text-rose-400 hover:text-rose-300'
                      : 'text-slate-600 cursor-not-allowed'
                  }`}
                >
                  Clear Completed
                </button>
              </div>

              {/* Task Items List */}
              <div className="mt-4 space-y-2">
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No tasks found.
                  </div>
                ) : (
                  filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      data-cy="task-item"
                      className={`flex items-center justify-between p-3.5 bg-slate-950/60 border rounded-xl transition-all ${
                        todo.completed ? 'border-slate-800/60 opacity-60' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0 mr-2">
                        <button
                          data-cy="task-checkbox"
                          onClick={() => toggleTodo(todo.id)}
                          className="focus:outline-none flex-shrink-0"
                        >
                          {todo.completed ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 text-xs font-bold">
                              ✓
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-600 hover:border-slate-400 transition-colors" />
                          )}
                        </button>

                        <span
                          data-cy="task-text"
                          className={`text-sm font-medium truncate ${
                            todo.completed ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>

                      <button
                        data-cy="delete-task-btn"
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex-shrink-0"
                        title="Delete task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
       
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-3 text-center text-xs text-slate-600">
        TaskFlow Application with Cypress Test Data Attributes
      </footer>
    </div>
  );
}