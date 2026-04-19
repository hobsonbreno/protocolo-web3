#!/bin/bash

echo "🚀 Iniciando Deploy do Nexus Protocol (Servidor01)..."

# 1. Atualizar código
git pull origin main

# 2. Subir os containers
echo "🏗️ Atualizando a imagem e subindo o container..."
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# 3. Limpeza
echo "🧹 Limpando imagens antigas..."
docker image prune -f

echo "✅ Deploy finalizado com sucesso!"
echo "-------------------------------------------------------"
echo "🌐 URL: http://100.86.74.47:8080"
echo "-------------------------------------------------------"
