
export interface IFileFromApi {
  id? : string;
  name? : string;
  root? : boolean;
  description? : string;
  encrypted? : boolean;
  size? : number;
  folder? : boolean;
  createdAt? : Date;
  updatedAt? : Date;
  storage? : string;
  parents? : string[];
  mimeType? : string;
}

export interface IFilesList<T> {
  files : T[];
}

export const isFileList = (fileList : IFileFromApi | IFilesList<IFileFromApi>) : fileList is IFilesList<IFileFromApi> =>
  !!(<IFilesList<IFileFromApi>>fileList).files;

export class StorageFile {

  name : string;
  description : string;
  parents : string[];
  encrypted : boolean;
  locked : boolean = false;
  readonly id : string;
  readonly size : number;
  readonly root : boolean;
  readonly folder : boolean;
  readonly createdAt : Date;
  readonly updatedAt : Date;
  readonly storage : string;
  readonly mimeType : string;

  constructor(fileFromApi : IFileFromApi = {}) {
    this.id = fileFromApi.id;
    this.name = fileFromApi.name;
    this.description = fileFromApi.description;
    this.size = Number(fileFromApi.size);
    this.folder = Boolean(fileFromApi.folder);
    this.createdAt = new Date(fileFromApi.createdAt);
    this.updatedAt = new Date(fileFromApi.updatedAt);
    this.storage = fileFromApi.storage;
    this.parents = fileFromApi.parents;
    this.mimeType = fileFromApi.mimeType;
    this.encrypted = Boolean(fileFromApi.encrypted);
    this.root = Boolean(fileFromApi.root);
  }

  removeFromFolder(id : string) {
    this.parents = this.parents.filter(folder => folder === id);
  }

  addToFolder(id : string) {
    this.parents.push(id);
    this.parents = this.parents.filter((folder, i, arr) => arr.indexOf(folder) === i);
  }

  moveFile(from : string, to : string) {
    this.removeFromFolder(from);
    this.addToFolder(to);
  }

}

export interface IStorageService {
  ROOT_FOLDER : string;
  getAccess() : Promise<void>;
  getFile(id : string) : Promise<IFilesList<StorageFile> | StorageFile>;
  getFileInfo(id : string) : Promise<StorageFile>;
  downloadFile(id : string) : Promise<Blob>;
  removeFile(id : string) : Promise<void>;
  listFolder(folderId? : string) : Promise<StorageFile[]>;
  createFile(fileData : StorageFile) : Promise<StorageFile>;
  updateFile(file : StorageFile) : Promise<StorageFile>;
  saveFile(file : StorageFile) : Promise<StorageFile>;
}
