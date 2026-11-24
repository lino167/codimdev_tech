#!/usr/bin/env bash
# Publica a pasta dist/ na branch `hostinger`, que a Hostinger lê (deploy por Git, site estático).
# Mantém o histórico LINEAR (um commit novo por publicação, sem force push): a Hostinger faz `reset` e `pull` a cada
# deploy, e uma história reescrita quebraria o pull. Sem mudança no dist, não cria commit.
# Uso: REPO_URL=<url com acesso de escrita> bash scripts/publicar-hostinger.sh [pasta-do-build]
set -euo pipefail

DIST="${1:-dist}"
BRANCH="${BRANCH:-hostinger}"
: "${REPO_URL:?defina REPO_URL (a URL do repositório, com acesso de escrita)}"
[ -f "$DIST/index.html" ] || { echo "erro: $DIST/index.html não existe (rode o build antes)" >&2; exit 1; }

DIST_ABS="$(cd "$DIST" && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if git ls-remote --exit-code --heads "$REPO_URL" "$BRANCH" >/dev/null 2>&1; then
  git clone --quiet --depth 1 --branch "$BRANCH" "$REPO_URL" "$TMP/site"
else
  mkdir "$TMP/site"
  git -C "$TMP/site" init --quiet -b "$BRANCH"
  git -C "$TMP/site" remote add origin "$REPO_URL"
fi

cd "$TMP/site"
git config user.name "${GIT_AUTHOR_NAME:-github-actions[bot]}"
git config user.email "${GIT_AUTHOR_EMAIL:-41898282+github-actions[bot]@users.noreply.github.com}"

# troca o conteúdo inteiro pelo build novo (arquivos que saíram do site saem também)
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R "$DIST_ABS"/. .

git add -A
if git diff --cached --quiet; then
  echo "Nada mudou no build: nenhuma publicação."
  exit 0
fi
git commit --quiet -m "Build de ${GITHUB_SHA:-local}"
git push --quiet origin "$BRANCH"
echo "Publicado na branch $BRANCH."
