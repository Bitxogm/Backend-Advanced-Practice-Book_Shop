#!/bin/bash

# --- PASO 1: Comprobar la inicialización de Git ---
if [ ! -d .git ]; then
    echo "⚠️ El repositorio Git no está inicializado. Ejecutando 'git init'..."
    git init
    if [ $? -ne 0 ]; then
        echo "❌ Error al inicializar Git. Abortando."
        exit 1
    fi
fi

# --- PASO 2: Crear el script de detección de secretos ---
echo "⚙️ Creando directorio scripts/ y archivo check-secrets.sh..."
mkdir -p scripts

cat > scripts/check-secrets.sh << 'EOF'
#!/bin/bash

echo "🔍 Escaneando posibles secretos en los ficheros a commitear..."

# Define las palabras clave a buscar
keywords=("apikey" "api_key" "secret" "token" "password" "firebase" "key" "pass" "client_id" "client_secret" "bearer")

# Obtenemos la lista de los ficheros en el staging area y le pasamos los nombres a grep.
# Utilizamos `git diff --cached --name-only` para archivos en staging.
grep_output=$(git diff --cached --name-only --diff-filter=ACM | xargs grep -iE "${keywords[@]}" 2>/dev/null)

if [ -z "$grep_output" ]; then
    echo "✅ No se encontraron posibles secretos en los ficheros a commitear."
    exit 0
else
    echo "⚠️ ¡Advertencia! Se detectaron posibles secretos en los siguientes ficheros:"
    echo "$grep_output"
    echo

    # Redireccionamos la entrada a /dev/tty para que el script pueda leer la respuesta del usuario
    # incluso cuando se ejecuta dentro del hook de git.
    read -r -p "¿Quieres continuar con el commit de todas formas? (s/N): " confirm < /dev/tty

    if [[ "$confirm" == "s" || "$confirm" == "S" ]]; then
        echo "✅ Continuando con el commit..."
        exit 0
    else
        echo "❌ Commit cancelado. Revisa los archivos señalados y añádelos a .gitignore si es necesario."
        exit 1
    fi
fi
EOF

# --- PASO 3: Dar permisos de ejecución al script ---
chmod +x scripts/check-secrets.sh
echo "✅ Permisos de ejecución dados a scripts/check-secrets.sh."


# --- PASO 4 y 5: Crear y configurar el hook pre-commit ---
HOOK_PATH=".git/hooks/pre-commit"

echo "⚙️ Creando el hook pre-commit en ${HOOK_PATH}..."

# Hook que ejecuta tanto detección de secretos como ESLint
cat > "${HOOK_PATH}" << 'EOF'
#!/bin/bash

echo "🔧 Ejecutando validaciones pre-commit..."

# 1. Ejecutar detección de secretos
./scripts/check-secrets.sh
if [ $? -ne 0 ]; then
    exit 1
fi

# 2. Ejecutar ESLint en archivos TypeScript modificados
echo ""
echo "🔍 Ejecutando ESLint en archivos TypeScript..."

# Obtener archivos .ts en staging
TS_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.ts$')

if [ -n "$TS_FILES" ]; then
    echo "Archivos a validar:"
    echo "$TS_FILES"
    
    # Ejecutar ESLint solo en los archivos modificados
    npm run lint -- $TS_FILES
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ ESLint encontró errores. Intenta ejecutar:"
        echo "   npm run lint:fix"
        echo ""
        echo "O puedes hacer el commit de todas formas con:"
        echo "   git commit --no-verify"
        exit 1
    fi
    
    echo "✅ ESLint: Sin errores"
else
    echo "ℹ️  No hay archivos TypeScript para validar"
fi

echo ""
echo "✅ Todas las validaciones pasaron correctamente"
exit 0
EOF

chmod +x "${HOOK_PATH}"
echo "✅ Hook pre-commit creado y configurado."

echo ""
echo "✨ CONFIGURACIÓN COMPLETADA ✨"
echo "El hook de detección de secretos está activo para todos tus commits."

# Limpieza: Puedes borrar setup-hooks.sh después de usarlo o añadirlo a .gitignore
# si no quieres versionarlo.
