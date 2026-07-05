export function parseResumeEntries(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((item) => {
        if (typeof item === 'string') {
          return { title: 'Resume', description: '', url: item.trim() };
        }

        if (typeof item === 'object') {
          const url = item.url || item.resume_url || item.link || '';
          if (!url) return null;

          return {
            title: item.title || 'Resume',
            description: item.description || '',
            url: url.trim(),
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  if (typeof value === 'object' && value !== null) {
    const url = value.url || value.resume_url || value.link || '';
    if (!url) return [];
    return [{ title: value.title || 'Resume', description: value.description || '', url: url.trim() }];
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parseResumeEntries(parsed);
      }

      if (parsed && typeof parsed === 'object') {
        return parseResumeEntries([parsed]);
      }
    } catch (error) {
      // Treat plain strings as a single resume URL.
    }

    return [{ title: 'Resume', description: '', url: trimmed }];
  }

  return [];
}

export function getPrimaryResumeUrl(value) {
  const resumes = parseResumeEntries(value);
  return resumes[0]?.url || '/assets/resume.pdf';
}

export function serializeResumeEntries(entries = []) {
  const normalized = (entries || [])
    .filter(Boolean)
    .map((entry) => ({
      title: entry.title?.trim() || 'Resume',
      description: entry.description?.trim() || '',
      url: entry.url?.trim() || '',
    }))
    .filter((entry) => entry.url);

  return normalized.length ? JSON.stringify(normalized) : '';
}
