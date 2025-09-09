import React, { useState, useRef, useEffect } from "react"
import type { ReactNode } from "react"
import {
  Plus,
  Brain,
  Settings,
  Activity,
  Code,
  Database,
  MessageSquare,
  Hexagon,
  Triangle,
  Circle,
  Square,

  TrendingUp,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Users,
  Wand2,
  Shuffle,
  Sparkles,
  Menu,
  Edit3,
  Trash2,
  LogOut,
} from "lucide-react"
import "./styles/quantum-lab.css"
import "./styles/UpgradePlans.css"
import UpgradePlans from "./UpgradePlans";
import IndexPage from "./index";

interface Agent {
  id: string;
  name: string;
  personality: string;
  description: string;
  skills: string[];
  shape: 'hexagon' | 'triangle' | 'circle' | 'square';
  color: string;
  creativity: number;
  logic: number;
  status: 'active' | 'training' | 'idle';
  tasksCompleted: number;
  efficiency: number;
}

interface ActivityItem {
  id: string
  type: "success" | "warning" | "info"
  title: string
  time: string
  agent?: string
}

// Déplacer la définition des agents initiaux en dehors du composant
const initialAgents: Agent[] = [
  {
    id: 'alex',
    name: 'Alex',
    personality: 'Analytical and Logical',
    description: 'Expert in data analysis and complex problem solving with a methodical and structured approach.',
    skills: ['Data Analysis', 'Problem Solving', 'Automation'],
    shape: 'hexagon',
    color: '#8B5CF6',
    creativity: 60,
    logic: 95,
    status: 'active',
    tasksCompleted: 124,
    efficiency: 98,
  },
  {
    id: "sophia",
    name: "Sophia",
    personality: "Creative Content Strategist",
    description: "Expert in creative content strategy and development of effective marketing campaigns.",
    skills: ["Creative Writing", "Content Strategy", "Brand Development", "SEO"],
    shape: "triangle",
    color: "#8b5cf6",
    creativity: 96,
    logic: 78,
    status: "active",
    tasksCompleted: 189,
    efficiency: 91,
  },
  {
    id: "nova",
    name: "Nova",
    personality: "Expert en optimisation des performances",
    description: "Specialist in system optimization and cloud architecture, with a focus on efficiency and process automation.",
    skills: ["System Optimization", "DevOps", "Cloud Architecture", "Automation"],
    shape: "square",
    color: "#10b981",
    creativity: 82,
    logic: 93,
    status: "training",
    tasksCompleted: 312,
    efficiency: 97,
  },
  {
    id: "guardian",
    name: "Guardian",
    personality: "Security & Compliance Specialist",
    description: "Expert in IT security and regulatory compliance, with a focus on data and system protection.",
    skills: ["Cybersecurity", "Risk Assessment", "Compliance", "Audit"],
    shape: "hexagon",
    color: "#ec4899",
    creativity: 65,
    logic: 98,
    status: "active",
    tasksCompleted: 156,
    efficiency: 89,
  },
  {
    id: "quantum",
    name: "Quantum",
    personality: "Research & Innovation Lead",
    description: "Expert in research and innovation, with a focus on developing new technologies and solutions.",
    skills: ["Research", "Innovation", "Strategy", "Analysis"],
    shape: "circle",
    color: "#f59e0b",
    creativity: 88,
    logic: 91,
    status: "active",
    tasksCompleted: 203,
    efficiency: 93,
  },
  {
    id: "phoenix",
    name: "Phoenix",
    personality: "Customer Experience Designer",
    description: "Expert in user experience design, with a focus on creating intuitive and engaging user interfaces.",
    skills: ["UX Design", "Customer Research", "Prototyping", "Testing"],
    shape: "triangle",
    color: "#ef4444",
    creativity: 94,
    logic: 84,
    status: "idle",
    tasksCompleted: 134,
    efficiency: 86,
  },
  {
    id: "cipher",
    name: "Cipher",
    personality: "Encryption & Privacy Expert",
    description: "Expert in cryptography and privacy, with a focus on data and communication protection.",
    skills: ["Cryptography", "Privacy Protection", "Secure Communications", "Blockchain"],
    shape: "hexagon",
    color: "#06b6d4",
    creativity: 70,
    logic: 97,
    status: "active",
    tasksCompleted: 178,
    efficiency: 92,
  },
  {
    id: "aurora",
    name: "Aurora",
    personality: "Marketing Automation Specialist",
    description: "Expert in marketing automation, with a focus on creating effective and automated marketing campaigns.",
    skills: ["Marketing Automation", "Lead Generation", "Email Campaigns", "Analytics"],
    shape: "circle",
    color: "#10b981",
    creativity: 85,
    logic: 82,
    status: "active",
    tasksCompleted: 267,
    efficiency: 88,
  },
  {
    id: "nexus",
    name: "Nexus",
    personality: "Integration & API Expert",
    description: "Expert in integration and APIs, with a focus on creating efficient and secure application programming interfaces.",
    skills: ["API Development", "System Integration", "Microservices", "Cloud Native"],
    shape: "square",
    color: "#f59e0b",
    creativity: 78,
    logic: 95,
    status: "training",
    tasksCompleted: 145,
    efficiency: 90,
  },
  {
    id: "echo",
    name: "Echo",
    personality: "Voice & Audio Processing",
    description: "Expert in voice and audio processing, with a focus on creating speech recognition and audio processing solutions.",
    skills: ["Speech Recognition", "Audio Processing", "Voice Synthesis", "NLP"],
    shape: "triangle",
    color: "#ec4899",
    creativity: 92,
    logic: 87,
    status: "active",
    tasksCompleted: 198,
    efficiency: 89,
  },
  {
    id: "prism",
    name: "Prism",
    personality: "Data Visualization Expert",
    description: "Expert in data visualization, with a focus on creating clear and impactful data visualizations.",
    skills: ["Data Visualization", "Dashboard Design", "Business Intelligence", "Reporting"],
    shape: "hexagon",
    color: "#8b5cf6",
    creativity: 94,
    logic: 85,
    status: "active",
    tasksCompleted: 223,
    efficiency: 91,
  },
  {
    id: "forge",
    name: "Forge",
    personality: "DevOps & Infrastructure",
    description: "Expert in DevOps and infrastructure, with a focus on creating efficient and secure IT systems.",
    skills: ["Infrastructure as Code", "CI/CD", "Container Orchestration", "Monitoring"],
    shape: "square",
    color: "#ef4444",
    creativity: 75,
    logic: 93,
    status: "active",
    tasksCompleted: 289,
    efficiency: 95,
  },
  {
    id: "sage",
    name: "Sage",
    personality: "Knowledge Management Expert",
    description: "Expert in knowledge management, with a focus on creating effective knowledge management systems.",
    skills: ["Knowledge Base", "Documentation", "Training", "Best Practices"],
    shape: "circle",
    color: "#06b6d4",
    creativity: 88,
    logic: 90,
    status: "idle",
    tasksCompleted: 167,
    efficiency: 87,
  },
  {
    id: "vortex",
    name: "Vortex",
    personality: "AI Research & Development",
    description: "Expert in artificial intelligence research and development, specializing in neural networks and AI ethics, with an innovative and responsible approach.",
    skills: ["Machine Learning", "Neural Networks", "AI Ethics", "Research"],
    shape: "hexagon",
    color: "#8b5cf6",
    creativity: 94,
    logic: 96,
    status: "training",
    tasksCompleted: 176,
    efficiency: 94,
  },
]

