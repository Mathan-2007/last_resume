# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

# Routers
from app.routes.resume_routes import router as resume_router
from app.routes.leetcode_routes import router as leetcode_router
from app.routes.codechef_routes import router as codechef_router
from app.routes.github_routes import router as github_router
from app.routes.analyze_all import router as analyze_all_router
from app.routes.admin_resume_filter import router as admin_filter_router
from app.routes.auth_routes import router as auth_router
from app.routes.user import router as user_router
from app.routes.ai_routes import router as ai_router

app = FastAPI(title="AI Resume + Platform Analyzer")

# ✅ SIMPLE CORS (same-origin now)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Routers
# -------------------------
app.include_router(resume_router, prefix="/resume", tags=["Resume"])
app.include_router(leetcode_router, prefix="/leetcode", tags=["LeetCode"])
app.include_router(codechef_router, prefix="/codechef", tags=["CodeChef"])
app.include_router(github_router, prefix="/github", tags=["GitHub"])
app.include_router(analyze_all_router, tags=["Analyze All"])
app.include_router(admin_filter_router, prefix="/admin", tags=["Admin Filter"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(user_router, tags=["User"])
app.include_router(ai_router, tags=["AI"])

# -------------------------
# Static React Build
# -------------------------
from fastapi.responses import Response
from starlette.staticfiles import StaticFiles

class CacheStaticFiles(StaticFiles):
    async def get_response(self, path, scope):
        response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return response

app.mount("/assets", CacheStaticFiles(directory="static/assets"), name="assets")

# React fallback (VERY IMPORTANT)
@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    return FileResponse("static/index.html")

# -------------------------
# Local Run (not used in Docker)
# -------------------------
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
