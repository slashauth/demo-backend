import { controllers } from '.';
import { CONSTANTS } from '../utils/constants';
import {
  CRUDFileResponse,
  GetPresignedURLForFileResponse,
  ListFilesResponse,
} from '@slashauth/types';
import { slashauthClient } from '../third-party/slashauth_client';

type CreateFileInput = {
  name: string;
  rolesRequired: string[];
  description?: string;
  file: Express.Multer.File;
};

type UpdateFileInput = {
  name?: string;
  rolesRequired?: string[];
  description?: string;
};

export class FileController {
  getPresignedURLForFile = async (
    clientID: string,
    fileID: string
  ): Promise<GetPresignedURLForFileResponse> => {
    try {
      const fileURL = await slashauthClient.file.getPresignedURL({
        id: fileID,
      });

      if (!fileURL.result || !fileURL.result.data) {
        throw new Error(
          `getPresignedURL did not return a result for clientID ${clientID} and fileID ${fileID}`
        );
      }

      return fileURL.result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  listFiles = async (
    clientID: string,
    cursor?: string
  ): Promise<ListFilesResponse> => {
    try {
      const filesResp = await slashauthClient.file.listFiles({ cursor });

      if (!filesResp.result || !filesResp.result.data) {
        throw new Error(
          `listFiles did not return a result for clientID ${clientID}`
        );
      }

      return filesResp.result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // admin-gated
  createFile = async (
    clientID: string,
    userID: string,
    input: CreateFileInput
  ): Promise<CRUDFileResponse> => {
    try {
      const resp = await slashauthClient.file.addFile({
        file: input.file.buffer,
        mimeType: input.file.mimetype,
        userID,
        name: input.name,
        rolesRequired: input.rolesRequired,
        description: input.description,
      });

      if (!resp.result || !resp.result.data) {
        throw new Error(
          `createFile did not return a result for clientID ${clientID} and userID ${userID}`
        );
      }

      return resp.result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  updateFile = async (
    clientID: string,
    fileID: string,
    input: UpdateFileInput
  ): Promise<CRUDFileResponse> => {
    try {
      const resp = await slashauthClient.file.updateFile({
        id: fileID,
        name: input.name,
        description: input.description,
        rolesRequired: input.rolesRequired,
      });

      if (!resp.result || !resp.result.data) {
        throw new Error(
          `updateFile did not return a result for clientID ${clientID}`
        );
      }

      return resp.result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  deleteFile = async (
    clientID: string,
    fileID: string
  ): Promise<CRUDFileResponse> => {
    try {
      const resp = await slashauthClient.file.deleteFile({
        id: fileID,
      });

      if (!resp.result || !resp.result.data) {
        throw new Error(
          `deleteFile did not return a result for clientID ${clientID}`
        );
      }

      return resp.result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
