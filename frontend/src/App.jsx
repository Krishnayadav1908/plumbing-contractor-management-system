import { useEffect, useState } from "react";
import { apiBaseUrl, customerApi } from "./api";
import "./App.css";

const emptyForm = { name: "", phone: "", email: "", address: "" };

function App() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = async (term = search) => {
    try {
      const response = await customerApi.list(term);
      setCustomers(response.data.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load customers. Is the API running?",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers("");
  }, []);

  useEffect(() => {
    const events = new EventSource(`${apiBaseUrl}/customers/events`);
    events.onmessage = () => loadCustomers();

    return () => events.close();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) await customerApi.update(editingId, form);
      else await customerApi.create(form);
      setForm(emptyForm);
      setEditingId(null);
      await loadCustomers();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to save customer.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await customerApi.remove(id);
      await loadCustomers();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to delete customer.",
      );
    }
  };

  const startEditing = (customer) => {
    setEditingId(customer._id);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address,
    });
  };

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">FIELDWORK / 01</span>
          <h1>Pipe &amp; Ledger</h1>
        </div>
        <div className="status">
          <span className="status-dot" /> Operations desk
        </div>
      </header>
      <section className="intro">
        <div>
          <p className="eyebrow">CUSTOMER DIRECTORY</p>
          <h2>Know who you’re building for.</h2>
          <p className="subtle">
            Keep every household, site contact, and conversation close at hand.
          </p>
        </div>
        <div className="metric">
          <strong>{customers.length.toString().padStart(2, "0")}</strong>
          <span>
            customers
            <br />
            on file
          </span>
        </div>
      </section>
      {error && <div className="alert">{error}</div>}
      <section className="workspace">
        <div className="directory panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">DIRECTORY</p>
              <h3>Customers</h3>
            </div>
            <span className="count">{customers.length} total</span>
          </div>
          <form
            className="search"
            onSubmit={(event) => {
              event.preventDefault();
              loadCustomers();
            }}
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone, or email"
            />
            <button type="submit">Search</button>
          </form>
          {loading ? (
            <p className="empty">Loading customers...</p>
          ) : customers.length === 0 ? (
            <p className="empty">No customers yet. Add the first record.</p>
          ) : (
            <div className="customer-list">
              {customers.map((customer) => (
                <article className="customer-row" key={customer._id}>
                  <div className="avatar">
                    {customer.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="customer-copy">
                    <strong>{customer.name}</strong>
                    <span>
                      {customer.phone} {customer.email && `· ${customer.email}`}
                    </span>
                    <small>{customer.address}</small>
                  </div>
                  <div className="row-actions">
                    <button
                      type="button"
                      onClick={() => startEditing(customer)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(customer._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <form className="form panel" onSubmit={handleSubmit}>
          <div className="panel-head">
            <div>
              <p className="eyebrow">
                {editingId ? "EDIT RECORD" : "NEW RECORD"}
              </p>
              <h3>{editingId ? "Update customer" : "Add customer"}</h3>
            </div>
          </div>
          <label>
            Name
            <input
              required
              minLength="2"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="e.g. Marina Clarke"
            />
          </label>
          <label>
            Phone
            <input
              required
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              placeholder="e.g. +1 555 014 9200"
            />
          </label>
          <label>
            Email <span className="optional">optional</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder="marina@example.com"
            />
          </label>
          <label>
            Address
            <textarea
              required
              rows="3"
              value={form.address}
              onChange={(event) =>
                setForm({ ...form, address: event.target.value })
              }
              placeholder="Service address"
            />
          </label>
          <div className="form-actions">
            <button className="primary" disabled={saving} type="submit">
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Add customer"}
            </button>
            {editingId && (
              <button
                className="secondary"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}

export default App;
