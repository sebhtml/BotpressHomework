# Deployment

```bash
cd frontend
docker build . -t sebhtml/file-explorer-frontend:v1
docker run -d -p 62000:2000 sebhtml/file-explorer-frontend:v1
cd ..

```

