// @flow

import type {GroupMetadata} from '../UserGroup/UserGroup-type';
import type {Creator} from '../CMS-type';

export type ID = number;

export type NewsFlash = {
  id: ID;
  title: string;
  startingTime: string;
  endingTime: string;
  status: boolean;
  groups: Array<GroupMetadata>;
  fileUrl: string;
  fileSize: number;
  fileName: string;
  imageUrl: ?string;
  creator: Creator;
  createdDate: string;
  lastEdited: string;
};
export type NewsFlashList = Map<number, NewsFlash>;

export type NewsFlashCMSState = {
  newsFlashes: NewsFlashList;
  error: ?Error;
  isLoading: boolean;
};

export type NewsFlashCMSAction =
  | {
      type: 'FETCH_NEWS_FLASH_LIST_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_NEWS_FLASH_LIST_SUCCEED';
      newsFlashes: Map<number, NewsFlash>;
    }
  | {
      type: 'FETCH_NEWS_FLASH_LIST_REQUESTED';
    }
  | {
      type: 'ADD_NEWS_FLASH_REQUESTED';
      newsFlash: NewsFlash;
    }
  | {
      type: 'ADD_NEWS_FLASH_FAILED';
      error: Error;
    }
  | {
      type: 'UPDATE_NEWS_FLASH_REQUESTED';
      newsFlash: NewsFlash;
      id: number;
    }
  | {
      type: 'UPDATE_NEWS_FLASH_FAILED';
      error: Error;
    }
  | {
      type: 'UPDATE_NEWS_FLASH_SUCCEED';
    }
  | {
      type: 'DELETE_NEWS_FLASH_REQUESTED';
      idList: Array<number>;
    }
  | {
      type: 'DELETE_NEWS_FLASH_FAILED';
      error: Error;
    }
  | {
      type: 'DELETE_NEWS_FLASH_SUCCEED';
    };
