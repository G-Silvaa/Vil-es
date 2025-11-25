<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1wv6lRFnJ5xgw2CE0bi8OXxAe7i82Qr39

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy na Vercel (grátis)

1. Faça fork/importe este repositório para sua conta do GitHub.
2. No painel da Vercel, clique em **Add New… → Project** e importe o repositório.
3. Build command: `npm run build` — Output directory: `dist`.
4. Em **Environment Variables**, adicione `GEMINI_API_KEY` com sua chave do Google Gemini (Production + Preview).
5. Deploy. A Vercel vai cuidar da função serverless em `api/generate-villain.ts`, mantendo a chave segura.
