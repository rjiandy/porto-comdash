// @flow

import type {
  User,
  UserMetadata,
  UserCMSAction,
  UserCMSState,
} from './Users/User-type';

import type {
  Group,
  GroupMetadata,
  GroupCMSAction,
  GroupCMSState,
} from './UserGroup/UserGroup-type';

import type {
  NewsFlash,
  NewsFlashCMSState,
  NewsFlashCMSAction,
} from './NewsFlash/NewsFlash-type';

import type {
  Widget,
  WidgetCMSState,
  WidgetCMSAction,
} from './Widget/Widget-type';

import type {
  HelpLink,
  HelpLinkCMSState,
  HelpLinkCMSAction,
} from './HelpLink/HelpLink-type';

import type {
  ReportFile,
  ReportFolder,
  ReportCMSState,
  ReportCMSAction,
} from './Report/Report-type';

export type {UserMetadata, Group, GroupMetadata, GroupCMSState};

export type TERRITORY_LEVEL = 'National' | 'Zone' | 'Region' | 'Area';
export type ROLE = 'SUPER_USER' | 'POWER_USER' | 'USER';

export type NewsFlashMetadata = {
  id: number;
  title: string;
};

export type Creator = {
  userLogin: string;
  name: string;
  role: ROLE;
  groups: Array<GroupMetadata>;
};

export type CMSState = {
  userCMS: UserCMSState;
  groupCMS: GroupCMSState;
  newsFlashCMS: NewsFlashCMSState;
  reportCMS: ReportCMSState;
  helpLinkCMS: HelpLinkCMSState;
  widgetCMS: WidgetCMSState;
};

export type {User, UserCMSState}; // Re-export all type for easier usage
export type {NewsFlash};
export type {Widget, WidgetCMSState};
export type {HelpLink, HelpLinkCMSAction, HelpLinkCMSState};
export type {ReportFile, ReportFolder, ReportCMSState};

export type CMSAction =
  | UserCMSAction
  | GroupCMSAction
  | NewsFlashCMSAction
  | WidgetCMSAction
  | HelpLinkCMSAction
  | ReportCMSAction;
