import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException
from app.config import settings

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm", ".mkv"}
MAX_IMAGE_SIZE = 15 * 1024 * 1024 # 15MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024 # 100MB

async def save_uploaded_media(file: UploadFile, is_video: bool = False) -> str:
    filename = file.filename or "media"
    ext = os.path.splitext(filename)[1].lower()
    
    if is_video:
        if ext not in ALLOWED_VIDEO_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid video format '{ext}'. Allowed formats: {', '.join(ALLOWED_VIDEO_EXTENSIONS)}"
            )
    else:
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image format '{ext}'. Allowed formats: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
            )
            
    # Generate unique filename to prevent collisions and sanitize names
    unique_name = f"{uuid.uuid4().hex[:12]}_{filename.replace(' ', '_')}"
    target_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    
    # Save file in chunks to handle size gracefully
    total_size = 0
    max_size = MAX_VIDEO_SIZE if is_video else MAX_IMAGE_SIZE
    
    async with aiofiles.open(target_path, 'wb') as out_file:
        while content := await file.read(1024 * 1024): # 1MB chunk
            total_size += len(content)
            if total_size > max_size:
                # Cleanup file if too big
                try:
                    os.remove(target_path)
                except OSError:
                    pass
                raise HTTPException(
                    status_code=413,
                    detail=f"File exceeds maximum allowed size of {max_size // (1024 * 1024)}MB."
                )
            await out_file.write(content)
            
    # Return relative URL
    return f"/uploads/{unique_name}"
