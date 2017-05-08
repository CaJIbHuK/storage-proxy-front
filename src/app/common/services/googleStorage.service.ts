import {Injectable, Inject} from "@angular/core";
import {HttpClient} from "./api.service";
import {IStorageService, IFileFromApi, IFilesList, isFileList, StorageFile} from "app/common/models/index";


@Injectable()
export class GoogleStorageService implements IStorageService {

  ROOT_FOLDER = 'root';

  constructor(@Inject(HttpClient) private http : HttpClient) {}

  getAccess() : Promise<void> {
    return this.http.get<{ link }>('storages/google/access')
      .then(({link}) => open(link, "google", "height=800,width=800,modal=yes,resizable,scrollbars=yes,status=1"))
      .then(openedWindow => {
        setTimeout(() => {
          if (openedWindow.closed) location.reload(true);
        }, 300)
      });
  }

  getFile(id : string) : Promise<IFilesList<StorageFile>|StorageFile> {
    return this.http.get<IFileFromApi|IFilesList<IFileFromApi>>(`storages/google/files/${id}`);
  }

  getFileInfo(id : string = 'root') : Promise<StorageFile> {
    return this.http.get<IFileFromApi>(`storages/google/files/${id}/info`)
      .then(fileFromApi => new StorageFile(fileFromApi));
  }

  listFolder(folderId? : string) : Promise<StorageFile[]> {
    let id = folderId || "";
    return this.getFile(id)
      .then(result => {
        if (isFileList(result)) return result.files.map(file => new StorageFile(file));
        throw new Error('Is not a folder');
      });
  }

  createFile(fileData : StorageFile) : Promise<StorageFile> {
    return this.http.post<IFileFromApi>(`storages/google/files`, fileData)
      .then(fileFromApi => new StorageFile(fileFromApi));
  }

  updateFile(file : StorageFile) : Promise<StorageFile> {
    if (!file.id) throw new Error("File does not exist");
    return this.http.put<IFileFromApi>(`storages/google/files/${file.id}`, file)
      .then(fileFromApi => new StorageFile(fileFromApi));
  }

  saveFile(file : StorageFile) : Promise<StorageFile> {
    if (file.id) return this.updateFile(file);
    return this.createFile(file);
  }

  downloadFile(id : string) {
    return this.http.getBlob<Response>(`storages/google/files/${id}/download`)
      .then(response => {
        return new Blob([response.blob()]);
      });
  }

  removeFile(id : string) {
    return this.http.delete(`storages/google/files/${id}`);
  }

}