const agentShapes = {
  hexagon: Hexagon,
  triangle: Triangle,
  circle: Circle,
  square: Square,
}

const colorPalettes = [
  { name: "Cosmic", colors: ["#8B5CF6", "#06B6D4", "#10B981"] },
  { name: "Fire", colors: ["#EF4444", "#F97316", "#FBBF24"] },
  { name: "Ocean", colors: ["#3B82F6", "#06B6D4", "#0891B2"] },
  { name: "Forest", colors: ["#10B981", "#059669", "#047857"] },
  { name: "Sunset", colors: ["#F59E0B", "#EF4444", "#EC4899"] },
  { name: "Galaxy", colors: ["#8B5CF6", "#EC4899", "#06B6D4"] },
]

const skillSuggestions = [
  "Data Analysis",
  "Machine Learning",
  "Creative Writing",
  "Content Strategy",
  "Code Generation",
  "Strategy Planning",
  "Customer Support",
  "Content Creation",
  "Research",
  "Problem Solving",
  "Marketing",
  "UX Design",
  "Translation",
  "Automation",
  "Teaching",
  "Debugging",
  "Project Management",
  "Quality Assurance",
  "DevOps",
]

const activityFeed: ActivityItem[] = [
  { id: "1", type: "success", title: "Alex completed data analysis for Q4 metrics", time: "2 min ago", agent: "Alex" },
  { id: "2", type: "info", title: "Nova deployed optimization update to production", time: "5 min ago", agent: "Nova" },
  { id: "3", type: "success", title: "Sophia published new content strategy", time: "8 min ago", agent: "Sophia" },
  { id: "4", type: "warning", title: "Guardian detected security anomaly", time: "12 min ago", agent: "Guardian" },
  { id: "5", type: "success", title: "Quantum completed research synthesis", time: "15 min ago", agent: "Quantum" },
  { id: "6", type: "info", title: "Phoenix updated user experience guidelines", time: "18 min ago", agent: "Phoenix" },
  { id: "7", type: "success", title: "System performance improved by 23%", time: "22 min ago" },
  { id: "8", type: "info", title: "New agent training module available", time: "25 min ago" },
]

