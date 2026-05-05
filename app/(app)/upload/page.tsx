"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload as UploadIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { UploadJob } from "@/lib/types";
import { generateId } from "@/lib/utils";

import { processBankStatement } from "@/app/actions/upload";
import { useAuth } from "@/lib/auth-context";

export default function UploadPage() {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const { user } = useAuth();

  const handleRealUpload = async (file: File, jobId: string) => {
    if (!user) return;
    
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "uploading", progress: 20 } : j));
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "extracting", progress: 50 } : j));
      const result = await processBankStatement(formData, user.uid);
      
      if (result.success) {
        setJobs(prev => prev.map(j => j.id === jobId ? { 
          ...j, 
          status: "ready", 
          progress: 100, 
          transactionCount: result.count 
        } : j));
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "error", progress: 0 } : j));
      console.error(err);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newJobs: UploadJob[] = acceptedFiles.map((file) => ({
        id: generateId(),
        fileName: file.name,
        fileSize: file.size,
        status: "idle" as const,
        progress: 0,
      }));

      setJobs((prev) => [...prev, ...newJobs]);

      acceptedFiles.forEach((file, index) => {
        handleRealUpload(file, newJobs[index].id);
      });
    },
    [user]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 12,
  });

  const removeJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    idle: { label: "Queued", color: "var(--text-tertiary)", icon: <Loader2 size={14} /> },
    uploading: { label: "Uploading...", color: "var(--info)", icon: <Loader2 size={14} className="pulse" /> },
    extracting: { label: "Extracting transactions...", color: "var(--accent)", icon: <Loader2 size={14} className="pulse" /> },
    categorizing: { label: "Categorizing data...", color: "var(--warning)", icon: <Loader2 size={14} className="pulse" /> },
    ready: { label: "Ready for audit", color: "var(--positive)", icon: <CheckCircle2 size={14} /> },
    committed: { label: "Committed", color: "var(--positive)", icon: <CheckCircle2 size={14} /> },
    error: { label: "Error", color: "var(--negative)", icon: <AlertCircle size={14} /> },
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Upload Statements</h1>
        <p>Drop your bank statements or credit card exports here. We support PDF files up to 12 months retroactively.</p>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`drop-zone ${isDragActive ? "active" : ""}`}
        id="drop-zone"
        style={{ marginBottom: "var(--space-8)" }}
      >
        <input {...getInputProps()} />
        <div className="drop-icon">
          <UploadIcon size={48} />
        </div>
        <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
          {isDragActive ? "Drop your files here" : "Drag & drop PDF statements"}
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
          or click to browse • PDF only • Max 10MB per file
        </p>
        <button className="btn btn-secondary" type="button">
          Browse Files
        </button>
      </div>

      {/* Upload Queue */}
      {jobs.length > 0 && (
        <div className="glass" style={{ padding: "var(--space-6)" }} id="upload-queue">
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-5)", color: "var(--text-secondary)" }}>
            Processing Queue
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {jobs.map((job) => {
              const cfg = statusConfig[job.status];
              return (
                <div
                  key={job.id}
                  style={{
                    display: "flex", alignItems: "center", gap: "var(--space-4)",
                    padding: "var(--space-4)", borderRadius: "var(--radius-md)",
                    background: "var(--bg-surface)", border: "1px solid var(--border)",
                  }}
                >
                  <FileText size={20} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                      <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {job.fileName}
                      </span>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", flexShrink: 0, marginLeft: "var(--space-2)" }}>
                        {formatFileSize(job.fileSize)}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${job.progress}%` }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-2)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--text-xs)", color: cfg.color }}>
                        {cfg.icon} {cfg.label}
                      </span>
                      {job.transactionCount && (
                        <span className="badge badge-positive">
                          {job.transactionCount} transactions found
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn-icon btn-ghost"
                    onClick={() => removeJob(job.id)}
                    aria-label="Remove"
                    style={{ flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Action bar */}
          {jobs.some((j) => j.status === "ready") && (
            <div style={{ marginTop: "var(--space-5)", display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
              <button className="btn btn-primary" id="btn-review-audit">
                Review in Audit →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Security notice */}
      <div style={{
        marginTop: "var(--space-8)", padding: "var(--space-4) var(--space-5)",
        background: "var(--info-muted)", borderRadius: "var(--radius-md)",
        border: "1px solid rgba(107, 143, 181, 0.15)", fontSize: "var(--text-xs)",
        color: "var(--info)", display: "flex", alignItems: "flex-start", gap: "var(--space-3)",
      }}>
        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>Your privacy matters.</strong> Uploaded PDFs are processed in a secure environment and automatically purged after
          transaction data is extracted. We never store your raw bank statements.
        </span>
      </div>
    </div>
  );
}
