#!/bin/bash

# Takeshi Bot - Smart Auth Cleanup (GUI + NVPanda)
# Compatível com Baileys RC9 + Node >=22.8

echo "🤖 Takeshi Bot - Smart Cleanup System"
echo "====================================="
echo ""

BASE_DIR="./assets/auth/baileys"

# Verifica raiz do projeto
if [ ! -d "./src" ] || [ ! -d "./assets" ]; then
    echo "❌ Erro: Execute na raiz do projeto takeshi-bot"
    exit 1
fi

# Detecta sessão Baileys
if [ ! -d "$BASE_DIR" ]; then
    echo "⚠️ Nenhuma sessão Baileys encontrada"
    echo "✔ Nada para limpar"
    exit 0
fi

echo "🔍 Detectando ambiente Node.js..."

NODE_VERSION=$(node -v)
echo "📦 Node: $NODE_VERSION"

echo ""
echo "🔍 Analisando sessão Baileys RC9..."

FILE_COUNT=$(find "$BASE_DIR" -type f 2>/dev/null | wc -l)
JSON_COUNT=$(find "$BASE_DIR" -name "*.json" 2>/dev/null | wc -l)
EMPTY_FILES=$(find "$BASE_DIR" -type f -size 0 2>/dev/null | wc -l)

echo "📦 Arquivos totais: $FILE_COUNT"
echo "🧾 JSON files: $JSON_COUNT"
echo "⚠️ Arquivos vazios: $EMPTY_FILES"

echo ""

# Heurística de corrupção (Baileys RC9)
SHOULD_CLEAN=false

if [ "$FILE_COUNT" -eq 0 ]; then
    echo "⚠️ Sessão vazia detectada"
    SHOULD_CLEAN=true
fi

if [ "$EMPTY_FILES" -gt 0 ]; then
    echo "⚠️ Arquivos corrompidos detectados"
    SHOULD_CLEAN=true
fi

if [ "$JSON_COUNT" -lt 2 ]; then
    echo "⚠️ Sessão incompleta (Baileys RC9 inválido)"
    SHOULD_CLEAN=true
fi

echo ""

if [ "$SHOULD_CLEAN" = true ]; then
    echo "⚠️ Cleanup recomendado pelo sistema"
else
    echo "✔ Sessão aparentemente saudável"
fi

echo ""
read -p "Deseja continuar? (s/N): " confirm

case $confirm in
    [sS]|[sS][iI][mM])
        echo ""
        echo "🧠 Iniciando limpeza inteligente..."

        BACKUP="./assets/auth_backup_$(date +%Y%m%d_%H%M%S)"

        echo "💾 Criando backup seguro..."
        mkdir -p "$BACKUP"
        cp -r "$BASE_DIR" "$BACKUP"

        echo "🗑 Removendo sessão Baileys..."
        rm -rf "$BASE_DIR"

        if [ $? -eq 0 ]; then
            echo "✅ Cleanup concluído com sucesso!"
            echo ""
            echo "📌 Backup salvo em:"
            echo "   $BACKUP"
            echo ""
            echo "🚀 Próximo passo:"
            echo "   npm install (se necessário)"
            echo "   npm start"
            echo ""
            echo "⚙️ Compatível com:"
            echo "   - Node $NODE_VERSION"
            echo "   - Baileys 7.0.0-rc.9"
            echo "   - ESM modules"
        else
            echo "❌ Erro ao limpar sessão"
            exit 1
        fi
        ;;
    *)
        echo "❌ Operação cancelada"
        exit 0
        ;;
esac

echo ""
echo "🚀 Smart Cleanup finalizado"