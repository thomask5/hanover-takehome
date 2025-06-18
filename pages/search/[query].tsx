import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../components/PerplexityHome.module.css';

const TABS = ["Answer", "Images", "Sources"];

export default function SearchPage() {
  const router = useRouter();
  const { query: queryParam } = router.query;
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<{ title: string; snippet: string; link: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [tab, setTab] = useState<'Answer' | 'Images' | 'Sources'>('Answer');

  // Fetch results when queryParam changes
  useEffect(() => {
    if (typeof queryParam === 'string' && queryParam.trim()) {
      const decoded = decodeURIComponent(queryParam);
      setQuery(decoded);
      setInput(''); // Clear the search box after a search
      setLoading(true);
      setError('');
      setAnswer('');
      setSources([]);
      setImages([]);
      fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: decoded }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.answer) setAnswer(data.answer);
          if (data.sources) setSources(data.sources);
          if (data.images) setImages(data.images);
          if (data.error) setError(data.error);
        })
        .catch(() => setError('Failed to fetch.'))
        .finally(() => setLoading(false));
    }
  }, [queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/search/${encodeURIComponent(input.trim())}`);
  };

  // Tab content
  let tabContent = null;
  if (tab === 'Answer') {
    tabContent = answer && <div className={styles.answer}>{answer}</div>;
  } else if (tab === 'Images') {
    tabContent = (
      <div className={styles.imagesRow} style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {(images.length > 0 ? images : [1,2,3].map(() => 'https://placehold.co/320x200/23262f/fff?text=No+Image')).slice(0, 12).map((img, i) => (
          <img key={i} src={img} alt="Related visual" className={styles.imageThumb} style={{ marginBottom: 16 }} />
        ))}
      </div>
    );
  } else if (tab === 'Sources') {
    tabContent = (
      <div className={styles.sources}>
        <ol>
          {sources.slice(0, 10).map((src, i) => (
            <li key={i} style={{ marginBottom: 12 }}>
              <a className={styles.sourceLink} href={src.link} target="_blank" rel="noopener noreferrer">{src.title}</a>
              <div style={{ fontSize: '0.95em', color: '#b0b8c1' }}>{src.snippet}</div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const links = sources.slice(0, 4);

  return (
    <div className={styles.container}>
      <Head>
        <title>{query ? `${query} - perplexity` : 'perplexity'}</title>
      </Head>
      <div className={styles.contentColumn}>
        <div className={styles.stickyHeader}>
          <div className={styles.queryHeading}>{query}</div>
          {/* Tabs */}
          <div className={styles.tabsBar}>
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t as typeof tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: tab === t ? '#19c6e6' : '#b0b8c1',
                  fontWeight: tab === t ? 600 : 400,
                  fontSize: '1.1rem',
                  padding: '12px 0 8px 0',
                  borderBottom: tab === t ? '2.5px solid #19c6e6' : '2.5px solid transparent',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'color 0.15s, border-bottom 0.15s',
                  marginBottom: -2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                {t === 'Answer' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={tab === t ? '#19c6e6' : '#b0b8c1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><path d="M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>
                )}
                {t === 'Images' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={tab === t ? '#19c6e6' : '#b0b8c1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                )}
                {t === 'Sources' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={tab === t ? '#19c6e6' : '#b0b8c1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.42 1.42M17.66 17.66l1.42 1.42M17.66 6.34l1.42-1.42M4.93 19.07l1.42-1.42"/></svg>
                )}
                {t}
                {t === 'Sources' && (
                  <span style={{ color: '#b0b8c1', fontWeight: 400, fontSize: '0.98em', marginLeft: 2 }}>
                    &nbsp;· {sources.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.scrollContent}>
          {loading && <div style={{ color: '#b0b8c1', marginBottom: 24 }}>Loading...</div>}
          {error && <div style={{ color: '#ff6b6b', marginBottom: 24 }}>{error}</div>}
          {!loading && !error && (
            <>
              {/* Only show links row on Answer tab */}
              {tab === 'Answer' && (
                <>
                  <div className={styles.linksRow}>
                    {links.map((src, i) => (
                      <a
                        key={i}
                        className={styles.linkCard}
                        href={src.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={src.title}
                      >
                        <img
                          className={styles.linkFavicon}
                          src={`https://www.google.com/s2/favicons?sz=64&domain=${new URL(src.link).hostname}`}
                          alt=""
                          loading="lazy"
                        />
                        <div className={styles.linkText}>
                          <div className={styles.linkDomain}>{new URL(src.link).hostname.replace('www.', '')}</div>
                          <div className={styles.linkTitle}>{src.title}</div>
                          <div className={styles.linkDesc}>{src.snippet}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className={styles.imagesRow}>
                    {(images.length > 0 ? images : [1,2,3].map(() => 'https://placehold.co/320x200/23262f/fff?text=No+Image')).slice(0, 3).map((img, i) => (
                      <img key={i} src={img} alt="Related visual" className={styles.imageThumb} />
                    ))}
                  </div>
                </>
              )}
              {tabContent}
            </>
          )}
        </div>
      </div>
      <div className={styles.stickyBottom}>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <input
            className={styles.textarea}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything..."
            required
            disabled={loading}
            maxLength={1000}
            style={{ width: '100%', maxWidth: 600 }}
          />
        </form>
      </div>
    </div>
  );
}