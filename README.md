# Perplexity Clone – AI Search App

This project is a Perplexity-like AI search web app built with Next.js, TypeScript, OpenAI (ChatGPT), and SerpAPI. It allows users to ask questions, view AI-generated answers with citations, see related web sources, and browse relevant images—all in a modern, Perplexity-inspired interface.

## Features

- **Ask Anything:** Enter a question and get a detailed, multi-paragraph AI answer with citations.
- **Web Sources:** Top web results are shown as cards with favicons, titles, and descriptions.
- **Images Tab:** Browse up to 12 relevant images for your query (via SerpAPI Google Images).
- **Sources Tab:** See up to 10 web sources with links and snippets.
- **Sticky Search Bar:** Always accessible at the bottom for new queries.
- **Modern UI:** Responsive, Perplexity-style design with sticky headers and tabs.

## Tech Stack
- [Next.js](https://nextjs.org/) (React, TypeScript)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [SerpAPI](https://serpapi.com/)

## Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/yourrepo.git
   cd yourrepo
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```
3. **Add API keys:**
   - Create a `.env.local` file in the root:
     ```env
     OPENAI_API_KEY=your_openai_key
     SERPAPI_API_KEY=your_serpapi_key
     ```
4. **Run the app:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```
5. **Open in browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## Usage
- Type a question on the landing page and press Enter.
- You'll be redirected to a results page with tabs for Answer, Images, and Sources.
- Use the sticky search bar at the bottom to ask a new question from anywhere.

## Customization
- You can adjust the number of images/sources, UI styles, or swap in other LLM/image/search APIs as needed.

## License
MIT
