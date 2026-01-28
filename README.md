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
├── config/          # Configuración (DB, env, constantes)
├── models/          # Modelos de Mongoose
├── routes/          # Rutas de Express
└── server.ts        # Punto de entrada
\`\`\`
