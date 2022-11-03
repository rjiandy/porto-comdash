// @flow
import type {NewsFlash} from '../../scenes/CMS/NewsFlash/NewsFlash-type';
import type {
  ReportFolder,
  ReportFile,
  ReportFolderID,
  ReportFileID,
} from '../../scenes/CMS/Report/Report-type';
import type {HelpLink} from '../../scenes/CMS/HelpLink/HelpLink-type.js';

type TERRITORY_LEVEL = 'National' | 'Zone' | 'Region' | 'Area';
export type ROLE = 'SUPER_USER' | 'POWER_USER' | 'USER';
export type POSITION = 'Territory' | 'Brand' | 'Channel';

export type MyBrandFamily = {
  id: number;
  brandFamily: string;
};

export type MyWidget = {
  id: number;
  widgetName: string;
};

export type MyGroup = {
  id: number;
  groupName: string;
  createdBy: ROLE;
};

export type TerritoryAccess = {
  id: number;
  territoryLevel: TERRITORY_LEVEL;
  territory: string;
  territoryParentId: number; // NOTE: from sampoerna for deciding parents based on access
};

export type User = {
  userLogin: string;
  name: string;
  territories: Array<TerritoryAccess>;
  role: ROLE;
  position: POSITION;
  userTerritoryLevel: TERRITORY_LEVEL;
  brandFamily: Array<MyBrandFamily>;
  groups: Array<MyGroup>;
  widgets: Array<MyWidget>; // NOTE: fire to api/me/widgets
  newsFlashes: Array<NewsFlash>;
  reports: {
    // TODO: add SEARCHABLE FILE AND FAVORITES
    reportFolders: Map<ReportFolderID, ReportFolder>;
    reportFiles: Map<ReportFileID, ReportFile>;
    searchableFiles: Array<ReportFile>;
    activeFolder: ?ReportFolderID;
    isLoading: boolean;
  };
  helplinks: Array<HelpLink>;
};

export type UserState = {
  user: ?User;
  isLoading: boolean;
  // NOTE: add something later if needed
};

export type UserAccessAction =
  | {
      type: 'AUTHORIZATION_SUCCEED';
      userData: User;
    }
  | {
      type: 'AUTHORIZATION_FAILED';
      error: Error;
    }
  | {
      type: 'AUTHORIZATION_REQUESTED';
    }
  | {
      type: 'FETCH_MY_DATA_REQUESTED';
    }
  | {
      type: 'FETCH_MY_WIDGETS_REQUESTED';
    }
  | {
      type: 'FETCH_MY_NEWS_FLASHES_REQUESTED';
    }
  | {
      type: 'FETCH_MY_UNREAD_NEWS_FLASHES_REQUESTED';
    }
  | {
      type: 'FETCH_MY_REPORTS_REQUESTED';
    }
  | {
      type: 'FETCH_MY_REPORTS_FOLDER_BY_ID_REQUESTED';
      folderID: ReportFolderID;
    }
  | {
      type: 'FETCH_MY_DATA_SUCCEED';
      userData: User;
    }
  | {
      type: 'FETCH_MY_WIDGETS_SUCCEED';
      widgets: Array<MyWidget>;
    }
  | {
      type: 'FETCH_MY_NEWS_FLASHES_SUCCEED';
      newsFlashes: Array<NewsFlash>;
    }
  | {
      type: 'FETCH_MY_REPORTS_SUCCEED';
      reportFolders: Map<ReportFolderID, ReportFolder>;
      reportFiles: Map<ReportFolderID, ReportFile>;
      searchableFiles: Array<ReportFile>;
    }
  | {
      type: 'FETCH_MY_REPORTS_FOLDER_BY_ID_SUCCEED';
      reportFolder: ReportFolder;
    }
  | {
      type: 'FETCH_MY_NEWS_FLASHES_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_MY_WIDGETS_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_MY_DATA_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_MY_REPORTS_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_MY_REPORTS_FOLDER_BY_ID_FAILED';
      error: Error;
    }
  | {
      type: 'MY_REPORT_ACTIVE_FOLDER_CHANGED';
      activeFolder: ReportFolderID;
    };
