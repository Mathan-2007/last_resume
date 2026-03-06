import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Upload, Target, Briefcase, MessageSquare, CheckCircle, AlertCircle, Info, TrendingUp, FileText, User, Mail, Phone, Code, LogOut } from 'lucide-react';

const API_BASE = '';

// ============================================================
// STYLES
// ============================================================
const S = {
  // App shell
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #4a1d96 50%, #0f172a 100%)",
    padding: "24px",
  },
  container: { maxWidth: "1280px", margin: "0 auto" },

  // Header
  header: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: "36px", fontWeight: "700", color: "#fff", marginBottom: "6px" },
  headerSub: { color: "#d8b4fe" },
  logoutBtn: {
    padding: "10px 20px",
    background: "rgba(239,68,68,0.2)",
    color: "#f87171",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background 0.2s",
  },

  // Error
  errorBox: {
    background: "rgba(239,68,68,0.2)",
    border: "1px solid rgba(239,68,68,0.5)",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  errorTitle: { color: "#fecaca", fontWeight: "600", marginBottom: "2px" },
  errorMsg: { color: "#fca5a5", fontSize: "14px" },

  // Tabs
  tabRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    overflowX: "auto",
    paddingBottom: "8px",
  },
  tab: (active) => ({
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap",
    background: active ? "#9333ea" : "rgba(255,255,255,0.1)",
    color: active ? "#fff" : "#d8b4fe",
    boxShadow: active ? "0 4px 14px rgba(147,51,234,0.4)" : "none",
    transition: "all 0.2s",
  }),

  // Card base
  card: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.2)",
    marginBottom: "24px",
  },
  cardTitle: {
    fontSize: "24px", fontWeight: "700", color: "#fff",
    marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px",
  },

  // Upload area
  uploadArea: {
    border: "2px dashed rgba(168,85,247,0.5)",
    borderRadius: "12px",
    padding: "32px",
    marginBottom: "24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  uploadIconWrap: {
    width: "64px", height: "64px",
    background: "rgba(147,51,234,0.3)",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  uploadText: { color: "#d8b4fe" },
  uploadTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "4px" },
  uploadSub: { fontSize: "14px", opacity: 0.75 },
  uploadFileName: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "500" },
  spinner: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: "8px", marginTop: "12px",
  },
  spinnerCircle: {
    width: "20px", height: "20px",
    border: "2px solid rgba(168,85,247,0.3)",
    borderTop: "2px solid #a855f7",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  // Stats grid
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" },
  statCard: (from, to) => ({
    background: `linear-gradient(135deg, ${from}, ${to})`,
    borderRadius: "12px", padding: "16px", textAlign: "center",
  }),
  statLabel: { color: "#e9d5ff", fontSize: "14px", marginBottom: "4px" },
  statValue: { fontSize: "36px", fontWeight: "700", color: "#fff" },
  statSub: { color: "#c4b5fd", fontSize: "12px", marginTop: "4px" },

  // Info panel
  infoPanel: { background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "20px" },
  infoPanelTitle: {
    fontSize: "18px", fontWeight: "600", color: "#c4b5fd",
    marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px",
  },
  infoRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" },
  infoText: { color: "#fff", fontSize: "14px" },
  skillChip: (bg, border) => ({
    background: bg, border: `1px solid ${border}`,
    padding: "8px 16px", borderRadius: "9999px",
    color: "#fff", fontSize: "14px", fontWeight: "500",
  }),

  // Two-col grid
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  fullCol: { gridColumn: "1 / -1" },

  // ATS gauge
  gaugeWrap: {
    background: "linear-gradient(135deg, rgba(147,51,234,0.2), rgba(236,72,153,0.2))",
    borderRadius: "12px", padding: "32px", marginBottom: "24px", textAlign: "center",
  },
  gaugeLabel: { color: "#d8b4fe", fontSize: "14px", marginBottom: "12px" },
  gaugeScore: { fontSize: "48px", fontWeight: "700", color: "#fff" },
  gaugeMax: { color: "#c4b5fd", fontSize: "14px" },
  gaugeStatus: { color: "#fff", fontSize: "18px", fontWeight: "600", marginTop: "16px" },

  // Recommendations
  recItem: (color) => ({
    borderRadius: "12px", padding: "16px",
    display: "flex", alignItems: "flex-start", gap: "12px",
    background: color === "red" ? "rgba(239,68,68,0.2)" :
      color === "yellow" ? "rgba(234,179,8,0.2)" :
      color === "green" ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)",
    border: `1px solid ${color === "red" ? "rgba(239,68,68,0.3)" :
      color === "yellow" ? "rgba(234,179,8,0.3)" :
      color === "green" ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.3)"}`,
    marginBottom: "12px",
  }),
  recIcon: (color) => ({
    color: color === "red" ? "#f87171" :
      color === "yellow" ? "#facc15" :
      color === "green" ? "#4ade80" : "#60a5fa",
    flexShrink: 0, marginTop: "2px",
  }),
  recText: { color: "#fff" },

  // ATS tips
  tipsList: { listStyle: "none", padding: 0, margin: 0 },
  tipItem: { display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px", color: "#e9d5ff", fontSize: "14px" },

  // Role card
  roleCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px", padding: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "16px",
    transition: "border-color 0.2s",
  },
  roleHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" },
  roleTitle: { fontSize: "20px", fontWeight: "600", color: "#fff", marginBottom: "6px" },
  roleDesc: { color: "#d8b4fe", fontSize: "14px" },
  roleMatchNum: (match) => ({
    fontSize: "30px", fontWeight: "700",
    color: match >= 85 ? "#4ade80" : match >= 70 ? "#facc15" : "#fb923c",
    textAlign: "right",
  }),
  roleMatchLabel: { color: "#c4b5fd", fontSize: "12px", textAlign: "right" },
  progressTrack: { width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: "9999px", height: "8px", marginBottom: "16px" },
  progressFill: (match) => ({
    height: "8px", borderRadius: "9999px",
    width: `${match}%`,
    background: match >= 85 ? "linear-gradient(90deg,#22c55e,#4ade80)" :
      match >= 70 ? "linear-gradient(90deg,#eab308,#facc15)" :
      "linear-gradient(90deg,#ef4444,#f97316)",
  }),

  // Suggested skills banner
  suggestBanner: {
    marginTop: "32px",
    background: "linear-gradient(135deg, rgba(126,34,206,0.2), rgba(219,39,119,0.2))",
    borderRadius: "12px", padding: "24px",
    border: "1px solid rgba(147,51,234,0.3)",
  },
  suggestTitle: {
    fontSize: "20px", fontWeight: "600", color: "#fff",
    marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px",
  },
  suggestSub: { color: "#d8b4fe", fontSize: "14px", marginBottom: "16px" },

  // Detected role banner
  detectedBanner: {
    background: "linear-gradient(90deg, rgba(147,51,234,0.3), rgba(219,39,119,0.3))",
    borderRadius: "12px", padding: "20px", marginBottom: "24px",
    border: "1px solid rgba(147,51,234,0.3)",
  },
  detectedLabel: { color: "#d8b4fe", fontSize: "14px", marginBottom: "4px" },
  detectedValue: { color: "#fff", fontSize: "20px", fontWeight: "600" },

  // Chat
  chatCard: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px", padding: "24px",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex", flexDirection: "column", height: "70vh",
  },
  chatMessages: { flex: 1, overflowY: "auto", marginBottom: "16px", paddingRight: "8px" },
  chatEmpty: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    height: "100%", textAlign: "center",
  },
  chatEmptyTitle: { fontSize: "18px", fontWeight: "600", color: "#d8b4fe", marginTop: "12px" },
  chatEmptySub: { fontSize: "14px", color: "#c4b5fd", marginTop: "4px" },
  msgRow: (isUser) => ({
    display: "flex",
    justifyContent: isUser ? "flex-end" : "flex-start",
    marginBottom: "16px",
  }),
  msgBubble: (isUser) => ({
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    fontSize: "14px",
    background: isUser ? "#9333ea" : "rgba(255,255,255,0.1)",
    color: isUser ? "#fff" : "#e9d5ff",
    border: isUser ? "none" : "1px solid rgba(255,255,255,0.1)",
  }),
  chatInputRow: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "12px",
    display: "flex", alignItems: "center", gap: "12px",
  },
  chatInput: {
    flex: 1,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "12px",
    padding: "10px 16px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  sendBtn: (chatting) => ({
    padding: "10px 20px",
    borderRadius: "12px",
    fontWeight: "600",
    border: "none",
    cursor: chatting ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", gap: "8px",
    background: chatting ? "rgba(167,139,250,0.4)" : "#9333ea",
    color: chatting ? "#d8b4fe" : "#fff",
    fontSize: "14px",
    transition: "background 0.2s",
  }),

  // Empty state (no resume)
  emptyState: { textAlign: "center", padding: "48px 0" },
  emptyText: { color: "#d8b4fe", fontSize: "18px", marginTop: "16px", marginBottom: "16px" },
  goBtn: {
    background: "#9333ea", color: "#fff", border: "none",
    padding: "12px 24px", borderRadius: "12px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [github, setGithub] = useState(null);
  const [leetcode, setLeetcode] = useState(null);
  const [codechef, setCodechef] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [chatting, setChatting] = useState(false);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchUserData = async () => {
      const storedEmail = localStorage.getItem("email");
      if (!storedEmail) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/user/info/${storedEmail}`, { credentials: "include" });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("User fetch error:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!email) return;
    const fetchProfiles = async () => {
      try {
        const [g, l, c] = await Promise.all([
          fetch(`${API_BASE}/github/${email}`, { credentials: "include" }).then(r => r.json()),
          fetch(`${API_BASE}/leetcode/${email}`, { credentials: "include" }).then(r => r.json()),
          fetch(`${API_BASE}/codechef/${email}`, { credentials: "include" }).then(r => r.json()),
        ]);
        setGithub(g); setLeetcode(l); setCodechef(c);
      } catch (err) { console.warn("Profile fetch error:", err); }
    };
    fetchProfiles();
  }, [email]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError(null);
      uploadResume(file);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  const uploadResume = async (file) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file);
    try {
      const response = await fetch(`${API_BASE}/user/upload_resume`, {
        method: 'POST', body: formData, credentials: "include"
      });
      const result = await response.json();
      if (response.ok) {
        setResumeData({
          ats_score: result.ats_score,
          word_count: result.word_count,
          data: result.structured_info,
          ats_breakdown: result.ats_breakdown,
          suggested_skills: result.suggested_skills || [],
          detected_role: result.detected_role || null,
        });
      } else {
        setError(result.error || 'Failed to upload resume');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || !resumeData) return;
    const newMessage = { role: 'user', content: userMessage };
    setChatMessages([...chatMessages, newMessage]);
    setUserMessage('');
    setChatting(true);
    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ query: userMessage, resume_data: resumeData.data || {} })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setChatting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/auth/logout", { method: "POST", credentials: "include" });
      let json = {};
      try { json = await res.json(); } catch { json = {}; }
      if (!res.ok) throw new Error(json?.detail || "Logout failed");
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed — please try again.");
    }
  };

  const getATSRecommendations = () => {
    if (!resumeData) return [];
    const score = resumeData.ats_score || 0;
    if (score < 50) return [
      { type: 'critical', message: 'Add more technical keywords and skills relevant to your target role', icon: AlertCircle, color: 'red' },
      { type: 'critical', message: 'Include quantifiable achievements and metrics in your experience', icon: AlertCircle, color: 'red' },
      { type: 'critical', message: 'Expand your skills section with more relevant technologies', icon: AlertCircle, color: 'red' },
    ];
    if (score < 75) return [
      { type: 'warning', message: 'Consider adding more industry-specific certifications', icon: Info, color: 'yellow' },
      { type: 'warning', message: 'Include more detailed project descriptions with outcomes', icon: Info, color: 'yellow' },
      { type: 'success', message: 'Good foundation - focus on quantifying your impact', icon: CheckCircle, color: 'green' },
    ];
    return [
      { type: 'success', message: 'Excellent ATS compatibility! Your resume is well-optimized', icon: CheckCircle, color: 'green' },
      { type: 'success', message: 'Strong keyword presence and clear structure', icon: CheckCircle, color: 'green' },
      { type: 'info', message: 'Keep updating with new skills and achievements regularly', icon: Info, color: 'blue' },
    ];
  };

  const getRoleRecommendations = () => {
    if (!resumeData?.data) return [];
    const skills = resumeData?.data?.skills?.technical || [];
    const roles = [];
    if (skills.some(s => ['react','angular','vue'].some(k => s.toLowerCase().includes(k))))
      roles.push({ title: 'Frontend Developer', match: 85, description: 'Your frontend framework expertise makes you a strong candidate', skills: ['React','JavaScript','CSS','HTML'] });
    if (skills.some(s => ['python','java','node'].some(k => s.toLowerCase().includes(k))))
      roles.push({ title: 'Backend Developer', match: 80, description: 'Strong backend programming skills identified', skills: ['Python','Java','Node.js','APIs'] });
    if (skills.some(s => ['react','node'].some(k => s.toLowerCase().includes(k))) && skills.some(s => ['mongodb','sql'].some(k => s.toLowerCase().includes(k))))
      roles.push({ title: 'Full Stack Developer', match: 90, description: 'Complete stack proficiency detected', skills: ['Full Stack','MERN','Database','APIs'] });
    if (skills.some(s => ['ml','ai','tensorflow'].some(k => s.toLowerCase().includes(k))))
      roles.push({ title: 'Machine Learning Engineer', match: 75, description: 'ML/AI skills present in your profile', skills: ['Python','TensorFlow','ML','Data Science'] });
    if (skills.some(s => ['devops','docker','kubernetes'].some(k => s.toLowerCase().includes(k))))
      roles.push({ title: 'DevOps Engineer', match: 78, description: 'DevOps and infrastructure skills identified', skills: ['Docker','Kubernetes','CI/CD','Cloud'] });
    if (roles.length === 0)
      roles.push({ title: 'Software Developer', match: 70, description: 'General software development role based on your technical background', skills: ['Programming','Problem Solving','Software Development'] });
    return roles.sort((a, b) => b.match - a.match);
  };

  const getSuggestedSkills = () => {
    if (!resumeData?.suggested_skills) return [];
    return resumeData.suggested_skills.map(s => s.trim());
  };

  const tabs = [
    { id: 'analysis', label: 'Resume Analysis', icon: FileText },
    { id: 'ats', label: 'ATS Analysis', icon: Target },
    { id: 'roles', label: 'Role Recommendation', icon: Briefcase },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  ];

  return (
    <div style={S.app}>
      {/* keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={S.container}>

        {/* ── Header ── */}
        <div style={S.header}>
          <div>
            <div style={S.headerTitle}>Welcome, {resumeData?.data?.name || 'User'}!</div>
            <div style={S.headerSub}>Your AI-powered career dashboard</div>
          </div>
          <button style={S.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={S.errorBox}>
            <AlertCircle color="#f87171" size={20} style={{ marginTop: "2px" }} />
            <div>
              <div style={S.errorTitle}>Error</div>
              <div style={S.errorMsg}>{error}</div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={S.tabRow}>
          {tabs.map(tab => (
            <button key={tab.id} style={S.tab(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            TAB: Resume Analysis
        ══════════════════════════════════════════ */}
        {activeTab === 'analysis' && (
          <div style={S.card}>
            <div style={S.cardTitle}><FileText size={24} /> Resume Analysis Overview</div>

            {/* Upload */}
            <div style={S.uploadArea} onClick={() => document.getElementById("resume-upload").click()}>
              <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: "none" }} id="resume-upload" />
              <div style={S.uploadIconWrap}><Upload size={32} color="#d8b4fe" /></div>
              <div style={S.uploadText}>
                {resumeFile ? (
                  <div style={S.uploadFileName}><FileText size={20} /><span>{resumeFile.name}</span></div>
                ) : (
                  <>
                    <div style={S.uploadTitle}>Click to upload your resume</div>
                    <div style={S.uploadSub}>PDF files only (Max 10MB)</div>
                  </>
                )}
              </div>
              {loading && (
                <div style={S.spinner}>
                  <div style={S.spinnerCircle}></div>
                  <span style={{ color: "#d8b4fe", fontSize: "14px" }}>Analyzing your resume...</span>
                </div>
              )}
            </div>

            {resumeData ? (
              <>
                {/* Stats */}
                <div style={S.statsGrid}>
                  <div style={S.statCard("rgba(147,51,234,0.3)", "rgba(126,34,206,0.3)")}>
                    <div style={S.statLabel}>ATS Score</div>
                    <div style={S.statValue}>{resumeData.ats_score || 0}</div>
                    <div style={S.statSub}>out of 100</div>
                  </div>
                  <div style={S.statCard("rgba(219,39,119,0.3)", "rgba(190,18,60,0.3)")}>
                    <div style={S.statLabel}>Word Count</div>
                    <div style={S.statValue}>{resumeData.word_count || 0}</div>
                    <div style={S.statSub}>words</div>
                  </div>
                  <div style={S.statCard("rgba(37,99,235,0.3)", "rgba(29,78,216,0.3)")}>
                    <div style={S.statLabel}>Technical Skills</div>
                    <div style={S.statValue}>{resumeData.data?.skills?.technical?.length || 0}</div>
                    <div style={S.statSub}>skills identified</div>
                  </div>
                  <div style={S.statCard("rgba(22,163,74,0.3)", "rgba(21,128,61,0.3)")}>
                    <div style={S.statLabel}>Languages</div>
                    <div style={S.statValue}>{resumeData.data?.languages?.length || 0}</div>
                    <div style={S.statSub}>languages</div>
                  </div>
                </div>

                {resumeData.data && (
                  <div style={S.twoCol}>
                    {/* Personal Info */}
                    <div style={S.infoPanel}>
                      <div style={S.infoPanelTitle}><User size={20} /> Personal Information</div>
                      {resumeData?.data?.name && <div style={S.infoRow}><User size={16} color="#a78bfa" /><span style={S.infoText}>{resumeData?.data?.name}</span></div>}
                      {resumeData?.data?.name && <div style={S.infoRow}><Mail size={16} color="#a78bfa" /><span style={S.infoText}>{resumeData?.data?.email}</span></div>}
                      {resumeData?.data?.name && <div style={S.infoRow}><Phone size={16} color="#a78bfa" /><span style={S.infoText}>{resumeData?.data?.phone}</span></div>}
                    </div>

                    {/* Coding Profiles */}
                    <div style={S.infoPanel}>
                      <div style={S.infoPanelTitle}><Code size={20} /> Coding Profiles</div>
                      {github && <div style={{ fontSize: "14px", marginBottom: "8px" }}><span style={{ color: "#c4b5fd" }}>GitHub: </span><span style={{ color: "#fff" }}>{github.repos || 0} repos, {github.stars || 0} ⭐</span></div>}
                      {leetcode && <div style={{ fontSize: "14px", marginBottom: "8px" }}><span style={{ color: "#c4b5fd" }}>LeetCode: </span><span style={{ color: "#fff" }}>{leetcode.solved || 0} solved</span></div>}
                      {codechef && <div style={{ fontSize: "14px" }}><span style={{ color: "#c4b5fd" }}>CodeChef: </span><span style={{ color: "#fff" }}>{codechef.stars || 0}⭐ Stars</span></div>}
                    </div>

                    {/* Technical Skills */}
                    {resumeData?.data?.skills?.technical?.length > 0 && (
                      <div style={{ ...S.infoPanel, ...S.fullCol }}>
                        <div style={S.infoPanelTitle}>Technical Skills</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {resumeData.data.skills.technical.map((skill, idx) => (
                            <span key={idx} style={S.skillChip("rgba(147,51,234,0.4)", "rgba(147,51,234,0.3)")}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {resumeData?.data?.languages?.length > 0 && (
                      <div style={{ ...S.infoPanel, ...S.fullCol }}>
                        <div style={S.infoPanelTitle}>Languages</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {resumeData.data.languages.map((lang, idx) => (
                            <span key={idx} style={S.skillChip("rgba(219,39,119,0.4)", "rgba(219,39,119,0.3)")}>{lang}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    {resumeData?.data?.summary && (
                      <div style={{ ...S.infoPanel, ...S.fullCol }}>
                        <div style={S.infoPanelTitle}>Professional Summary</div>
                        <p style={{ color: "#fff", lineHeight: "1.7", margin: 0 }}>{resumeData.data.summary}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div style={S.emptyState}>
                <Info color="#a855f7" size={48} style={{ margin: "0 auto" }} />
                <div style={S.emptyText}>Upload your resume to see detailed analysis</div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: ATS Analysis
        ══════════════════════════════════════════ */}
        {activeTab === 'ats' && (
          <div style={S.card}>
            <div style={S.cardTitle}><Target size={24} /> ATS Compatibility Analysis</div>

            {resumeData ? (
              <>
                {/* Gauge */}
                <div style={S.gaugeWrap}>
                  <div style={S.gaugeLabel}>Your ATS Score</div>
                  <svg width="192" height="192" style={{ display: "block", margin: "0 auto" }}>
                    <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                    <circle
                      cx="96" cy="96" r="88" fill="none"
                      stroke="url(#atsGrad)" strokeWidth="12"
                      strokeDasharray={`${(resumeData.ats_score / 100) * 553} 553`}
                      strokeLinecap="round"
                      transform="rotate(-90 96 96)"
                    />
                    <defs>
                      <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <text x="96" y="88" textAnchor="middle" fill="#fff" fontSize="40" fontWeight="700">{resumeData.ats_score}</text>
                    <text x="96" y="112" textAnchor="middle" fill="#c4b5fd" fontSize="14">/ 100</text>
                  </svg>
                  <div style={S.gaugeStatus}>
                    {resumeData.ats_score >= 75 ? '✨ Excellent' : resumeData.ats_score >= 50 ? '👍 Good' : '⚠️ Needs Improvement'}
                  </div>
                </div>

                {/* Recommendations */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "20px", fontWeight: "600", color: "#fff", marginBottom: "16px" }}>Recommendations</div>
                  {getATSRecommendations().map((rec, idx) => (
                    <div key={idx} style={S.recItem(rec.color)}>
                      <rec.icon style={S.recIcon(rec.color)} size={20} />
                      <span style={S.recText}>{rec.message}</span>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <div style={S.infoPanel}>
                  <div style={S.infoPanelTitle}>ATS Optimization Tips</div>
                  <ul style={S.tipsList}>
                    {[
                      'Use standard section headings like "Work Experience" and "Education"',
                      'Include relevant keywords from job descriptions',
                      'Avoid using images, tables, or complex formatting',
                      'List your technical skills explicitly',
                      'Use standard fonts and clear formatting',
                    ].map((tip, i) => (
                      <li key={i} style={S.tipItem}>
                        <CheckCircle size={16} color="#4ade80" style={{ marginTop: "2px", flexShrink: 0 }} />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div style={S.emptyState}>
                <Target color="#a855f7" size={48} style={{ margin: "0 auto" }} />
                <div style={S.emptyText}>Upload your resume in the Resume Analysis tab first</div>
                <button style={S.goBtn} onClick={() => setActiveTab('analysis')}>Go to Resume Analysis</button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: Role Recommendation
        ══════════════════════════════════════════ */}
        {activeTab === 'roles' && (
          <div style={S.card}>
            <div style={S.cardTitle}><Briefcase size={24} /> Recommended Roles</div>

            {resumeData ? (
              <>
                {/* Suggested role from resume */}
                {resumeData.data?.role_match && (
                  <div style={S.detectedBanner}>
                    <div style={S.detectedLabel}>Suggested Role from Resume</div>
                    <div style={S.detectedValue}>{resumeData.data.role_match}</div>
                  </div>
                )}

                {/* AI detected role */}
                {resumeData.detected_role && (
                  <div style={S.detectedBanner}>
                    <div style={S.detectedLabel}>AI-Detected Role</div>
                    <div style={S.detectedValue}>{resumeData.detected_role}</div>
                  </div>
                )}

                {/* Role cards */}
                {getRoleRecommendations().map((role, idx) => (
                  <div key={idx} style={S.roleCard}>
                    <div style={S.roleHeader}>
                      <div style={{ flex: 1 }}>
                        <div style={S.roleTitle}>{role.title}</div>
                        <div style={S.roleDesc}>{role.description}</div>
                      </div>
                      <div style={{ marginLeft: "16px" }}>
                        <div style={S.roleMatchNum(role.match)}>{role.match}%</div>
                        <div style={S.roleMatchLabel}>Match</div>
                      </div>
                    </div>
                    <div style={S.progressTrack}>
                      <div style={S.progressFill(role.match)}></div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {role.skills.map((s, i) => (
                        <span key={i} style={S.skillChip("rgba(147,51,234,0.3)", "rgba(167,139,250,0.3)")}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Suggested skills */}
                {getSuggestedSkills().length > 0 && (
                  <div style={S.suggestBanner}>
                    <div style={S.suggestTitle}>
                      <TrendingUp size={20} color="#c4b5fd" />
                      Suggested Skills to Strengthen Your {resumeData.detected_role || "Career"}
                    </div>
                    <div style={S.suggestSub}>
                      Based on your current resume, here are additional skills recommended for your role:&nbsp;
                      <strong style={{ color: "#a78bfa" }}>{resumeData.detected_role || "General Developer"}</strong>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {getSuggestedSkills().map((skill, i) => (
                        <span key={i} style={{
                          background: "linear-gradient(90deg, #9333ea, #ec4899)",
                          color: "#fff", padding: "8px 16px", borderRadius: "9999px",
                          fontSize: "14px", fontWeight: "600",
                          border: "1px solid rgba(167,139,250,0.3)",
                        }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={S.emptyState}>
                <Briefcase color="#a855f7" size={48} style={{ margin: "0 auto" }} />
                <div style={S.emptyText}>Upload your resume first to get personalized role suggestions</div>
                <button style={S.goBtn} onClick={() => setActiveTab('analysis')}>Go to Resume Analysis</button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: AI Assistant
        ══════════════════════════════════════════ */}
        {activeTab === 'assistant' && (
          <div style={S.chatCard}>
            <div style={S.cardTitle}><MessageSquare size={24} /> AI Career Assistant</div>

            <div style={S.chatMessages}>
              {chatMessages.length === 0 ? (
                <div style={S.chatEmpty}>
                  <MessageSquare color="#a855f7" size={48} />
                  <div style={S.chatEmptyTitle}>Start chatting with your AI assistant</div>
                  <div style={S.chatEmptySub}>Ask about resume improvement, job roles, or technical growth tips.</div>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} style={S.msgRow(msg.role === 'user')}>
                    <div style={S.msgBubble(msg.role === 'user')}>{msg.content}</div>
                  </div>
                ))
              )}
            </div>

            <div style={S.chatInputRow}>
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                style={S.chatInput}
              />
              <button onClick={sendMessage} disabled={chatting} style={S.sendBtn(chatting)}>
                {chatting ? (
                  <>
                    <div style={{ ...S.spinnerCircle, borderTopColor: "#fff", width: "16px", height: "16px" }}></div>
                    <span>Thinking...</span>
                  </>
                ) : (
                  <><MessageSquare size={18} /><span>Send</span></>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
