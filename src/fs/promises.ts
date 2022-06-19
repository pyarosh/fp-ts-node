import {
	BigIntStats,
	CopyOptions,
	Dir,
	Dirent,
	MakeDirectoryOptions,
	Mode,
	ObjectEncodingOptions,
	OpenDirOptions,
	OpenMode,
	PathLike,
	RmDirOptions,
	RmOptions,
	StatOptions,
	Stats
} from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import {
	FileHandle,
	FlagAndOpenMode
} from 'node:fs/promises';
import EventEmitter, {
	Abortable
} from 'node:events';
import {
	Stream
} from 'node:stream';
import {
	TaskEither,
	tryCatch
} from 'fp-ts/lib/TaskEither';

const toError = (
	error: unknown,
	defaultMessage: string
) => error instanceof Error ? error : Error(defaultMessage);

/**
 * Tests a user's permissions for the file or directory specified by `path`.
 * The `mode` argumnet should be either the value `fs.constants.F_OK` or a mask consisting of the
 * bitwise OR of any of `fs.constants.R_OK`,`fs.constants.W_OK`, and `fs.constants.X_OK`
 * (e.g.`fs.constants.W_OK | fs.constants.R_OK`).
 * Check `File access constants` for possible values of `mode`.
 * @see https://nodejs.org/api/fs.html#fspromisesaccesspath-mode
 * 
 * @param path File or directory path to test permissions.
 * @param mode Integer that specifies the accessibility checks to be performed.
 * @returns TaskEither that yields the path, or fails yielding an Error
 */
export const access = <T extends PathLike>(
	path: T,
	mode?: number
): TaskEither<Error, T> => tryCatch(
	() => fsPromises.access(path, mode).then(() => path),
	(reason: unknown) => toError(reason, "Unexpected error while accessing path")
);

/**
 * Asynchronously append data to a file, creating the file if it does not yet exist.
 * `data` can be a string or a `Buffer`. If `options` is a string, then it specifies the `encoding`.
 * The `mode` option only affects the newly created file. See `fs.open()` for more details.
 * The `path` may be specified as a `FileHandle` that has been opened for appending (using `fsPromises.open()`).
 * @see https://nodejs.org/api/fs.html#fspromisesappendfilepath-data-options
 * 
 * @param path File to append to
 * @param data Data to append to the file
 * @param options Append options
 * @returns TaskEither that yields the path, or fails yielding an Error
 */
export const appendFile = <T extends (PathLike | FileHandle)>(
	path: T,
	data: string | Buffer,
	options?: (ObjectEncodingOptions & FlagAndOpenMode) | BufferEncoding
): TaskEither<Error, T> => tryCatch(
	() => fsPromises.appendFile(path, data, options).then(() => path),
	(reason: unknown) => toError(reason, "Unexpected error appending file")
);

/**
 * Changes the permissions of a file.
 * See the POSIX [`chmod(2)`](https://man7.org/linux/man-pages/man2/chmod.2.html) documentation for more detail.
 * @see https://nodejs.org/api/fs.html#fspromiseschmodpath-mode
 * 
 * @param path File to change permissions of
 * @param mode Numerical bitmask [`File modes`](https://nodejs.org/api/fs.html#file-modes) 
 * @returns TaskEither that yields the path, or fails yielding an Error
 */
export const chmod = <T extends PathLike>(
	path: T,
	mode: Mode
): TaskEither<Error, T> => tryCatch(
	() => fsPromises.chmod(path, mode).then(() => path),
	(reason: unknown) => toError(reason, "Unexpected error while performing chmod")
);

/**
 * Changes the owner and group of a file.
 * See the POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2.html) documentation for more detail.
 * @see https://nodejs.org/api/fs.html#fspromiseschownpath-uid-gid
 * 
 * @param path File to change ownership of.
 * @param uid Integer that denotes the user id that corresponds to the owner to be set. 
 * @param gid Integer that denotes the group id that corresponds to the group to be set.
 * @returns TaskEither that yields the path, or fails yielding an Error
 */
export const chown = <T extends PathLike>(
	path: T,
	uid: number,
	gid: number
): TaskEither<Error, T> => tryCatch(
	() => fsPromises.chown(path, uid, gid).then(() => path),
	(reason: unknown) => toError(reason, "Unexpected error while performing chown")
);

