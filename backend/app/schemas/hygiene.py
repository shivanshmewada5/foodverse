from typing import List, Optional, Dict
from pydantic import BaseModel

class HygieneViolation(BaseModel):
    id: str
    timestamp_str: str # e.g. "00:04", "00:15"
    timestamp_seconds: float
    category: str # "PPE & Protective Gear", "Food Handling", "Surface Cleanliness", "Cross Contamination", "Food Storage"
    title: str
    description: str
    risk_level: str # "Low", "Medium", "High", "Critical"
    confidence: float
    frame_snapshot_url: Optional[str] = None
    corrective_action: str
    requires_human_verification: bool = True

class MetricCompliance(BaseModel):
    category: str
    score: float # 0 to 100
    status: str # "Compliant", "Needs Improvement", "Critical Violation"
    observed_rate: str # e.g. "92% compliance observed"

class HygieneReportResult(BaseModel):
    video_filename: str
    video_url: Optional[str] = None
    total_frames_analyzed: int
    duration_seconds: float
    overall_hygiene_score: float # 0 to 100
    hygiene_grade: str # A (90-100), B (80-89), C (70-79), F (<70)
    audit_summary: str
    metrics: List[MetricCompliance]
    violations: List[HygieneViolation]
    critical_risk_count: int
    moderate_risk_count: int
    low_risk_count: int
    recommended_corrective_actions: List[str]
    model_used: str
    created_at: str
    human_verification_disclaimer: str = "OFFICIAL AUDIT NOTICE: AI video monitoring flags visual hygiene indicators and anomalies for review. Observations are probabilistic and require on-site food safety officer or human manager verification before enforcement actions."
