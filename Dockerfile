# ---------- STEP 1: build frontend ----------
FROM node:20 AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install --omit=dev

COPY frontend .
RUN npm run build


# ---------- STEP 2: backend ----------
FROM python:3.12-slim

WORKDIR /app

# install backend deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy backend code
COPY backend .

# copy built React app into backend
COPY --from=frontend-build /app/frontend/dist ./static

EXPOSE 10000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]
