#!/bin/bash

echo "🚀 Iniciando a infraestrutura do Nexus Protocol..."

# 1. Limpar porta 5173 se estiver ocupada
echo "🧹 Limpando processos na porta 5173..."
fuser -k 5173/tcp >/dev/null 2>&1 || pkill -f vite 2>/dev/null

# 2. Subir os containers (Desativado para evitar erro de registro)
# if [ -f "docker-compose.prod.yml" ]; then
#     echo "📦 Subindo containers via Docker Compose..."
#     docker compose -f docker-compose.prod.yml up -d
# else
#     echo "⚠️ Arquivo docker-compose.prod.yml não encontrado. Pulando etapa de containers."
# fi

# 2. Iniciar o Frontend
echo "🌐 Iniciando o servidor do Frontend..."
cd frontend && npm run dev &

echo "✅ Sistema pronto!"
echo "🏠 Dashboard: http://localhost:5173"
echo "🎥 Teleprompter/Studio: http://localhost:5173/studio"
echo "Aperte Ctrl+C para encerrar apenas o log (o sistema continuará rodando em background)."
