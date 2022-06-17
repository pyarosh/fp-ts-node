import { IOEither, tryCatch } from 'fp-ts/lib/IOEither';
import path from 'path';

type Path = string;

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
