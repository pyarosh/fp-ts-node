import path from 'path';
import {
	IOEither,
	tryCatch
} from 'fp-ts/lib/IOEither';

type Path = string;

const toError = (
	error: unknown,
	defaultMessage: string
) => error instanceof Error ? error : Error(defaultMessage);

/**
 * Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 * NOTE: A TypeError is thrown if path is not a string or if ext is given and is not a string. 
 * 
 * @param p The path to evaluate.
 * @param ext An optional file extension to remove from the result.
 * @returns The last portion of a path.
 */
export const basename = (
	p: string,
	ext?: string
): IOEither<Error, Path> => tryCatch(
	() => path.basename(p, ext),
	(reason: unknown) => toError(reason, "Unexpected error getting basename")
);

/**
 * Similar to the Unix dirname command.
 * Trailing directory separators are ignored.
 * NOTE: A TypeError is thrown if path is not a string. 
 * 
 * @param p The path to evaluate.
 * @returns The directory name of a path.
 */
export const dirname = (
	p: string
): IOEither<Error, Path> => tryCatch(
	() => path.dirname(p),
	(reason: unknown) => toError(reason, "Unexpected error getting dirname")
);

/**
 * Gets the extension of the path,
 * from the last occurrence of the . (period) character to end of string in the last portion of the path.
 * If there is no . in the last portion of the path,
 * or if there are no . characters other than the first character of the basename of path,
 * an empty string is returned.
 * NOTE: A TypeError is thrown if path is not a string.
 * 
 * @param p The path to evaluate.
 * @returns The extension of the path.
 */
export const extname = (
	p: string
): IOEither<Error, string> => tryCatch(
	() => path.extname(p),
	(reason: unknown) => toError(reason, "Unexpected error getting extname")
);

/**
 * This is the opposite of path.parse().
 * When providing properties to the pathObject remember that there are combinations where one property has priority over another:
 * pathObject.root is ignored if pathObject.dir is provided,
 * pathObject.ext and pathObject.name are ignored if pathObject.base exists.
 * 
 * @param po JavaScript object with the properties: dir, root, base, name, and ext.
 * @returns Path string from an object.
 */
export const format = (
	po: path.FormatInputPathObject
): IOEither<Error, Path> => tryCatch(
	() => path.format(po),
	(reason: unknown) => toError(reason, "Unexpected error formatting path object")
);

/**
 * Determines if path is an absolute path.
 * If the given path is a zero-length string, false will be returned.
 * @see https://nodejs.org/api/path.html#pathisabsolutepath
 * 
 * @param p Path to test.
 * @returns Boolean representing if the path is an absolute path.
 * @throws TypeError if path is not a string.
 */
export const isAbsolute = (
	p: string
): IOEither<Error, boolean> => tryCatch(
	() => path.isAbsolute(p),
	(reason: unknown) => toError(reason, "Unexpected error checking for absolute path")
);

/**
 * Join all arguments together using the platform-specific separator as a delimiter,
 * then normalize the resulting path.
 * Zero-length path segments are ignored.
 * If the joined path string is a zero-length string then '.' will be returned,
 * representing the current working directory.
 * @see https://nodejs.org/api/path.html#pathjoinpaths
 * 
 * @param paths A sequence of path segments.
 * @returns The joined path.
 * @throws TypeError if any of the path segments is not a string.
 */
export const join = (
	...paths: string[]
): IOEither<Error, Path> => tryCatch(
	() => path.join(...paths),
	(reason: unknown) => toError(reason, "Unexpected error joining path segments")
);

/**
 * Normalize a string path, reducing '..' and '.' parts.
 * When multiple, sequential path segment separation characters are found (e.g. / on POSIX and 
 * either \ or / on Windows), they are replaced by a single instance of the platform-specific path 
 * segment separator (/ on POSIX and \ on Windows).
 * Trailing separators are preserved.
 * If the path is a zero-length string, '.' is returned, representing the current working directory.
 * @see https://nodejs.org/api/path.html#pathnormalizepath
 * 
 * @param p String path to normalize.
 * @returns Normalized string path.
 * @throws TypeError if path is not a string.
 */
export const normalize = (
	p: string
): IOEither<Error, Path> => tryCatch(
	() => path.normalize(p),
	(reason: unknown) => toError(reason, "Unexpected error normalizing path")
);

/**
 * Parse a string path to an object (the opposite of path.format()).
 * Trailing directory separators are ignored.
 * @see https://nodejs.org/api/path.html#pathparsepath
 * 
 * @param p Path to evaluate.
 * @returns Object whose properties represent significant elements of the path.
 * @throws TypeError if path is not a string.
 */
export const parse = (
	p: string
): IOEither<Error, path.ParsedPath> => tryCatch(
	() => path.parse(p),
	(reason: unknown) => toError(reason, "Unexpected error parsing path")
);

/**
 * Solve the relative path from {from} to {to} based on the current working directory.
 * At times we have two absolute paths,
 * 	and we need to derive the relative path from one to the other. 
 * If from and to each resolve to the same path (after calling path.resolve() on each),
 * 	a zero-length string is returned.
 * If a zero-length string is passed as from or to,
 * 	the current working directory will be used instead of the zero-length strings.
 * This is actually the reverse transform of path.resolve.
 * @see https://nodejs.org/api/path.html#pathrelativefrom-to
 * 
 * @param from Source path.
 * @param to Destination path.
 * @returns The relative path from {from} to {to}.
 * @throws TypeError if either from or to is not a string.
 */
export const relative = (
	from: string,
	to: string
): IOEither<Error, Path> => tryCatch(
	() => path.relative(from, to),
	(reason: unknown) => toError(reason, "Unexpected error solving the relative path")
);

/**
 * Resolves a sequence of paths or path segments into an absolute path.
 * The given sequence of paths is processed from right to left,
 * 	with each subsequent path prepended until an absolute path is constructed.
 * If, after processing all given path segments, an absolute path has not yet been generated,
 * 	the current working directory is used.
 * The resulting path is normalized and trailing slashes are removed unless the path is resolved to
 * 	the root directory.
 * Zero-length path segments are ignored.
 * If no path segments are passed, path.resolve() will return the absolute path of the current
 * 	working directory.
 * @see https://nodejs.org/api/path.html#pathresolvepaths
 * 
 * @param paths A sequence of path or path segment strings to join.
 * @returns An absolute path.
 * @throws TypeError if any of the arguments is not a string.
 */
export const resolve = (
	...paths: string[]
): IOEither<Error, Path> => tryCatch(
	() => path.resolve(...paths),
	(reason: unknown) => toError(reason, "Unexpected error resolving path segments")
);
