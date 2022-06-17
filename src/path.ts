import { IOEither, tryCatch } from 'fp-ts/lib/IOEither';
import path from 'path';

type Path = string;

const toError = (
	error: unknown,
	defaultMessage: string
) => error instanceof Error ? error : Error(defaultMessage);

/**
 * Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 * 
 * @param p The path to evaluate
 * @param ext An optional file extension to remove from the result
 * @returns The last portion of a path
 */
export function basename(p: string, ext?: string): IOEither<Error, Path> {
	// NOTE: A TypeError is thrown if path is not a string or if ext is given and is not a string.
	return tryCatch(
		() => path.basename(p, ext),
		(reason: unknown) => (reason instanceof Error ? reason : Error("Unexpected error getting basename"))
	);
}

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