/**
 * Asynchronously copies `src` to `dest`.
 * By default, `dest` is overwritten if italready exists.
 * 
 * No guarantees are made about the atomicity of the copy operation.
 * If an error occurs after the destination file has been opened for writing, an attempt will be
 * made to remove the destination.
 * @see https://nodejs.org/api/fs.html#fspromisescopyfilesrc-dest-mode
 * 
 * @param src Source file to copy.
 * @param dest Destination file of the copy operation.
 * @param mode Optional modifiers that specify the behavior of the copy operation.
 * @returns TaskEither that yields the destination path, or fails yielding an Error.
 */
export const copyFile = <T extends PathLike>(
	src: PathLike,
	dest: T,
	mode?: number
): TaskEither<Error, T> => tryCatch(
	() => fsPromises.copyFile(src, dest, mode).then(() => dest),
	(reason: unknown) => toError(reason, "Unexpected error during copyFile")
);

/**
 * Asynchronously copies the entire directory structure from `src` to `dest`, including 
 * subdirectories and files.
 * 
 * When copying a directory to another directory, globs are not supported and behavior is similar 
 * to `cp dir1/ dir2/`.
 * @see https://nodejs.org/api/fs.html#fspromisescpsrc-dest-options
 * @experimental
 * 
 * @param src Source path to copy.
 * @param dest Destination path to copy to.
 * @param opts Copy options that specify the behavior of this operation.
 * @returns TaskEither that yields the destination path, or fails yielding an Error.
 */
export const cp = (
	src: string,
	dest: string,
	opts?: CopyOptions
): TaskEither<Error, string> => tryCatch(
	() => fsPromises.cp(src, dest, opts).then(() => dest),
	(reason: unknown) => toError(reason, "Unexpected error during cp")
);

/**
 * Changes the owner and group on a symbolic link.
 * @see https://nodejs.org/api/fs.html#fspromiseslchownpath-uid-gid
 * 
 * @param path Symbolic link to change ownership of.
 * @param uid Integer that denotes the user id that corresponds to the owner to be set. 
 * @param gid Integer that denotes the group id that corresponds to the group to be set. 
 * @returns TaskEither that yields the path, or fails yielding an Error.
 */
export const lchown = <T extends PathLike>(
	path: T,
	uid: number,
	gid: number
): TaskEither<Error, T> => tryCatch(
	() => fsPromises.lchown(path, uid, gid).then(() => path),
	(reason: unknown) => toError(reason, "Unexpected error duriong lchown")
);

/**
 * Changes the access and modification times of a file in the same way as `fsPromises.utimes()`,
 * with the difference that if the path refers to a symbolic link, then the link is not 
 * dereferenced: instead, the timestamps of the symbolic link itself are changed.
 * @see https://nodejs.org/api/fs.html#fspromiseslutimespath-atime-mtime
 * 
 * @param path File or symbolic link to change access and modification times of.
 * @param atime Access time.
 * @param mtime Modification time.
 * @returns TaskEither that yields the path, or fails yielding an Error.
 */
export const lutimes = <T extends PathLike>(
	path: T,
	atime: string | number | Date,
	mtime: string | number | Date,
): TaskEither<Error, T> => tryCatch(
	() => fsPromises.lutimes(path, atime, mtime).then(() => path),
	(reason: unknown) => toError(reason, "Unexpected error during lutimes")
);

/**
 * Creates a new link from the `existingPath` to the `newPath`.
 * See the POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2.html) documentation for 
 * more detail.
 * @see https://nodejs.org/api/fs.html#fspromiseslinkexistingpath-newpath
 * 
 * @param existingPath Existing path to create a link from.
 * @param newPath Path to create the link to.
 * @returns TaskEither that yields the new path, or fails yielding an Error.
 */
export const link = <T extends PathLike>(
	existingPath: PathLike,
	newPath: T
): TaskEither<Error, T> => tryCatch(
	() => fsPromises.link(existingPath, newPath).then(() => newPath),
	(reason: unknown) => toError(reason, "Unexpected error during link")
);

