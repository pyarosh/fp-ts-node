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
