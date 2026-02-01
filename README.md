# Configuración de variables de entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edita el archivo `.env` y completa los valores necesarios (credenciales de base de datos, puertos, etc).

> **Nota:** El archivo `.env` está en `.gitignore` y no se sube al repositorio. Nunca subas tus credenciales reales.

# Proyecto TypeScript + Express + MongoDB

## Instalación

\`\`\`bash
npm install
\`\`\`

## Desarrollo

\`\`\`bash

# Iniciar base de datos con Docker

docker-compose up -d

# Iniciar servidor en modo desarrollo

npm run dev
\`\`\`

## Scripts

- \`npm run dev\` - Modo desarrollo con nodemon
- \`npm run build\` - Compilar TypeScript
- \`npm start\` - Ejecutar versión compilada
- \`npm run lint\` - Verificar código con ESLint
- \`npm run lint:fix\` - Corregir errores automáticamente

## Estructura

\`\`\`
src/
├── config/ # Configuración (DB, env, constantes)
├── models/ # Modelos de Mongoose
├── routes/ # Rutas de Express
└── server.ts # Punto de entrada
\`\`\`
