export function slugifyLanguageName(name: string): string {
  const slug = name
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[^\\p{L}\\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'language';
}

export function buildLanguageNote(
  name: string,
  id: string,
  createdAt: string
): string {
  const quotedName = JSON.stringify(name);
  const quotedId = JSON.stringify(id);
  const quotedDate = JSON.stringify(createdAt);

  return [
    '---',
    'conlanger_type: language',
    'conlanger_schema: 1',
    `language_id: ${quotedId}`,
    `name: ${quotedName}`,
    'status: draft',
    `created: ${quotedDate}`,
    `updated: ${quotedDate}`,
    '---',
    '',
    `# ${name}`,
    '',
    '## Overview',
    '',
    ''
  ].join('\\n');
}