export default function QuantumLab() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [showForge, setShowForge] = useState(false)
  const [forgeStep, setForgeStep] = useState(1)
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [newAgent, setNewAgent] = useState({
    name: "",
    personality: "",
    description: "",
    skills: [] as string[],
    shape: "hexagon" as keyof typeof agentShapes,
    color: "#8B5CF6",
    energy: 50,
    creativity: 50,
    logic: 50,
  })
  const [selectedPalette, setSelectedPalette] = useState(0)
  const [isForging, setIsForging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Chat states
  const [showChat, setShowChat] = useState(false)
  const [isMultiAgentChat, setIsMultiAgentChat] = useState(false)
  const [chatAgent, setChatAgent] = useState<Agent | null>(null)
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])
  const [showAgentSelector, setShowAgentSelector] = useState(false)
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: "user" | "agent"; content: string | ReactNode; timestamp: string; agentId?: string }>
  >([])
  const [chatInput, setChatInput] = useState("")
  const [showChatSidebar, setShowChatSidebar] = useState(true)

  // State for search
  const [searchTerm, setSearchTerm] = useState("")
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.personality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  )

  // Reset selected agents when closing the selector
  useEffect(() => {
    console.log('useEffect - showAgentSelector:', showAgentSelector);
    if (!showAgentSelector) {
      setSearchTerm('');
    } else {
      console.log('Sélecteur d\'agents affiché');
    }
  }, [showAgentSelector]);
  
  // Debug: Log state changes
  useEffect(() => {
    console.log('État mis à jour - showAgentSelector:', showAgentSelector, 'isMultiAgentChat:', isMultiAgentChat);
  }, [showAgentSelector, isMultiAgentChat]);
  
  // Fonction simplifiée pour le débogage
  const debugSelectAgent = (agent: Agent) => {
    console.log('Sélection de l\'agent:', agent.name);
    setSelectedAgents(prev => 
      prev.some(a => a.id === agent.id)
        ? prev.filter(a => a.id !== agent.id)
        : [...prev, agent]
    );
  };

  // Real-time metrics
  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0)
  const activeAgents = agents.filter((agent) => agent.status === "active").length
  const avgEfficiency = Math.round(agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Particle animation for forge effect
  useEffect(() => {
    if (!isForging || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      color: string
    }> = []

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add new particles
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height,
          vx: (Math.random() - 0.5) * 6,
          vy: -Math.random() * 10 - 3,
          life: 1,
          color: colorPalettes[selectedPalette].colors[Math.floor(Math.random() * 3)],
        })
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.015

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      if (isForging) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [isForging, selectedPalette])

  const handleCreateAgent = () => {
    setIsForging(true)
    const isEditing = selectedAgent !== null
    setNotification(isEditing 
      ? `🔄 Updating agent ${newAgent.name}...`
      : "🔥 Forging new AI agent with cosmic energy...")

    setTimeout(() => {
      const agent: Agent = {
        id: isEditing ? selectedAgent.id : `agent-${Date.now()}`,
        name: newAgent.name || "Unnamed Agent",
        personality: newAgent.personality,
        description: newAgent.description || `A highly skilled AI agent specialized in ${newAgent.personality || 'various tasks'}.`,
        skills: [...newAgent.skills],
        shape: newAgent.shape,
        color: newAgent.color,
        creativity: newAgent.creativity,
        logic: newAgent.logic,
        status: isEditing ? selectedAgent.status : "training",
        tasksCompleted: isEditing ? selectedAgent.tasksCompleted : 0,
        efficiency: Math.round((newAgent.energy + newAgent.creativity + newAgent.logic) / 3),
      }

      if (isEditing) {
        setAgents(prevAgents => 
          prevAgents.map(a => a.id === selectedAgent.id ? agent : a)
        )
      } else {
        setAgents(prevAgents => [...prevAgents, agent])
      }

      setSelectedAgent(agent)
      setShowForge(false)
      setForgeStep(1)
      setIsForging(false)
      setNotification(isEditing 
        ? `✨ Agent ${agent.name} successfully updated!`
        : `✨ Agent ${agent.name} successfully forged and deployed!`)

      // Reset form
      setNewAgent({
        name: "",
        personality: "",
        description: "",
        skills: [],
        shape: "hexagon",
        color: "#8B5CF6",
        energy: 50,
        creativity: 50,
        logic: 50,
      })
    }, 3000)
  }

  const addSkill = (skill: string) => {
    if (!newAgent.skills.includes(skill) && newAgent.skills.length < 8) {
      setNewAgent((prev: any) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
    }
  }

  const removeSkill = (skill: string) => {
    setNewAgent((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((s: any) => s !== skill),
    }))
  }

  const randomizeAgent = () => {
    const randomPalette = Math.floor(Math.random() * colorPalettes.length)
    const randomShape = Object.keys(agentShapes)[Math.floor(Math.random() * 4)] as keyof typeof agentShapes
    const randomSkills = skillSuggestions.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 3)

    setNewAgent((prev: any) => ({
      ...prev,
      name: `Agent-${Math.floor(Math.random() * 1000)}`,
      personality: "AI Specialist with advanced capabilities",
      shape: randomShape,
      color: colorPalettes[randomPalette].colors[0],
      skills: randomSkills,
      energy: Math.floor(Math.random() * 40) + 60,
      creativity: Math.floor(Math.random() * 40) + 60,
      logic: Math.floor(Math.random() * 40) + 60,
    }))
    setSelectedPalette(randomPalette)
    setNotification("🎲 Agent configuration randomized!")
  }

  // Active tab for navigation
  const [activePage, setActivePage] = useState<string>('Accueil');

  // Popups Feedback & Profile
  const [showFeedback, setShowFeedback] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Navigation: afficher la page Index quand "AI Team" est sélectionné
  if (activePage === 'Agents') {
    return <IndexPage onBackToHome={() => setActivePage('Accueil')} />;
  }

  if (showUpgrade) {
    return (
      <div style={{ minHeight: '100vh', overflowY: 'auto' }}>
        <UpgradePlans />
      </div>
    );
  }


  return (
    <div className="quantum-lab index-page">
      {/* Background particles */}
      <div className="background-particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Notification Toast */}
      {notification && <div className="notification-toast">{notification}</div>}

      {/* Header */}
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
            <a href="#" className={`nav-link${activePage === 'Accueil' ? ' active' : ''}`} onClick={() => setActivePage('Accueil')}>Home Page</a>
            <a href="#" className={`nav-link${activePage === 'Agents' ? ' active' : ''}`} onClick={() => setActivePage('Agents')}>Index Page</a>
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
                    }}
                  >
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

      {/* Profile Popup */}
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
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    color: '#222',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                    fontSize: '14px',
                    position: 'relative'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>{item.label}</span>
                  <LogOut size={16} />
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

      {/* Bouton Multi-Agent */}
      <div style={{
        position: 'relative',
        zIndex: 1, // Réduit le z-index pour être en dessous des popups
        display: (showChat || showForge) ? 'none' : 'block',
        margin: '-5px 0 0 20px',
        textAlign: 'left',
        filter: (showFeedback || showProfile || showUpgrade) ? 'blur(4px)' : 'none',
        opacity: (showFeedback || showProfile || showUpgrade) ? 0.5 : 1,
        transition: 'all 0.3s ease',
        pointerEvents: (showFeedback || showProfile || showUpgrade) ? 'none' : 'auto'
      }}>
        <button 
          style={{
            background: '#3b82f6',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.4rem 1.2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.9rem',
            lineHeight: '1.1',
            whiteSpace: 'nowrap',
            pointerEvents: 'auto' // Permet les interactions uniquement quand le conteneur le permet
          }}
          aria-label="Start Multi-Agent Collaboration"
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          onClick={() => {
            console.log('Bouton Collaboration IA cliqué - Avant setShowAgentSelector');
            // Afficher le sélecteur d'agents
            setShowAgentSelector(prev => {
              console.log('setShowAgentSelector appelé avec:', !prev);
              return true;
            });
            console.log('Bouton Collaboration IA cliqué - Après setShowAgentSelector');
            
            // Si c'est la première fois qu'on active le mode multi-agents
            if (!isMultiAgentChat) {
              // Créer un agent virtuel pour représenter l'équipe
              const teamAgent: Agent = {
                id: 'multi-agent-team',
                name: 'Équipe IA',
                personality: 'Sélectionnez les agents pour commencer',
                description: 'Une équipe personnalisée d\'agents IA travaillant ensemble',
                skills: [],
                shape: 'circle',
                color: '#8B5CF6',
                creativity: 100,
                logic: 100,
                status: 'active',
                tasksCompleted: 0,
                efficiency: 100
              };
              
              setChatAgent(teamAgent);
              setIsMultiAgentChat(true);
              setShowChat(true);
              
              // Ajouter un message de bienvenue avec bouton de sélection
              const welcomeMessage = {
                id: `welcome-${Date.now()}`,
                sender: 'agent' as const,
                content: (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '12px',
                    maxWidth: '100%',
                    width: '100%'
                  }}>
                    <button 
                      onClick={() => setShowAgentSelector(true)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #4b5563',
                        color: '#60a5fa',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        maxWidth: '500px',
                        justifyContent: 'center',
                        textAlign: 'left'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)';
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#4b5563';
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <Users size={18} style={{
                        flexShrink: 0,
                        marginRight: '8px'
                      }} />
                      <span style={{
                        whiteSpace: 'normal',
                        lineHeight: '1.4'
                      }}>
                        Select the agents you want to chat with.
                      </span>
                    </button>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#9ca3af',
                      textAlign: 'center',
                      width: '100%',
                      marginTop: '4px'
                    }}>
                      Click to select your team’s agents.
                    </div>
                  </div>
                ),
                timestamp: new Date().toISOString(),
                agentId: 'system',
                isButton: true
              };
              
              setChatMessages([welcomeMessage]);
            } else {
              // Si on est déjà en mode multi-agents, on affiche juste le sélecteur
              setShowChat(true);
            }
          }} >
          <Shuffle size={16} font-family={"Ubuntu"}/>
          <span>Start Multi‑Agents</span>
        </button>
        <span style={{
          fontFamily: 'Ubuntu',
          color: '#6b7280',
          fontSize: '0.85rem',
          fontWeight: 500,
          lineHeight: '1.4',
          margin: '6px 0 0 12px',
          display: 'block',
          whiteSpace: 'nowrap'
        }}>Create a discussion with multiple AI agents collaborating together to provide you with complete and detailed answers.</span>

      </div>

      {/* Sélecteur d'agents simplifié - Uniquement en mode multi-agents */}
      {showAgentSelector && isMultiAgentChat && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998
          }}
          onClick={(e) => {
            // Fermer le sélecteur si on clique en dehors de la modale
            if (e.target === e.currentTarget) {
              setShowAgentSelector(false);
            }
          }} >
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            width: '80%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <h2 style={{
              marginTop: 0,
              color: '#333',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
              marginBottom: '15px',
              fontSize: '1.2rem',
              paddingRight: '30px' // Pour éviter que le texte ne passe sous le bouton de fermeture
            }}>
             Select agents
            </h2>
            
            {/* Bouton de fermeture */}
            <button
              onClick={() => setShowAgentSelector(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: '#666',
                padding: '5px',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ 
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '15px'
              }}>
                {selectedAgents.length} agent{selectedAgents.length !== 1 ? 's' : ''} sélectionné{selectedAgents.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '15px',
              maxHeight: '300px',
              overflowY: 'auto',
              padding: '5px'
            }}>
              {agents.slice(0, 5).map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => debugSelectAgent(agent)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '4px',
                    backgroundColor: selectedAgents.some(a => a.id === agent.id) 
                      ? '#e3f2fd' 
                      : '#f5f5f5',
                    cursor: 'pointer',
                    border: selectedAgents.some(a => a.id === agent.id)
                      ? '1px solid #90caf9'
                      : '1px solid #e0e0e0',
                    transition: 'all 0.2s'
                  }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: `${agent.color}20`,
                    border: `1px solid ${agent.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                    flexShrink: 0
                  }}>
                    {React.createElement(agentShapes[agent.shape], {
                      style: { width: '16px', height: '16px', color: agent.color }
                    })}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: '#333' }}>{agent.name}</div>
                    <div style={{ fontSize: '0.8em', color: '#666' }}>{agent.personality}</div>
                  </div>
                  {selectedAgents.some(a => a.id === agent.id) && (
                    <div style={{ color: '#2196f3', marginLeft: '10px' }}>
                      <CheckCircle size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid #eee',
              paddingTop: '15px'
            }}>
              <button
                onClick={() => setSelectedAgents([])}
                disabled={selectedAgents.length === 0}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: selectedAgents.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: selectedAgents.length > 0 ? 1 : 0.5
                }}
              >
                Tout désélectionner
              </button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowAgentSelector(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                
                <button
                  onClick={() => {
                    if (selectedAgents.length > 0) {
                      const teamAgent: Agent = {
                        id: 'multi-agent-team',
                        name: `Équipe (${selectedAgents.length})`,
                        personality: selectedAgents.map(a => a.name).join(', '),
                        description: `Équipe de ${selectedAgents.length} agents IA`,
                        skills: Array.from(new Set(selectedAgents.flatMap(a => a.skills))).slice(0, 5),
                        shape: 'circle',
                        color: '#8B5CF6',
                        creativity: 100,
                        logic: 100,
                        status: 'active',
                        tasksCompleted: 0,
                        efficiency: 100
                      };
                      
                      setChatAgent(teamAgent);
                      
                      const confirmationMessage = {
                        id: `system-${Date.now()}`,
                        sender: 'agent' as const,
                        content: `Vous discutez maintenant avec ${selectedAgents.length} agent${selectedAgents.length > 1 ? 's' : ''} : ${selectedAgents.map(a => a.name).join(', ')}`,
                        timestamp: new Date().toISOString(),
                        agentId: 'system'
                      };
                      
                      setChatMessages(prev => [...prev, confirmationMessage]);
                      setShowAgentSelector(false);
                    }
                  }}
                  disabled={selectedAgents.length === 0}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: selectedAgents.length > 0 ? '#1976d2' : '#e0e0e0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: selectedAgents.length > 0 ? 'pointer' : 'not-allowed',
                    opacity: selectedAgents.length > 0 ? 1 : 0.7
                  }}
                  >
                  Confirm ({selectedAgents.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="main-container">
        {/* Main Lab Area */}
        <div className="lab-area">

          {/* Agent Cards Grid */}
          <div className="agent-cards-container">
            {filteredAgents.map((agent) => {
              const ShapeIcon = agentShapes[agent.shape];
              
              return (
                <div 
                  key={agent.id} 
                  className="agent-card"
                  onClick={() => setSelectedAgent(agent)}
                  style={{ '--agent-color': agent.color } as React.CSSProperties}
                >
                  <div className="agent-card-header">
                    <div 
                      className="agent-avatar"
                      style={{ 
                        backgroundColor: `${agent.color}33`,
                        border: `1px solid ${agent.color}80`
                      }}
                    >
                      <ShapeIcon className="agent-avatar-icon" />
                    </div>
                    <div className="agent-info">
                      <h3 className="agent-name">{agent.name}</h3>
                      <p 
                        className="agent-personality" 
                        style={{ 
                          color: `${agent.color} !important` as any,
                          WebkitTextFillColor: agent.color 
                        }}
                      >
                        {agent.personality}
                      </p>
                      <span className={`agent-status ${agent.status}`}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="agent-card-body">
                    <div className="agent-description">
                      {agent.description}
                    </div>
                    
                    <div className="skills-container">
                      {agent.skills.map((skill) => (
                        <span key={skill} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="agent-card-footer">
                    <div className="agent-meta">
                      <span className="efficiency-badge">{agent.efficiency}% efficiency</span>
                    </div>

                  </div>
                </div>
              );
            })}
            
            {/* Add Agent Card */}
            <div 
              className="agent-card add-agent-card"
              onClick={() => setShowForge(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px dashed rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'visible',
                boxShadow: 'none',
                background: 'transparent',
                backdropFilter: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 style={{ 
                  color: 'white', 
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                }}>
                  Add New Agent
                </h3>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.875rem',
                  margin: 0,
                }}>
                  Create a custom AI agent
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="side-panel">
          {selectedAgent ? (
            <div>
              {/* Agent Details */}
              <div className="panel-section">
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border-2"
                    style={{
                      backgroundColor: selectedAgent.color + "20",
                      borderColor: selectedAgent.color,
                    }}
                  >
                    {(() => {
                      const SelectedShapeIcon = agentShapes[selectedAgent.shape]
                      return <SelectedShapeIcon className="w-8 h-8 text-white" />
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedAgent.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{selectedAgent.personality}</p>
                    <span
                      className={`badge ${
                        selectedAgent.status === "active"
                          ? "badge-success"
                          : selectedAgent.status === "training"
                            ? "badge-warning"
                            : "badge-gray"
                      }`}
                    >
                      {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-value">{selectedAgent.tasksCompleted}</div>
                    <div className="metric-label">Tasks Completed</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{selectedAgent.efficiency}%</div>
                    <div className="metric-label">Efficiency</div>
                  </div>
                </div>

                {/* Agent Stats */}
                <div className="grid-3">
                  <div className="text-center">
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{selectedAgent.creativity}%</div>
                    <div className="text-xs text-gray-400">Creativity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{selectedAgent.logic}%</div>
                    <div className="text-xs text-gray-400">Logic</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-8">
                  <h4
                    className="section-title force-black"
                    style={{ color: '#000', WebkitTextFillColor: '#000' as any }}
                  >
                    <Code className="w-4 h-4" style={{ color: '#000' }} />
                    Core Skills
                  </h4>
                  <div className="skills-container">
                    {selectedAgent.skills.map((skill) => (
                      <span key={skill} className="badge badge-outline text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                  <h4
                    className="section-title force-black"
                    style={{ color: '#000', WebkitTextFillColor: '#000' as any }}
                  >
                    Quick Actions
                  </h4>
                  <div className="quick-actions-grid">
                    <button
                      onClick={() => {
                        setChatAgent(selectedAgent)
                        setShowChat(true)
                        // Initialize chat with welcome message
                        setChatMessages([
                          {
                            id: Date.now().toString(),
                            sender: "agent",
                            content: `Hello! I'm ${selectedAgent?.name}. I'm ready to help you with ${selectedAgent?.skills.join(", ").toLowerCase()}. What would you like to work on today?`,
                            timestamp: "Just now",
                          },
                        ])
                      }}
                      className="btn btn-secondary btn-sm">
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete ${selectedAgent.name}? This action cannot be undone.`)) {
                          setAgents(prevAgents => prevAgents.filter(a => a.id !== selectedAgent.id));
                          setSelectedAgent(null);
                          setNotification(`Agent ${selectedAgent.name} has been deleted.`);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Agent
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowForge(true);
                        setForgeStep(1);
                      }}>
                      <Edit3 className="w-4 h-4" />
                      Edit Agent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* System Overview */}
              <div className="panel-section">
                <h3 className="section-title force-black" style={{ color: '#000', WebkitTextFillColor: '#000' as any }}>
                  <BarChart3 className="w-5 h-5" style={{ color: '#000' }} />
                  System Overview
                </h3>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-value">{agents.length}</div>
                    <div className="metric-label">Total Agents</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{activeAgents}</div>
                    <div className="metric-label">Active Now</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{totalTasks}</div>
                    <div className="metric-label">Tasks Done</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{avgEfficiency}%</div>
                    <div className="metric-label">Avg Efficiency</div>
                  </div>
                </div>
              </div>

              {/* Live Activity Feed */}
              <div className="panel-section">
                <h3 className="section-title force-black" style={{ color: '#000', WebkitTextFillColor: '#000' as any }}>
                  <Activity className="w-5 h-5" style={{ color: '#000' }} />
                  Live Activity
                </h3>
                <div className="activity-feed">
                  {activityFeed.slice(0, 6).map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className={`activity-icon ${activity.type}`}>
                        {activity.type === "success" && <CheckCircle className="w-4 h-4" />}
                        {activity.type === "warning" && <AlertTriangle className="w-4 h-4" />}
                        {activity.type === "info" && <Info className="w-4 h-4" />}
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">{activity.title}</div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="panel-section">
                <h3 className="section-title force-black" style={{ color: '#000', WebkitTextFillColor: '#000' as any }}>
                  <TrendingUp className="w-5 h-5" style={{ color: '#000' }} />
                  Performance Insights
                </h3>
                <div className="insights-list">
                  <div className="insight-item">
                    <span className="insight-label">System Uptime</span>
                    <span className="insight-value success">99.9%</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Response Time</span>
                    <span className="insight-value info">0.3s</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Success Rate</span>
                    <span className="insight-value success">97.2%</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Cost Optimization</span>
                    <span className="insight-value purple">€127K saved</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forge Modal */}
      {showForge && (
        <div className="forge-modal">
          <div className="forge-container">
            {/* Header */}
            <div className="forge-header">
              <div className="forge-header-left">
                <div className="forge-icon">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="forge-title">AI Agent Forge</h2>
                  <p className="forge-subtitle">Step {forgeStep} of 4 - Enterprise Agent Creation</p>
                </div>
              </div>
              <div className="forge-header-right">
                <button onClick={randomizeAgent} className="btn btn-secondary btn-sm">
                  <Shuffle className="w-4 h-4" />
                  Randomize
                </button>
                <button onClick={() => setShowForge(false)} className="btn btn-ghost btn-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="forge-content">
              {forgeStep === 1 && (
                <div className="forge-step-content">
                  <div className="forge-step-header">
                    <h3 className="forge-step-title">Agent Identity & Purpose</h3>
                    <p className="forge-step-description">Define your AI agent's core identity and business role</p>
                  </div>

                  <div className="forge-grid">
                    <div className="forge-form-section">
                      <div className="form-group">
                        <label className="form-label">Agent Name</label>
                        <input
                          value={newAgent.name}
                          onChange={(e) => setNewAgent((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., DataMaster, ContentGenie, SecurityGuard..."
                          className="input-field"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Business Role & Personality</label>
                        <textarea
                          value={newAgent.personality}
                          onChange={(e) => setNewAgent((prev) => ({ ...prev, personality: e.target.value }))}
                          placeholder="Describe the agent's business role, personality, and how it should interact with teams and clients..."
                          className="textarea-field"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Detailed Description</label>
                        <textarea
                          value={newAgent.description}
                          onChange={(e) => setNewAgent((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Provide a detailed description of the agent's purpose, capabilities, and how it will be used..."
                          className="textarea-field"
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="forge-preview-section">
                      <div className="relative">
                        <canvas
                          ref={canvasRef}
                          className="absolute inset-0 pointer-events-none"
                          style={{ width: "200px", height: "200px" }}
                        />
                        {(() => {
                          const PreviewShapeIcon = agentShapes[newAgent.shape]
                          return (
                            <div
                              className="forge-preview"
                              style={{
                                backgroundColor: newAgent.color + "20",
                                borderColor: newAgent.color,
                                boxShadow: `0 0 30px ${newAgent.color}40`,
                              }}
                            >
                              <PreviewShapeIcon className="w-12 h-12 text-white" />
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {forgeStep === 2 && (
                <div className="forge-step-content">
                  <div className="forge-step-header">
                    <h3 className="forge-step-title">Core Competencies & Skills</h3>
                    <p className="forge-step-description">Select the business capabilities your agent will excel at</p>
                  </div>

                  <div className="space-y-6">
                    <div className="form-group">
                      <label className="form-label">Selected Skills ({newAgent.skills.length}/8)</label>
                      <div className="skills-selected">
                        {newAgent.skills.map((skill) => (
                          <div key={skill} className="skill-tag" onClick={() => removeSkill(skill)}>
                            {skill} <X className="w-3 h-3" />
                          </div>
                        ))}
                        {newAgent.skills.length === 0 && (
                          <p className="skills-empty">Click skills below to add them to your agent</p>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Available Business Skills</label>
                      <div className="skills-available">
                        {skillSuggestions.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => addSkill(skill)}
                            className={`btn btn-secondary btn-sm ${
                              newAgent.skills.includes(skill) ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={newAgent.skills.includes(skill) || newAgent.skills.length >= 8}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {forgeStep === 3 && (
                <div className="forge-step-content">
                  <div className="forge-step-header">
                    <h3 className="forge-step-title">Visual Identity & Branding</h3>
                    <p className="forge-step-description">Customize your agent's visual representation</p>
                  </div>

                  <div className="forge-grid">
                    <div className="forge-form-section">
                      <div className="form-group">
                        <label className="form-label">Agent Form</label>
                        <div className="shape-grid">
                          {Object.entries(agentShapes).map(([shape, Icon]) => (
                            <button
                              key={shape}
                              onClick={() =>
                                setNewAgent((prev) => ({ ...prev, shape: shape as keyof typeof agentShapes }))
                              }
                              className={`shape-option ${newAgent.shape === shape ? "selected" : ""}`}
                            >
                              <Icon className="w-8 h-8 text-white" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Brand Color Palette</label>
                        <div className="color-palettes">
                          {colorPalettes.map((palette, index) => (
                            <div
                              key={palette.name}
                              onClick={() => {
                                setSelectedPalette(index)
                                setNewAgent((prev) => ({ ...prev, color: palette.colors[0] }))
                              }}
                              className={`color-palette ${selectedPalette === index ? "selected" : ""}`}
                            >
                              <div className="palette-colors">
                                {palette.colors.map((color, i) => (
                                  <div key={i} className="palette-color" style={{ backgroundColor: color }} />
                                ))}
                              </div>
                              <p className="palette-name">{palette.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="forge-preview-section">
                      {(() => {
                        const PreviewShapeIcon = agentShapes[newAgent.shape]
                        return (
                          <div
                            className="forge-preview"
                            style={{
                              backgroundColor: newAgent.color + "20",
                              borderColor: newAgent.color,
                              boxShadow: `0 0 40px ${newAgent.color}60`,
                            }}
                          >
                            <PreviewShapeIcon className="w-16 h-16 text-white" />
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {forgeStep === 4 && (
                <div className="forge-step-content">
                  <div className="forge-step-header">
                    <h3 className="forge-step-title">Performance Configuration</h3>
                    <p className="forge-step-description">
                      Fine-tune your agent's cognitive and operational parameters
                    </p>
                  </div>

                  <div className="forge-grid">
                    <div className="range-section">
                      {[
                        {
                          key: "creativity",
                          label: "Innovation & Creativity",
                          icon: Sparkles,
                          desc: "Ability to generate novel solutions",
                        },
                        {
                          key: "logic",
                          label: "Analytical Reasoning",
                          icon: Brain,
                          desc: "Logical thinking and problem-solving",
                        },
                      ].map(({ key, label, icon: Icon, desc }) => (
                        <div key={key} className="range-item">
                          <div className="range-header">
                            <Icon className="w-5 h-5 text-white" />
                            <div className="range-info">
                              <div className="range-title">{label}</div>
                              <p className="range-description">{desc}</p>
                            </div>
                          </div>
                          <div className="range-controls">
                            <div className="range-labels">
                              <span className="range-label-left">Low</span>
                              <span className="range-value">{newAgent[key as keyof typeof newAgent]}%</span>
                              <span className="range-label-right">High</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={newAgent[key as keyof typeof newAgent]}
                              onChange={(e) =>
                                setNewAgent((prev) => ({
                                  ...prev,
                                  [key]: Number.parseInt(e.target.value),
                                }))
                              }
                              className="range-slider"
                              style={{
                                background: `linear-gradient(to right, ${newAgent.color} 0%, ${newAgent.color} ${newAgent[key as keyof typeof newAgent]}%, #374151 ${newAgent[key as keyof typeof newAgent]}%, #374151 100%)`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="forge-preview-section">
                      {(() => {
                        const PreviewShapeIcon = agentShapes[newAgent.shape]
                        return (
                          <div
                            className="forge-preview"
                            style={{
                              backgroundColor: newAgent.color + "20",
                              borderColor: newAgent.color,
                              boxShadow: `0 0 40px ${newAgent.color}60`,
                            }}
                          >
                            <PreviewShapeIcon className="w-16 h-16 text-white" />
                          </div>
                        )
                      })()}

                      <p className="text-gray-300 text-center mt-6">
                        Finalize your agent's performance configuration.
                        <br />
                        Click 'Forge Agent' to deploy!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="forge-footer">
              <button
                onClick={() => setForgeStep((prev) => Math.max(1, prev - 1))}
                className="btn btn-secondary btn-lg"
                style={{ flex: 'none', flexGrow: 0, flexShrink: 0, flexBasis: 'auto', width: 'auto', maxWidth: 'none', minWidth: 150 }}
                disabled={forgeStep === 1}
              >
                Previous Step
              </button>
              {forgeStep < 4 ? (
                <button
                  onClick={() => setForgeStep((prev) => Math.min(4, prev + 1))}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 'none', flexGrow: 0, flexShrink: 0, flexBasis: 'auto', width: 'auto', maxWidth: 'none', minWidth: 150 }}
                >
                  Next Step
                </button>
              ) : (
                <button onClick={handleCreateAgent} className="btn btn-primary btn-lg" disabled={isForging}>
                  {isForging ? "Forging Agent..." : "Forge Agent"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && chatAgent && (
        <div className="chat-modal">
          {/* Chat Particles */}
          <div className="chat-particles">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="chat-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${6 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          {/* Chat Sidebar */}
          <div className={`chat-sidebar ${showChatSidebar ? "" : "hidden"}`}>
            <div className="chat-sidebar-header">
              <h3 className="chat-sidebar-title">Chat History</h3>
              <button onClick={() => setShowChat(false)} className="btn btn-ghost btn-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Agent Profile */}
            <div className="chat-agent-profile">
              {isMultiAgentChat ? (
                <div
                  className="chat-agent-profile-avatar"
                  style={{
                    backgroundColor: '#8B5CF620',
                    borderColor: '#8B5CF6',
                    boxShadow: '0 0 15px #8B5CF640',
                  }}
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div
                  className="chat-agent-profile-avatar"
                  style={{
                    backgroundColor: chatAgent.color + "20",
                    borderColor: chatAgent.color,
                    boxShadow: `0 0 15px ${chatAgent.color}40`,
                  }}
                >
                  {(() => {
                    const AgentIcon = agentShapes[chatAgent.shape]
                    return <AgentIcon className="w-6 h-6 text-white" />
                  })()}
                </div>
              )}
              <div className="chat-agent-profile-info">
                <h4 className="chat-agent-profile-name">
                  {isMultiAgentChat ? 'Multi-Agent Team' : chatAgent.name}
                </h4>
                <p className="chat-agent-profile-role">
                  {isMultiAgentChat 
                    ? `${agents.length} agents disponibles` 
                    : chatAgent.personality}
                </p>
              </div>
            </div>

            {/* Recent Conversations */}
            <div className="chat-conversations">
              <div className="chat-conversations-title">Recent Conversations</div>
              {[
                {
                  title: "Code Review Optimization",
                  time: "2h ago",
                  description: "Analyzed your React components and found 3 optimization opportunities...",
                },
                {
                  title: "Test Coverage Analysis",
                  time: "1d ago",
                  description: "Your test coverage is at 78%. I recommend adding tests for...",
                },
                {
                  title: "Performance Metrics",
                  time: "2d ago",
                  description: "Weekly performance report shows 15% improvement in...",
                },
                {
                  title: "Deployment Pipeline",
                  time: "3d ago",
                  description: "Successfully optimized your CI/CD pipeline, reducing build time by...",
                },
              ].map((conv, index) => (
                <div key={index} className="conversation-item">
                  <div className="conversation-title">{conv.title}</div>
                  <div className="conversation-time">{conv.time}</div>
                  <div className="conversation-preview">{conv.description}</div>
                </div>
              ))}
            </div>

            {/* New Conversation Button */}
            <button 
              className="new-conversation-btn"
              onClick={() => {
                setChatMessages([]);
                if (isMultiAgentChat) {
                  setShowAgentSelector(true);
                }
              }}
            >
              <Plus className="w-4 h-4" />
              {isMultiAgentChat ? 'Modifier les agents' : 'Nouvelle conversation'}
            </button>
          </div>

          {/* Chat Main Area */}
          <div className="chat-main">
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <button onClick={() => setShowChatSidebar(!showChatSidebar)} className="btn btn-ghost btn-sm">
                  <Menu className="w-5 h-5" />
                </button>
                <div
                  className="chat-agent-avatar"
                  style={{
                    backgroundColor: chatAgent.color + "20",
                    borderColor: chatAgent.color,
                    boxShadow: `0 0 15px ${chatAgent.color}40`,
                  }}
                >
                  {(() => {
                    const AgentIcon = agentShapes[chatAgent.shape]
                    return <AgentIcon className="w-6 h-6 text-white" />
                  })()}
                </div>
                <div className="chat-agent-info">
                  <div className="chat-agent-name">{chatAgent.name}</div>
                  <div className="chat-agent-skills">{chatAgent.skills.join(" & ")}</div>
                </div>
              </div>
              <div className="chat-header-right">
                <span className="badge badge-success">Online</span>
                <button className="btn btn-ghost btn-sm">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              {chatMessages.map((message) => {
                const isUser = message.sender === 'user';
                const agent = message.agentId && message.agentId !== 'system' 
                  ? agents.find(a => a.id === message.agentId)
                  : null;
                
                return (
                  <div
                    key={message.id}
                    className={`message-container ${isUser ? 'user' : 'agent'}`}
                  >
                    {!isUser && agent && (
                      <div className="message-header">
                        <div 
                          className="message-avatar"
                          style={{
                            backgroundColor: `${agent.color}20`,
                            border: `1px solid ${agent.color}`,
                            boxShadow: `0 0 10px ${agent.color}40`
                          }}
                        >
                          {(() => {
                            const AgentIcon = agentShapes[agent.shape];
                            return <AgentIcon className="w-3 h-3 text-white" />;
                          })()}
                        </div>
                        <span className="message-sender">{agent.name}</span>
                      </div>
                    )}
                    <div className="message-content">
                      <div className={`message-bubble ${isUser ? 'user' : 'agent'}`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <div className="chat-input-area">
              <div className="chat-input-container">
                <div className="chat-input-wrapper">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder={isMultiAgentChat 
                      ? 'Posez votre question à l\'équipe...' 
                      : `Écrivez un message à ${chatAgent.name}...`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && chatInput.trim()) {
                        const newMessage = {
                          id: Date.now().toString(),
                          sender: 'user' as const,
                          content: chatInput,
                          timestamp: new Date().toISOString()
                        };
                        setChatMessages(prev => [...prev, newMessage]);
                        setChatInput('');
                        
                        // Simuler des réponses après un délai
                        setTimeout(() => {
                          if (isMultiAgentChat) {
                            // Pour le chat multi-agents, générer des réponses des agents sélectionnés
                            // Si aucun agent n'est sélectionné, on utilise les 3 premiers agents par défaut
                            const agentsToRespond = selectedAgents.length > 0 
                              ? selectedAgents 
                              : agents.slice(0, 3);
                            
                            agentsToRespond.forEach((agent, index) => {
                              setTimeout(() => {
                                const responseMessage = {
                                  id: `agent-${Date.now()}-${agent.id}`,
                                  sender: 'agent' as const,
                                  content: `Hello, I'm ${agent.name}, specialized in ${agent.personality}. Here's my response to your question.`,
                                  timestamp: new Date().toISOString(),
                                  agentId: agent.id
                                };
                                setChatMessages(prev => [...prev, responseMessage]);
                              }, index * 1500); // Délai entre les réponses
                            });
                          } else {
                            // Pour un agent unique
                            const responseMessage = {
                              id: `agent-${Date.now()}`,
                              sender: 'agent' as const,
                              content: `Thank you for your message. I'm ${chatAgent.name}, specialized in ${chatAgent.personality}. How can I assist you?`,
                              timestamp: new Date().toISOString(),
                              agentId: chatAgent.id
                            };
                            setChatMessages(prev => [...prev, responseMessage]);
                          }
                        }, 1000);
                      }
                    }}
                  />
                  <div className="chat-input-actions">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                      onChange={(e: any) => {
                        const files = Array.from(e.target.files || [])
                        if (files.length > 0) {
                          const fileNames = files.map((f: any) => f.name).join(", ")
                          const newMessage = {
                            id: Date.now().toString(),
                            sender: "user" as const,
                            content: `📎 Uploaded files: ${fileNames}`,
                            timestamp: "Just now",
                          }
                          setChatMessages((prev) => [...prev, newMessage])

                          // Simulate agent response
                          setTimeout(() => {
                            const agentResponse = {
                              id: (Date.now() + 1).toString(),
                              sender: "agent" as const,
                              content: `I've received your files: ${fileNames}. Let me analyze them and provide insights based on my expertise in ${chatAgent.skills.join(", ")}.`,
                              timestamp: "Just now",
                            }
                            setChatMessages((prev) => [...prev, agentResponse])
                          }, 1000)
                        }
                      }}
                    />
                    <button className="chat-input-btn" onClick={() => document.getElementById("file-upload")?.click()}>
                      <Database className="w-4 h-4" />
                    </button>
                    <button className="chat-input-btn">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (chatInput.trim()) {
                      const newMessage = {
                        id: Date.now().toString(),
                        sender: "user" as const,
                        content: chatInput,
                        timestamp: "Just now",
                      }
                      setChatMessages((prev: any) => [...prev, newMessage])
                      setChatInput("")

                      // Simulate agent response
                      setTimeout(() => {
                        const agentResponse = {
                          id: (Date.now() + 1).toString(),
                          sender: "agent" as const,
                          content: `I understand you want to work on "${chatInput}". Let me analyze this and provide you with the best approach. Based on my expertise in ${chatAgent.skills.join(", ")}. I recommend we start by...`,
                          timestamp: "Just now",
                        }
                        setChatMessages((prev: any) => [...prev, agentResponse])
                      }, 1000)
                    }
                  }}
                  className="chat-send-btn">
                    
                  Send
                </button>
              </div>
              <div className="chat-help-text">
                {chatAgent.name} can help with {chatAgent.skills.join(", ")}. Press Enter to send • Upload files with 📎
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
