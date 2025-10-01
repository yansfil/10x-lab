/**
 * URL 유틸리티 함수 모음
 */

/**
 * 쿼리 파라미터를 객체로 파싱
 * @example
 * parseQueryParams('?foo=bar&baz=qux') // { foo: 'bar', baz: 'qux' }
 */
export function parseQueryParams(url: string): Record<string, string> {
    const params = new URLSearchParams(url.includes('?') ? url.split('?')[1] : url);
    const result: Record<string, string> = {};

    params.forEach((value, key) => {
        result[key] = value;
    });

    return result;
}

/**
 * 객체를 쿼리 스트링으로 변환
 * @example
 * buildQueryString({ foo: 'bar', baz: 'qux' }) // 'foo=bar&baz=qux'
 */
export function buildQueryString(params: Record<string, any>): string {
    return Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
}

/**
 * URL에 쿼리 파라미터 추가
 * @example
 * addQueryParams('https://example.com', { foo: 'bar' }) 
 * // 'https://example.com?foo=bar'
 */
export function addQueryParams(url: string, params: Record<string, any>): string {
    const queryString = buildQueryString(params);
    if (!queryString) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${queryString}`;
}

/**
 * URL이 유효한지 검증
 * @example
 * isValidUrl('https://example.com') // true
 * isValidUrl('not-a-url') // false
 */
export function isValidUrl(urlString: string): boolean {
    try {
        new URL(urlString);
        return true;
    } catch {
        return false;
    }
}

/**
 * URL에서 도메인 추출
 * @example
 * getDomain('https://www.example.com/path') // 'www.example.com'
 */
export function getDomain(url: string): string | null {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return null;
    }
}

/**
 * URL에서 특정 쿼리 파라미터 값 가져오기
 * @example
 * getQueryParam('https://example.com?foo=bar&baz=qux', 'foo') // 'bar'
 */
export function getQueryParam(url: string, paramName: string): string | null {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get(paramName);
    } catch {
        // URL이 상대 경로인 경우
        const params = parseQueryParams(url);
        return params[paramName] || null;
    }
}

/**
 * URL에서 특정 쿼리 파라미터 제거
 * @example
 * removeQueryParam('https://example.com?foo=bar&baz=qux', 'foo')
 * // 'https://example.com?baz=qux'
 */
export function removeQueryParam(url: string, paramName: string): string {
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.delete(paramName);
        return urlObj.toString();
    } catch {
        // 상대 경로 처리
        const [base, queryString] = url.split('?');
        if (!queryString) return url;

        const params = parseQueryParams(queryString);
        delete params[paramName];

        const newQuery = buildQueryString(params);
        return newQuery ? `${base}?${newQuery}` : base;
    }
}

/**
 * 두 URL 경로를 결합
 * @example
 * joinPaths('/api', 'users', '123') // '/api/users/123'
 * joinPaths('https://api.com/', '/users') // 'https://api.com/users'
 */
export function joinPaths(...paths: string[]): string {
    return paths
        .map((path, index) => {
            // 첫 번째 경로는 앞의 슬래시 유지
            if (index === 0) return path.replace(/\/+$/, '');
            // 마지막 경로는 뒤의 슬래시 유지
            if (index === paths.length - 1) return path.replace(/^\/+/, '');
            // 중간 경로는 앞뒤 슬래시 제거
            return path.replace(/^\/+|\/+$/g, '');
        })
        .filter(path => path.length > 0)
        .join('/');
}

/**
 * URL이 절대 URL인지 확인
 * @example
 * isAbsoluteUrl('https://example.com') // true
 * isAbsoluteUrl('/path/to/page') // false
 */
export function isAbsoluteUrl(url: string): boolean {
    return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}

/**
 * URL에서 파일 확장자 추출
 * @example
 * getFileExtension('https://example.com/image.png') // 'png'
 * getFileExtension('https://example.com/doc.pdf?v=1') // 'pdf'
 */
export function getFileExtension(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const match = pathname.match(/\.([^.]+)$/);
        return match ? match[1] : null;
    } catch {
        const match = url.split('?')[0].match(/\.([^.]+)$/);
        return match ? match[1] : null;
    }
}

/**
 * URL을 안전하게 인코딩 (쿼리 파라미터 포함)
 * @example
 * safeEncodeUrl('https://example.com/path with spaces')
 */
export function safeEncodeUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.href; // URL 객체가 자동으로 인코딩
    } catch {
        return encodeURI(url);
    }
}

/**
 * URL에서 해시(#) 부분 제거
 * @example
 * removeHash('https://example.com/page#section') // 'https://example.com/page'
 */
export function removeHash(url: string): string {
    return url.split('#')[0];
}

/**
 * URL이 특정 도메인에 속하는지 확인
 * @example
 * isUrlFromDomain('https://api.github.com/users', 'github.com') // true
 */
export function isUrlFromDomain(url: string, domain: string): boolean {
    const urlDomain = getDomain(url);
    if (!urlDomain) return false;

    return urlDomain === domain || urlDomain.endsWith(`.${domain}`);
}

/**
 * 상대 URL을 절대 URL로 변환
 * @example
 * toAbsoluteUrl('/api/users', 'https://example.com')
 * // 'https://example.com/api/users'
 */
export function toAbsoluteUrl(relativeUrl: string, baseUrl: string): string {
    try {
        return new URL(relativeUrl, baseUrl).href;
    } catch {
        return relativeUrl;
    }
}

/**
 * URL을 각 부분으로 분해
 * @example
 * parseUrl('https://user:pass@example.com:8080/path?q=1#hash')
 * // { protocol: 'https:', host: 'example.com:8080', ... }
 */
export function parseUrl(url: string) {
    try {
        const urlObj = new URL(url);
        return {
            protocol: urlObj.protocol,
            username: urlObj.username,
            password: urlObj.password,
            host: urlObj.host,
            hostname: urlObj.hostname,
            port: urlObj.port,
            pathname: urlObj.pathname,
            search: urlObj.search,
            searchParams: Object.fromEntries(urlObj.searchParams),
            hash: urlObj.hash,
            origin: urlObj.origin,
            href: urlObj.href,
        };
    } catch (error) {
        throw new Error(`Invalid URL: ${url}`);
    }
}

/**
 * 쿼리 파라미터 업데이트 (기존 값 덮어쓰기)
 * @example
 * updateQueryParams('https://example.com?foo=old', { foo: 'new', bar: 'baz' })
 * // 'https://example.com?foo=new&bar=baz'
 */
export function updateQueryParams(url: string, params: Record<string, any>): string {
    try {
        const urlObj = new URL(url);
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                urlObj.searchParams.delete(key);
            } else {
                urlObj.searchParams.set(key, String(value));
            }
        });
        return urlObj.toString();
    } catch {
        // 상대 경로 처리
        const [base, queryString] = url.split('?');
        const existingParams = queryString ? parseQueryParams(queryString) : {};
        const mergedParams = { ...existingParams, ...params };
        const newQuery = buildQueryString(mergedParams);
        return newQuery ? `${base}?${newQuery}` : base;
    }
}
