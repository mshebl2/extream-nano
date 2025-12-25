/**
 * SEO Utilities for Blog Posts
 * Auto-generates SEO metadata from blog content
 * Supports Arabic content
 */

interface SEOMetadata {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    slug: string;
}

/**
 * Generate a URL-friendly slug from text (supports Arabic)
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-\u0600-\u06FF]/g, '') // Remove special characters but keep Arabic
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extract keywords from text using simple frequency analysis
 * Supports both English and Arabic stop words
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
    // English and Arabic stop words
    const stopWords = new Set([
        // English
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
        'could', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
        'it', 'its', 'they', 'them', 'their', 'we', 'us', 'our', 'you', 'your',
        // Arabic
        'في', 'من', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك',
        'التي', 'الذي', 'هو', 'هي', 'هم', 'نحن', 'أنت', 'أنا', 'كان', 'كانت',
        'أو', 'و', 'ثم', 'لكن', 'بل', 'إن', 'أن', 'ما', 'لا', 'قد', 'كل',
    ]);

    // Extract words
    const words = text
        .toLowerCase()
        .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word));

    // Count frequency
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    // Sort by frequency and return top keywords
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxKeywords)
        .map(([word]) => word);
}

/**
 * Truncate text to a specific length while preserving word boundaries
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Generate comprehensive SEO metadata from blog post content
 */
export function generateSEOMetadata(
    title: string,
    content: string,
    excerpt?: string
): SEOMetadata {
    // Generate slug from title
    const slug = generateSlug(title);

    // Generate meta title (aim for 50-60 characters)
    const metaTitle = title.length <= 60 ? title : truncateText(title, 57);

    // Generate meta description (aim for 150-160 characters)
    let metaDescription: string;
    if (excerpt && excerpt.length > 0) {
        metaDescription = excerpt.length <= 160 ? excerpt : truncateText(excerpt, 157);
    } else {
        // Extract first paragraph or first 160 chars from content
        const strippedContent = stripHtml(content);
        metaDescription = truncateText(strippedContent, 157);
    }

    // Extract keywords from title and content
    const strippedContent = stripHtml(content);
    const titleKeywords = extractKeywords(title, 3);
    const contentKeywords = extractKeywords(strippedContent, 7);
    const metaKeywords = Array.from(new Set([...titleKeywords, ...contentKeywords])).slice(0, 10);

    return {
        metaTitle,
        metaDescription,
        metaKeywords,
        slug,
    };
}

/**
 * Generate Open Graph metadata for social sharing
 */
export function generateOpenGraphTags(
    title: string,
    description: string,
    imageUrl: string,
    url: string,
    author?: string
): Record<string, string> {
    return {
        'og:type': 'article',
        'og:title': title,
        'og:description': description,
        'og:image': imageUrl,
        'og:url': url,
        ...(author && { 'article:author': author }),
    };
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterCardTags(
    title: string,
    description: string,
    imageUrl: string
): Record<string, string> {
    return {
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': imageUrl,
    };
}

/**
 * Apply internal links to content based on mappings
 * Supports both Latin and Arabic text
 */
export function applyInternalLinks(
    content: string,
    mappings: Array<{
        keyword: string;
        keywordAr?: string;
        url: string;
        maxOccurrences: number;
        caseSensitive: boolean;
    }>,
    maxLinksTotal: number = 5
): string {
    let processedContent = content;
    let totalLinksAdded = 0;

    // Characters that act as word separators (including Arabic punctuation)
    const separators = '[\\s،.!?:;"\'()\\[\\]{}«»؟؛<>]';

    // Sort by priority (mappings should already be sorted)
    for (const mapping of mappings) {
        if (totalLinksAdded >= maxLinksTotal) break;

        const keywords = [mapping.keyword];
        if (mapping.keywordAr) {
            keywords.push(mapping.keywordAr);
        }

        for (const keyword of keywords) {
            if (totalLinksAdded >= maxLinksTotal) break;
            if (!keyword || keyword.trim().length === 0) continue;

            const flags = mapping.caseSensitive ? 'g' : 'gi';
            // Escape special regex characters in keyword
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Use lookahead/lookbehind that work with Arabic:
            // Match keyword that is:
            // 1. Not already inside an <a> tag
            // 2. Preceded by start of string or a separator
            // 3. Followed by end of string or a separator
            const regex = new RegExp(
                `(?<!<a[^>]*>)((?:^|${separators}))(${escapedKeyword})((?:${separators}|$))(?![^<]*<\\/a>)`,
                flags
            );

            let occurrences = 0;
            processedContent = processedContent.replace(regex, (fullMatch, before, matchedKeyword, after) => {
                if (occurrences >= mapping.maxOccurrences || totalLinksAdded >= maxLinksTotal) {
                    return fullMatch;
                }
                occurrences++;
                totalLinksAdded++;
                return `${before}<a href="${mapping.url}" class="internal-link">${matchedKeyword}</a>${after}`;
            });
        }
    }

    return processedContent;
}
