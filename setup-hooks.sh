#!/bin/bash
mkdir -p .git/hooks
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
npm run lint
EOF
chmod +x .git/hooks/pre-commit
echo "✅ Git hooks configurados"
