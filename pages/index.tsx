import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../components/PerplexityHome.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Redirect to /search/[query]
      const encoded = encodeURIComponent(query.trim());
      router.push(`/search/${encoded}`);
    } catch {
      setError('Failed to redirect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>perplexity</title>
      </Head>
      <div className={styles.centerGroup}>
        <div className={styles.logo}>perplexity</div>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <textarea
            className={styles.textarea}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask anything..."
            required
            autoFocus
            disabled={loading}
            rows={2}
            maxLength={1000}
            style={{ width: '100%', maxWidth: 600 }}
            onKeyDown={e => {
              if (
                (e.key === 'Enter') // Cmd+Enter or Ctrl+Enter
              ) {
                e.preventDefault();
                (e.target as HTMLTextAreaElement).form?.requestSubmit();
              }
            }}
          />
          {error && <div style={{ color: '#ff6b6b', marginTop: 12, textAlign: 'center' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}