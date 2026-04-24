#!/bin/bash

echo "🛑 Encerrando o Nexus Protocol..."

# 1. Parar o Frontend
echo "🌐 Parando o servidor do Frontend..."
fuser -k 5173/tcp >/dev/null 2>&1 || pkill -f vite 2>/dev/null || echo "Frontend já estava parado."

# 2. Parar os containers (Desativado)
# if [ -f "docker-compose.prod.yml" ]; then
#     echo "📦 Desligando containers Docker..."
#     docker compose -f docker-compose.prod.yml down
# fi

echo "✅ Tudo encerrado com sucesso. Até a próxima! 🚀"
