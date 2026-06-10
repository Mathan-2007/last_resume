import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Upload, FileText, AlertCircle, Info, LogOut } from 'lucide-react';
import styles from './user.module.css';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import SkillSelector from '../../components/SkillSelector';

const API_BASE = '';

// A smaller component for the resume upload section
function ResumeUpload({ onFileChange, loading, file }) {
  return (
    <Card>
      <CardHeader>
        <div className={styles.cardTitle}>
          <Upload size={24} /> Resume Upload
        </div>
      </CardHeader>
      <CardContent>
        <div className={styles.uploadArea} onClick={() => document.getElementById("resume-upload").click()}>
          <input type="file" accept=".pdf" onChange={onFileChange} style={{ display: "none" }} id="resume-upload" />
          <div className={styles.uploadIconWrap}>
            <Upload size={32} color="var(--primary-accent)" />
          </div>
          <div className={styles.uploadText}>
            {file ? (
              <div className={styles.uploadFileName}>
                <FileText size={20} />
                <span>{file.name}</span>
              </div>
            ) : (
              <>
                <div className={styles.uploadTitle}>Click to upload your resume</div>
                <div className={styles.uploadSub}>PDF files only (Max 10MB)</div>
              </>
            )}
          </div>
          {loading && (
            <div className={styles.spinner}>
              <div className={styles.spinnerCircle}></div>
              <span>Analyzing your resume...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AnalysisDisplay({ resumeData, analysisResult }) {
    if (!resumeData) return null;

    const { ats_score, word_count, data } = resumeData;

    return (
        <Card>
            <CardHeader>
                <div className={styles.cardTitle}>
                    <FileText size={24} /> Analysis Results
                </div>
            </CardHeader>
            <CardContent>
                <p>ATS Score: {ats_score}</p>
                <p>Word Count: {word_count}</p>
                {data && <p>Email: {data.email}</p>}

                {analysisResult && (
                    <div style={{marginTop: "1rem"}}>
                        <h3 style={{fontWeight: "bold"}}>Skill-based Analysis:</h3>
                        {Object.entries(analysisResult).map(([skill, analysis]) => (
                            <div key={skill} style={{marginTop: "0.5rem"}}>
                                <h4 style={{fontWeight: "bold"}}>{skill}</h4>
                                <p>{analysis}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}


export default function UserDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  const email = localStorage.getItem("email");

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
          data: result.structured_info
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

  const handleAnalyzeSkills = async () => {
    if (selectedSkills.length === 0) {
        setError("Please select at least one skill to analyze.")
        return;
    }
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(`${API_BASE}/user/analyze_skills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({
                resume_data: resumeData.data,
                skills: selectedSkills
            })
        });
        const result = await response.json();
        if (response.ok) {
            setAnalysisResult(result);
        } else {
            setError(result.error || 'Failed to analyze skills');
        }
    } catch (err) {
        setError('Network error: ' + err.message);
    } finally {
        setLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/auth/logout", { method: "POST", credentials: "include" });
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed — please try again.");
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitle}>Welcome, {email}!</div>
            <div className={styles.headerSub}>Your AI-powered career dashboard</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle color="#c53030" size={20} />
            <div>
              <div className={styles.errorTitle}>Error</div>
              <div className={styles.errorMsg}>{error}</div>
            </div>
          </div>
        )}

        {!resumeData ? (
          <ResumeUpload onFileChange={handleFileChange} loading={loading} file={resumeFile} />
        ) : (
            <>
                <AnalysisDisplay resumeData={resumeData} analysisResult={analysisResult} />
                <SkillSelector selectedSkills={selectedSkills} onChange={setSelectedSkills} />
                <Button onClick={handleAnalyzeSkills} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Selected Skills'}
                </Button>
            </>
        )}
      </div>
    </div>
  );
}
