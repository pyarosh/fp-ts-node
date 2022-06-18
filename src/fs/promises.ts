import { BigIntStats, CopyOptions, Dir, Dirent, MakeDirectoryOptions, Mode, ObjectEncodingOptions, OpenDirOptions, OpenMode, PathLike, RmDirOptions, RmOptions, StatOptions, Stats, WatchOptions } from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import { FileHandle, FlagAndOpenMode } from 'node:fs/promises';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import EventEmitter, { Abortable } from 'node:events';
import { Stream } from 'node:stream';

const toError = (
	error: unknown,
	defaultMessage: string
) => error instanceof Error ? error : Error(defaultMessage);

const access = (
	path: PathLike,
	mode?: number
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.access(path, mode),
	(reason: unknown) => toError(reason, "Unexpected error while accessing path")
);

const appendFile = (
	path: PathLike | fsPromises.FileHandle,
	data: string | Uint8Array,
	options?: (ObjectEncodingOptions & FlagAndOpenMode) | BufferEncoding | null
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.appendFile(path, data, options),
	(reason: unknown) => toError(reason, "Unexpected error appending file")
);

const chmod = (
	path: PathLike,
	mode: Mode
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.chmod(path, mode),
	(reason: unknown) => toError(reason, "Unexpected error while performing chmod")
);

const chown = (
	path: PathLike,
	uid: number,
	gid: number
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.chown(path, uid, gid),
	(reason: unknown) => toError(reason, "Unexpected error while performing chown")
);

const copyFile = (
	src: PathLike,
	dest: PathLike,
	mode?: number
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.copyFile(src, dest, mode),
	(reason: unknown) => toError(reason, "Unexpected error copying file")
);

const cp = (
	src: string,
	dest: string,
	opts?: CopyOptions
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.cp(src, dest, opts),
	(reason: unknown) => toError(reason, "Unexpected error during cp")
);

const lchown = (
	path: PathLike,
	uid: number,
	gid: number
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.lchown(path, uid, gid),
	(reason: unknown) => toError(reason, "Unexpected error duriong lchown")
);

const lutimes = (
	path: PathLike,
	atime: string|number|Date,
	mtime: string|number|Date,
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.lutimes(path, atime, mtime),
	(reason: unknown) => toError(reason, "Unexpected error during lutimes")
);

const link = (
	existingPath: PathLike,
	newPath: PathLike
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.link(existingPath, newPath),
	(reason: unknown) => toError(reason, "Unexpected error during link")
);

const lstat = (
	path: PathLike,
	options?: StatOptions & { bigint?: false }
): TaskEither<Error, Stats> => tryCatch(
	() => fsPromises.lstat(path, options),
	(reason: unknown) => toError(reason, "")
);

const mkdir = (
	path: PathLike,
	options?: Mode | (MakeDirectoryOptions & { recursive?: false })
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.mkdir(path, options),
	(reason: unknown) => toError(reason, "")
);

const mkdtemp = (
	prefix: string,
	options?: ObjectEncodingOptions | BufferEncoding
): TaskEither<Error, string> => tryCatch(
	() => fsPromises.mkdtemp(prefix, options),
	(reason: unknown) => toError(reason, "")
);

const open = (
	path: PathLike,
	flags?: string | number,
	mode?: Mode
): TaskEither<Error, FileHandle> => tryCatch(
	() => fsPromises.open(path, flags, mode),
	(reason: unknown) => toError(reason, "")
);

const opendir = (
	path: PathLike,
	options?: OpenDirOptions
): TaskEither<Error, Dir> => tryCatch(
	() => fsPromises.opendir(path, options),
	(reason: unknown) => toError(reason, "")
);

const readdir = (
	path: PathLike,
	options?: BufferEncoding | (ObjectEncodingOptions & { withFileTypes?: false })
): TaskEither<Error, string[]|Buffer[]|Dirent[]> => tryCatch(
	() => fsPromises.readdir(path, options),
	(reason: unknown) => toError(reason, "")
);

const readFile = (
	path: PathLike|FileHandle,
	options?: ({ encoding?: null, flag?: OpenMode } & EventEmitter.Abortable)
): TaskEither<Error, Buffer|string> => tryCatch(
	() => fsPromises.readFile(path, options),
	(reason: unknown) => toError(reason, "")
);

const readLink = (
	path: PathLike,
	options?: ObjectEncodingOptions | BufferEncoding
): TaskEither<Error, string> => tryCatch(
	() => fsPromises.readlink(path, options),
	(reason: unknown) => toError(reason, "")
);

const realpath = (
	path: PathLike,
	options?: ObjectEncodingOptions | BufferEncoding
): TaskEither<Error, string|Buffer> => tryCatch(
	() => fsPromises.realpath(path, options),
	(reason: unknown) => toError(reason, "")
);

const rename = (
	oldPath: PathLike,
	newPath: PathLike
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.rename(oldPath, newPath),
	(reason: unknown) => toError(reason, "")
);

const rmdir = (
	path: PathLike,
	options?: RmDirOptions
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.rmdir(path, options),
	(reason: unknown) => toError(reason, "")
);

const rm = (
	path: PathLike,
	options?: RmOptions
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.rm(path, options),
	(reason: unknown) => toError(reason, "")
);

const stat = (
	path: PathLike,
	options?: (StatOptions & { bigint?: false })
): TaskEither<Error, Stats|BigIntStats> => tryCatch(
	() => fsPromises.stat(path, options),
	(reason: unknown) => toError(reason, "")
);

const symlink = (
	target: PathLike,
	path: PathLike,
	type?: 'dir'|'file'|'junction'
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.symlink(target, path, type),
	(reason: unknown) => toError(reason, "")
);

const truncate = (
	path: PathLike,
	length?: number
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.truncate(path, length),
	(reason: unknown) => toError(reason, "")
);

const unlink = (
	path: PathLike
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.unlink(path),
	(reason: unknown) => toError(reason, "")
);

const utimes = (
	path: PathLike,
	atime: string|number|Date,
	mtime: string| number|Date
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

const writeFile = (
	file: PathLike | FileHandle,
	data: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream,
	options?: BufferEncoding | (ObjectEncodingOptions & { mode?: Mode, flag?: OpenMode } & Abortable)
): TaskEither<Error, void> => tryCatch(
	() => fsPromises.writeFile(file, data, options),
	(reason: unknown) => toError(reason, "")
);
