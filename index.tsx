import React, { useEffect, useRef, useState } from "react"
import { Search, Plus, Upload, RefreshCw, Info, Trash2, FileText, Database, Brain } from "lucide-react"
import "./styles/style.css"
import "./styles/quantum-lab.css" 

const BASE_URL = "http://10.96.150.152:5278"

async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`${res.status} ${res.statusText} — ${msg}`)
  }
  const contentType = res.headers.get("content-type") || ""
  return contentType.includes("application/json") ? res.json() : res.text()
}

interface Index {
  id: string
  name: string
  description?: string
  document_count: number
  created_at: string
  updated_at: string
}

interface IndexPageProps {
  onBackToHome?: () => void
}

const avatarConfigs = [
  { color: "purple", shape: "hexagon", bg: "purple-bg" },
  { color: "blue", shape: "triangle", bg: "blue-bg" },
  { color: "green", shape: "square", bg: "green-bg" },
  { color: "pink", shape: "circle", bg: "pink-bg" },
  { color: "orange", shape: "diamond", bg: "orange-bg" },
]

const getAvatarConfig = (index: number) => avatarConfigs[index % avatarConfigs.length]

export default function App({ onBackToHome }: IndexPageProps) {
  const [indexes, setIndexes] = useState<Index[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [idxName, setIdxName] = useState("")
  const [idxDesc, setIdxDesc] = useState("")
  const [targetIndex, setTargetIndex] = useState("")
  const [docName, setDocName] = useState("")
  const [docType, setDocType] = useState("other")
  const fileRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<Index | null>(null)
  const [getIndexLoading, setGetIndexLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"list" | "create" | "upload">("list")
  const [showFeedback, setShowFeedback] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const loadIndexes = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await api("/indexes/")
      setIndexes(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIndexes()
  }, [])

  const handleCreateIndex = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idxName.trim()) {
      setError("Le nom de l'index est requis.")
      return
    }
    setError("")
    try {
      await api("/indexes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: idxName.trim(), description: idxDesc || null }),
      })
      setIdxName("")
      setIdxDesc("")
      await loadIndexes()
      setActiveTab("list")
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleDeleteIndex = async (name: string) => {
    if (!window.confirm(`Supprimer l'index "${name}" ?`)) return
    try {
      await api(`/indexes/${encodeURIComponent(name)}?force=false`, { method: "DELETE" })
      if (selectedIndex?.name === name) setSelectedIndex(null)
      await loadIndexes()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleGetIndex = async (name: string) => {
    setGetIndexLoading(true)
    setError("")
    try {
      const data = await api(`/indexes/${encodeURIComponent(name)}`)
      setSelectedIndex(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setGetIndexLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!targetIndex.trim()) {
      setError("Renseigne le nom de l'index cible.")
      return
    }
    const file = fileRef.current?.files?.[0]
    if (!file) {
      setError("Choisis un fichier à envoyer.")
      return
    }


    const form = new FormData()
    form.append("file", file)
    if (docName) form.append("document_name", docName)
    if (docType) form.append("document_type", docType)

    try {
      await api(`/indexes/${encodeURIComponent(targetIndex)}/documents/`, {
        method: "POST",
        body: form,
      })
      if (fileRef.current) fileRef.current.value = ""
      setDocName("")
      setDocType("other")
      await loadIndexes()
      await handleGetIndex(targetIndex)
      setActiveTab("list")
    } catch (e: any) {
      setError(e.message)
    }
  }

  const prettyDate = (d?: string) => (d ? new Date(d).toLocaleString("fr-FR") : "—")

  const handleHeaderPageChange = (page: string) => {
    if (page === "Accueil") {
      onBackToHome?.()
    }
  }

  return (
    <div className="app-container index-page">
      <header className="header">
        <div className="header-content">
          {/* Logo and Title */}
          <div className="logo-section">
            <div className="logo">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1>AI Team Platform</h1>
          </div>

          {/* Navigation */}
          <nav className="main-nav">
            <a href="#" className={`nav-link`} onClick={(e) => { e.preventDefault(); handleHeaderPageChange("Accueil"); }}>
              Home Page
            </a>
            <a href="#" className={`nav-link active`} onClick={(e) => { e.preventDefault(); }}>
              Index Page
            </a>
          </nav>

          {/* User Actions */}
          <div className="header-actions">
            <button className="upgrade-btn" onClick={() => setShowUpgrade(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
              </svg>
              Upgrade
            </button>
            <button className="feedback-btn" onClick={() => setShowFeedback(!showFeedback)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor" />
              </svg>
              Feedback
            </button>
            <button className="avatar-btn" onClick={() => setShowProfile(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="currentColor" />
                <path d="M12 14C7.58172 14 4 14.8954 4 16C4 17.1046 7.58172 18 12 18C16.4183 18 20 17.1046 20 16C20 14.8954 16.4183 14 12 14Z" fill="currentColor" />
              </svg>
            </button>
          </div>

          {/* Feedback Popup - Style Vercel */}
          {showFeedback && (
            <div className="popup-overlay" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000
            }} onClick={() => setShowFeedback(false)}>
              <div style={{
                position: 'absolute',
                top: '60px',
                right: '20px',
                zIndex: 1001,
                width: '300px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#222',
                padding: '16px'
              }} onClick={e => e.stopPropagation()}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontWeight: 600,
                    color: '#000',
                    fontSize: '14px',
                    marginBottom: '12px'
                  }}>Share Feedback</div>
                  <select 
                    className="popup-select"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0',
                      marginBottom: '12px',
                      fontSize: '14px',
                      color: '#222',
                      backgroundColor: '#fafafa',
                      outline: 'none',
                      cursor: 'pointer'
                    }}>
                    <option value="">Select a topic...</option>
                    <option value="bug">Bug</option>
                    <option value="idea">Idea</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea 
                    className="popup-textarea" 
                    placeholder="Your feedback..."
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0',
                      fontSize: '14px',
                      color: '#222',
                      backgroundColor: '#fafafa',
                      resize: 'vertical',
                      marginBottom: '12px',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                      outline: 'none'
                    }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginTop: '8px'
                  }}>
                    <button 
                      className="popup-send"
                      style={{
                        padding: '6px 16px',
                        backgroundColor: '#000',
                        color: '#fff',
                        WebkitTextFillColor: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                      onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Profile Popup (copié) */}
      {showProfile && (
        <div className="popup-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000
        }} onClick={() => setShowProfile(false)}>
          <div style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            zIndex: 1001,
            width: '240px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#222'
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{
                fontWeight: 600,
                color: '#000',
                fontSize: '14px',
                lineHeight: '1.2'
              }}>imane-glitch</div>
              <div style={{
                color: '#666',
                fontSize: '13px',
                lineHeight: '1.3',
                wordBreak: 'break-all'
              }}>imane.iguderzen76@gmail.com</div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '8px 0' }}>
              {[
                { label: 'Log Out' }
              ].map((item, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    color: '#222',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                    fontSize: '14px',
                    position: 'relative'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              backgroundColor: '#f0f0f0',
              margin: '8px 0'
            }}></div>

            {/* Upgrade Button */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fafafa',
              textAlign: 'center',
              borderTop: '1px solid #f0f0f0'
            }}>
              <button 
                className="upgrade-pro-button"
                onClick={() => setShowUpgrade(true)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: '#000',
                  color: '#fff',
                  WebkitTextFillColor: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  outline: 'none',
                  letterSpacing: '0.2px',
                  margin: 0,
                  lineHeight: 'normal',
                  textAlign: 'center',
                  textDecoration: 'none',
                  verticalAlign: 'middle',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
                onFocus={e => e.currentTarget.style.opacity = '0.9'}
                onBlur={e => e.currentTarget.style.opacity = '1'}>
                  Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="container">
        <div className="main-content">
          {/* Error Alert */}
          {error && (
            <div className="error-alert">
              <div className="error-content">
                <div className="error-icon">
                  <span>!</span>
                </div>
                <p className="error-message">{error}</p>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="nav-tabs">
            <button onClick={() => setActiveTab("list")} className={`nav-tab ${activeTab === "list" ? "active" : ""}`}>
              <Search className="tab-icon" />
              Liste des indexes
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`nav-tab ${activeTab === "create" ? "active" : ""}`}>
              <Plus className="tab-icon" />
              Créer un index
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`nav-tab ${activeTab === "upload" ? "active" : ""}`}>
              <Upload className="tab-icon" />
              Uploader un document
            </button>
          </div>

          {/* Content */}
          {activeTab === "list" && (
            <div className="list-layout">
              <div className="indexes-section">
                <div className="section-header">
                  <h2 className="section-title">Indexes ({indexes.length})</h2>
                </div>

                {loading ? (
                  // Show table header + skeleton rows while loading
                  <div className="table-container">
                    <div className="table-header">
                      <div className="table-row header-row">
                        <div className="table-cell">NOM</div>
                        <div className="table-cell">DESCRIPTION</div>
                        <div className="table-cell">DOCUMENTS</div>
                        <div className="table-cell">CRÉÉ</div>
                        <div className="table-cell">ACTIONS</div>
                      </div>
                    </div>
                    <div className="table-body">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="table-row data-row skeleton-row">
                          <div className="table-cell"><div className="skeleton skeleton-text"/></div>
                          <div className="table-cell"><div className="skeleton skeleton-text"/></div>
                          <div className="table-cell"><div className="skeleton skeleton-chip"/></div>
                          <div className="table-cell"><div className="skeleton skeleton-text"/></div>
                          <div className="table-cell"><div className="skeleton skeleton-actions"/></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : indexes.length === 0 ? (
                  <div className="table-container">
                    <div className="table-header">
                      <div className="table-row header-row">
                        <div className="table-cell">NOM</div>
                        <div className="table-cell">DESCRIPTION</div>
                        <div className="table-cell">DOCUMENTS</div>
                        <div className="table-cell">CRÉÉ</div>
                        <div className="table-cell">ACTIONS</div>
                      </div>
                    </div>
                    <div className="empty-table-state">
                      <Database className="empty-icon" />
                      <p className="empty-text">Aucun index pour le moment</p>
                      <button onClick={() => setActiveTab("create")} className="create-first-link">
                        Créer votre premier index
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="table-container">
                    <div className="table-header">
                      <div className="table-row header-row">
                        <div className="table-cell">NOM</div>
                        <div className="table-cell">DESCRIPTION</div>
                        <div className="table-cell">DOCUMENTS</div>
                        <div className="table-cell">CRÉÉ</div>
                        <div className="table-cell">ACTIONS</div>
                      </div>
                    </div>
                    <div className="table-body">
                      {indexes.map((idx) => (
                        <div key={idx.id} className="table-row data-row">
                          <div className="table-cell">
                            <button onClick={() => handleGetIndex(idx.name)} className="index-name-btn">
                              {idx.name}
                            </button>
                          </div>
                          <div className="table-cell">{idx.description || "—"}</div>
                          <div className="table-cell">{idx.document_count}</div>
                          <div className="table-cell">{prettyDate(idx.created_at)}</div>
                          <div className="table-cell">
                            <div className="table-actions">
                              <button
                                onClick={() => handleGetIndex(idx.name)}
                                className="action-btn info"
                                title="Voir les détails">
                                <Info />
                              </button>
                              <button
                                onClick={() => handleDeleteIndex(idx.name)}
                                className="action-btn delete"
                                title="Supprimer">
                                <Trash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="details-section">
                <div className="section-header">
                  <h2 className="section-title">Détails de l'Index</h2>
                </div>

                {selectedIndex ? (
                  <div className="details-content">
                    {getIndexLoading ? (
                      <div className="loading-state">
                        <RefreshCw className="loading-spinner" />
                      </div>
                    ) : (
                      <>
                        <div className="detail-item">
                          <label>Nom</label>
                          <p className="detail-value">{selectedIndex.name}</p>
                        </div>
                        <div className="detail-item">
                          <label>Description</label>
                          <p className="detail-text">{selectedIndex.description || "—"}</p>
                        </div>
                        <div className="detail-item">
                          <label>Documents</label>
                          <div className="document-count">
                            <FileText className="doc-icon" />
                            <span className="detail-value">{selectedIndex.document_count}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <label>Créé le</label>
                          <p className="detail-text">{prettyDate(selectedIndex.created_at)}</p>
                        </div>
                        <div className="detail-item">
                          <label>Dernière mise à jour</label>
                          <p className="detail-text">{prettyDate(selectedIndex.updated_at)}</p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="empty-details">
                    <Info className="empty-details-icon" />
                    <p className="empty-details-text">Sélectionnez un index pour voir les détails</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "create" && (
            <div className="form-container">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Créer un nouvel index</h2>
                  <p className="card-subtitle">Ajoutez un nouvel index pour organiser vos documents</p>
                </div>
                <form onSubmit={handleCreateIndex} className="form">
                  <div className="form-group">
                    <label className="form-label">Nom de l'index *</label>
                    <input
                      type="text"
                      value={idxName}
                      onChange={(e) => setIdxName(e.target.value)}
                      placeholder="ex: MSC CRUISES RFP"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={4}
                      value={idxDesc}
                      onChange={(e) => setIdxDesc(e.target.value)}
                      placeholder="Description optionnelle de l'index..."
                      className="form-textarea"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Créer l'index
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdxName("")
                        setIdxDesc("")
                      }}
                      className="btn btn-secondary"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="form-container">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Uploader un document</h2>
                  <p className="card-subtitle">Ajoutez un document à un index existant</p>
                </div>
                <form onSubmit={handleUpload} className="form">
                  <div className="form-group">
                    <label className="form-label">Index cible *</label>
                    <input
                      type="text"
                      value={targetIndex}
                      onChange={(e) => setTargetIndex(e.target.value)}
                      placeholder="Nom de l'index existant"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom du document</label>
                    <input
                      type="text"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="Nom optionnel du document"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type de document</label>
                    <input
                      type="text"
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      placeholder="Type du document"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fichier *</label>
                    <input type="file" ref={fileRef} className="form-file" required />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-success">
                      Uploader & Indexer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetIndex("")
                        setDocName("")
                        setDocType("")
                        if (fileRef.current) fileRef.current.value = ""
                      }}
                      className="btn btn-secondary">
                      Réinitialiser
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
