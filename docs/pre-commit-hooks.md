# Configuración de Pre-commit Hooks

Este proyecto utiliza **Husky** y **lint-staged** para automatizar la verificación de código antes de cada commit.

## 🔧 Herramientas Configuradas

### 1. **Husky**

Gestiona los git hooks automáticamente.

### 2. **lint-staged**

Ejecuta linters solo en los archivos que están en el staging area (archivos a commitear).

### 3. **Prettier**

Formateador de código automático.

### 4. **ESLint**

Linter para verificar calidad y estilo del código TypeScript.

### 5. **Check Secrets**

Script personalizado para detectar posibles secretos o credenciales en el código.

## 📋 ¿Qué sucede en cada commit?

Cuando ejecutas `git commit`, automáticamente se ejecutan los siguientes pasos:

1. **🔍 Verificación de secretos** - Busca palabras clave como `apikey`, `password`, `token`, etc.
2. **✨ ESLint** - Corrige automáticamente problemas de código en archivos `.ts`
3. **💅 Prettier** - Formatea automáticamente el código
4. **✅ Verificación final** - Si todo pasa, el commit se completa

## 🚀 Scripts Disponibles

```bash
# Formatear todo el código
npm run format

# Verificar formato sin modificar archivos
npm run format:check

# Ejecutar ESLint
npm run lint

# Ejecutar ESLint y corregir automáticamente
npm run lint:fix
```

## ⚙️ Configuración de lint-staged

Los archivos `.ts` y `.tsx` pasan por:

1. ESLint con corrección automática (`eslint --fix`)
2. Prettier con formato automático (`prettier --write`)

Los archivos `.json` y `.md` solo pasan por Prettier.

## 🛠️ Archivos de Configuración

- **`.prettierrc`** - Configuración de Prettier
- **`.prettierignore`** - Archivos ignorados por Prettier
- **`.eslintignore`** - Archivos ignorados por ESLint
- **`eslint.config.js`** - Configuración de ESLint
- **`.husky/pre-commit`** - Hook de pre-commit
- **`scripts/check-secrets.sh`** - Script de verificación de secretos

## 🔄 Saltarse los Hooks (NO RECOMENDADO)

Si necesitas hacer un commit sin ejecutar los hooks:

```bash
git commit --no-verify -m "mensaje"
```

⚠️ **Advertencia**: Solo usa esto en casos excepcionales. Los hooks están para proteger el código.

## 📦 Instalación en Proyectos Nuevos

Si clonas este repositorio, ejecuta:

```bash
npm install
```

Los hooks se configurarán automáticamente gracias al script `prepare` en package.json.
