#!/bin/bash

# Configuration
API_URL="https://yowpainter-backend.onrender.com/api/events"
JSON_FILE="events_seed.json"
TENANT_ID="mr-d-ie46g"

# Vérification du token
if [ -z "$AUTH_TOKEN" ]; then
    echo "Erreur: La variable d'environnement AUTH_TOKEN n'est pas définie."
    exit 1
fi

# Boucle pour créer chaque événement
echo "Début de la création des événements pour le tenant : $TENANT_ID"

jq -c '.[]' "$JSON_FILE" | while read -r event; do
    echo "Création de : $(echo "$event" | jq -r '.name')..."
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "X-Tenant-ID: $TENANT_ID" \
        -d "$event")

    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)

    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo "✅ Succès !"
    else
        echo "❌ Échec (Code: $http_code)"
        echo "Réponse : $body"
    fi
    echo "-----------------------------------"
done

echo "Terminé !"
