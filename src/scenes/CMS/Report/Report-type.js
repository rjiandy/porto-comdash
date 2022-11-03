// @flow

import type {GroupMetadata} from '../UserGroup/UserGroup-type';
import type {Creator} from '../CMS-type';

export type ReportFileID = number;
export type ReportFolderID = number;

export type ReportFile = {
  id: ReportFileID;
  name: string;
  linkUrl: string;
  groups: Array<GroupMetadata>;
  parentId: ReportFolderID;
  creator: Creator;
  createdDate: string;
  lastEdited: string;
};

export type ReportFolder = {
  id: ReportFolderID;
  name: string;
  folders: Array<ReportFolder>;
  files: Array<ReportFile>;
  parentId: ReportFolderID;
  groups: Array<GroupMetadata>;
  creator: Creator;
  createdDate: string;
  lastEdited: string;
};

export type ReportCMSState = {
  reportFolders: Map<ReportFolderID, ReportFolder>;
  +activeFolder: ?ReportFolderID;
  error: ?Error;
  isLoading: boolean;
};

export type ReportCMSAction =
  | {
      type: 'ACTIVE_FOLDER_CHANGED';
      activeFolder: ReportFolderID;
    }
  | {
      type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_SUCCEED';
      reportFolder: ReportFolder;
    }
  | {
      type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED';
      folderID: ReportFolderID;
    }
  | {
      type: 'FETCH_REPORT_ROOT_FOLDER_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_REPORT_ROOT_FOLDER_SUCCEED';
      reportFolders: Map<ReportFolderID, ReportFolder>;
    }
  | {
      type: 'FETCH_REPORT_ROOT_FOLDER_REQUESTED';
    }
  | {
      type: 'ADD_REPORT_FOLDER_REQUESTED';
      reportFolder: ReportFolder;
    }
  | {
      type: 'ADD_REPORT_FOLDER_SUCCEED';
    }
  | {
      type: 'ADD_REPORT_FOLDER_FAILED';
      error: Error;
    }
  | {
      type: 'ADD_REPORT_FILE_REQUESTED';
      reportFile: ReportFile;
    }
  | {
      type: 'ADD_REPORT_FILES_SUCCEED';
    }
  | {
      type: 'ADD_REPORT_FILE_FAILED';
      error: Error;
    }
  | {
      type: 'EDIT_REPORT_FOLDER_SUCCEED';
    }
  | {
      type: 'EDIT_REPORT_FOLDER_FAILED';
      error: Error;
    }
  | {
      type: 'EDIT_REPORT_FOLDER_REQUESTED';
      reportFolder: ReportFolder;
      folderID: ReportFolderID;
    }
  | {
      type: 'EDIT_REPORT_FILE_SUCCEED';
    }
  | {
      type: 'EDIT_REPORT_FILE_FAILED';
      error: Error;
    }
  | {
      type: 'EDIT_REPORT_FILE_REQUESTED';
      reportFile: ReportFile;
      fileID: ReportFileID;
    }
  | {
      type: 'DELETE_REPORT_FOLDER_SUCCEED';
      folderIDList: Array<ReportFolderID>;
    }
  | {
      type: 'DELETE_REPORT_FOLDER_FAILED';
      error: Error;
    }
  | {
      type: 'DELETE_REPORT_FOLDER_REQUESTED';
      folderIDList: Array<ReportFolderID>;
      fileIDList: Array<ReportFileID>;
      activeFolderID: ?ReportFolderID;
    };
// | {
//     type: 'ADD_REPORT_FILE_REQUESTED';
//     reportFile: ReportFile;
//   }
// | {
//     type: 'ADD_REPORT_FILE_SUCCEED';
//   }
// | {
//     type: 'ADD_REPORT_FILE_FAILED';
//     error: Error;
//   }
// | {
//     type: 'ADD_REPORT_FOLDER_REQUESTED';
//     reportFolder: ReportFolder;
//   }
// | {
//     type: 'ADD_REPORT_FOLDER_SUCCEED';
//   }
// | {
//     type: 'ADD_REPORT_FOLDER_FAILED';
//     error: Error;
//   }
// | {
//     type: 'UPDATE_REPORT_FOLDER_REQUESTED';
//     reportFolder: ReportFolder;
//     id: ID;
//   }
// | {
//     type: 'UPDATE_REPORT_FOLDER_FAILED';
//     error: Error;
//   }
// | {
//     type: 'UPDATE_REPORT_FOLDER_SUCCEED';
//   }
// | {
//     type: 'UPDATE_REPORT_FILE_REQUESTED';
//     reportFile: ReportFile;
//     id: ID;
//   }
// | {
//     type: 'UPDATE_REPORT_FILE_FAILED';
//     error: Error;
//   }
// | {
//     type: 'UPDATE_REPORT_FILE_SUCCEED';
//   };
// | {
//     type: 'DELETE_REPORT_FOLDER_REQUESTED';
//     idList: Array<ID>;
//   }
// | {
//     type: 'DELETE_REPORT_FOLDER_FAILED';
//     error: Error;
//   }
// | {
//     type: 'DELETE_REPORT_SUCCEED';
//   };
