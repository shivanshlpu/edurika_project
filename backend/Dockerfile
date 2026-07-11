FROM python:3.10-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
# Models should be trained prior to building or copied if they exist
# However, usually we should train them if they don't exist

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