export const lstat = (
	path: PathLike,
	options?: StatOptions & { bigint?: false }
): TaskEither<Error, Stats> => tryCatch(
	() => fsPromises.lstat(path, options),
	(reason: unknown) => toError(reason, "")
);

export const mkdir = (
	path: PathLike,
	options?: Mode | (MakeDirectoryOptions & { recursive?: false })
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.mkdir(path, options),
	(reason: unknown) => toError(reason, "")
);

export const mkdtemp = (
	prefix: string,
	options?: ObjectEncodingOptions | BufferEncoding
): TaskEither<Error, string> => tryCatch(
	() => fsPromises.mkdtemp(prefix, options),
	(reason: unknown) => toError(reason, "")
);

export const open = (
	path: PathLike,
	flags?: string | number,
	mode?: Mode
): TaskEither<Error, FileHandle> => tryCatch(
	() => fsPromises.open(path, flags, mode),
	(reason: unknown) => toError(reason, "")
);

export const opendir = (
	path: PathLike,
	options?: OpenDirOptions
): TaskEither<Error, Dir> => tryCatch(
	() => fsPromises.opendir(path, options),
	(reason: unknown) => toError(reason, "")
);

export const readdir = (
	path: PathLike,
	options?: BufferEncoding | (ObjectEncodingOptions & { withFileTypes?: false })
): TaskEither<Error, string[] | Buffer[] | Dirent[]> => tryCatch(
	() => fsPromises.readdir(path, options),
	(reason: unknown) => toError(reason, "")
);

export const readFile = (
	path: PathLike | FileHandle,
	options?: ({ encoding?: null, flag?: OpenMode } & EventEmitter.Abortable)
): TaskEither<Error, Buffer | string> => tryCatch(
	() => fsPromises.readFile(path, options),
	(reason: unknown) => toError(reason, "")
);

export const readLink = (
	path: PathLike,
	options?: ObjectEncodingOptions | BufferEncoding
): TaskEither<Error, string> => tryCatch(
	() => fsPromises.readlink(path, options),
	(reason: unknown) => toError(reason, "")
);

export const realpath = (
	path: PathLike,
	options?: ObjectEncodingOptions | BufferEncoding
): TaskEither<Error, string | Buffer> => tryCatch(
	() => fsPromises.realpath(path, options),
	(reason: unknown) => toError(reason, "")
);

export const rename = (
	oldPath: PathLike,
	newPath: PathLike
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.rename(oldPath, newPath),
	(reason: unknown) => toError(reason, "")
);

export const rmdir = (
	path: PathLike,
	options?: RmDirOptions
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.rmdir(path, options),
	(reason: unknown) => toError(reason, "")
);

export const rm = (
	path: PathLike,
	options?: RmOptions
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.rm(path, options),
	(reason: unknown) => toError(reason, "")
);

export const stat = (
	path: PathLike,
	options?: (StatOptions & { bigint?: false })
): TaskEither<Error, Stats | BigIntStats> => tryCatch(
	() => fsPromises.stat(path, options),
	(reason: unknown) => toError(reason, "")
);

export const symlink = (
	target: PathLike,
	path: PathLike,
	type?: 'dir' | 'file' | 'junction'
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.symlink(target, path, type),
	(reason: unknown) => toError(reason, "")
);

export const truncate = (
	path: PathLike,
	length?: number
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.truncate(path, length),
	(reason: unknown) => toError(reason, "")
);

export const unlink = (
	path: PathLike
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.unlink(path),
	(reason: unknown) => toError(reason, "")
);

export const utimes = (
	path: PathLike,
	atime: string | number | Date,
	mtime: string | number | Date
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.utimes(path, atime, mtime),
	(reason: unknown) => toError(reason, "")
);

/*
const watch = (
	filename: PathLike,
	options?: BufferEncoding | WatchOptions
) => tryCatch(
	() => fsPromises.watch(filename, options),
	(reason: unknown) => toError(reason, "")
)*/

export const writeFile = (
	file: PathLike | FileHandle,
	data: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream,
	options?: BufferEncoding | (ObjectEncodingOptions & { mode?: Mode, flag?: OpenMode } & Abortable)
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.writeFile(file, data, options),
	(reason: unknown) => toError(reason, "")
);
