from typing import List, Optional, Dict
from pydantic import BaseModel

class VisualAnomaly(BaseModel):
    category: str # "Discoloration", "Texture Roughness", "Spore/Mold Pattern", "Moisture/Sliminess"
    severity: str # "Low", "Medium", "High"
    confidence: float
    description: str
    affected_percentage: float

class FreshnessAnalysisResult(BaseModel):
    item_detected: str
    freshness_status: str # "Fresh", "Moderately Fresh", "Potentially Spoiled"
    overall_confidence: float
    freshness_score: float # 0 to 100
    color_degradation_index: float # 0 to 100
    surface_texture_abnormality: float # 0 to 100
    detected_anomalies: List[VisualAnomaly]
    storage_recommendation: str
    estimated_shelf_life_days: int
    safety_instructions: List[str]
    model_used: str
    image_url: Optional[str] = None
    safety_disclaimer: str = "IMPORTANT SAFETY NOTICE: Visual computer vision analysis scans surface appearance, textures, and color distribution. It cannot detect odorless bacterial toxins, salmonella, E. coli, or internal chemical degradation. Always inspect smell, texture, and storage history before consuming food. When in doubt, discard."
