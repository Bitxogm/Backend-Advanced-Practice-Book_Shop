#!/bin/bash

# Script de inicialización de proyecto TypeScript con Express + MongoDB
# Uso: ./init-new-project.sh /ruta/al/nuevo-proyecto

set -e  # Detener en caso de error

PROJECT_PATH=$1

if [ -z "$PROJECT_PATH" ]; then
    echo "❌ Error: Debes especificar la ruta del nuevo proyecto"
    echo "Uso: ./init-new-project.sh /ruta/al/nuevo-proyecto"
    exit 1
fi

if [ -d "$PROJECT_PATH" ]; then
    echo "⚠️  El directorio ya existe: $PROJECT_PATH"
    read -p "¿Quieres continuar de todas formas? (s/N): " confirm
    if [[ "$confirm" != "s" && "$confirm" != "S" ]]; then
        echo "❌ Cancelado"
        exit 1
    fi
else
    echo "📁 Creando directorio: $PROJECT_PATH"
    mkdir -p "$PROJECT_PATH"
fi

echo ""
echo "🚀 Iniciando configuración del proyecto..."
echo ""

# Cambiar al directorio del proyecto
cd "$PROJECT_PATH"

# 1. Inicializar Git
echo "📦 Inicializando Git..."
git init

# 2. Crear archivos de configuración
echo "📋 Creando archivos de configuración..."

# package.json
cat > package.json << 'PKGEOF'
{
  "name": "backend-typescript-express",
  "version": "1.0.0",
  "description": "Backend con TypeScript, Express y MongoDB",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "@types/cors": "^2.8.17",
    "typescript": "^5.3.3",
    "nodemon": "^3.0.2",
    "ts-node": "^10.9.2",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.16.0",
    "@typescript-eslint/parser": "^6.16.0"
  }
}
PKGEOF

# tsconfig.json
cat > tsconfig.json << 'TSEOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
TSEOF

# nodemon.json
cat > nodemon.json << 'NODEEOF'
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/server.ts"
}
NODEEOF

# eslint.config.js
cat > eslint.config.js << 'ESLEOF'
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};
ESLEOF

# .gitignore
cat > .gitignore << 'GITEOF'
node_modules/
dist/
.env
*.log
.DS_Store
GITEOF

# docker-compose.yml
cat > docker-compose.yml << 'DOCKEREOF'
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
DOCKEREOF

# setup-hooks.sh
cat > setup-hooks.sh << 'HOOKEOF'
#!/bin/bash
mkdir -p .git/hooks
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
npm run lint
EOF
chmod +x .git/hooks/pre-commit
echo "✅ Git hooks configurados"
HOOKEOF

chmod +x setup-hooks.sh

# 3. Crear estructura de directorios
echo "📂 Creando estructura de directorios..."
mkdir -p src/{config,models,routes}

# src/config/database.ts
cat > src/config/database.ts << 'DBEOF'
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017/mydb?authSource=admin';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};
DBEOF

# src/server.ts
cat > src/server.ts << 'SERVEREOF'
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas básicas
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: '🚀 API funcionando correctamente' });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();
SERVEREOF

# .env
cat > .env << 'ENVEOF'
PORT=3000
MONGO_URI=mongodb://admin:admin123@localhost:27017/mydb?authSource=admin
ENVEOF

# 4. Crear README básico
echo "📝 Creando README.md..."
cat > README.md << 'EOF'
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
EOF

echo ""
echo "📦 Instalando dependencias..."
npm install

echo ""
echo "🔧 Configurando Git hooks..."
bash setup-hooks.sh

echo ""
echo "✨ ¡Proyecto configurado exitosamente! ✨"
echo ""
echo "📍 Ubicación: $PROJECT_PATH"
echo ""
echo "🎯 Próximos pasos:"
echo "   1. cd $PROJECT_PATH"
echo "   2. docker-compose up -d    # Iniciar MongoDB"
echo "   3. npm run dev             # Iniciar servidor"
echo ""
