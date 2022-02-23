# Deployment

```bash
cd backend
docker build . -t sebhtml/file-explorer-backend:v1
docker run -d -p 64000:4000 sebhtml/file-explorer-backend:v1
cd ..
```

```bash
cd frontend
docker build . -t sebhtml/file-explorer-frontend:v1
docker run -d -p 63000:3000 sebhtml/file-explorer-frontend:v1
cd ..
```

go to https://localhost:63000
