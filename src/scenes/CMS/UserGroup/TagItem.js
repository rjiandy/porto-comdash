// @flow

import React from 'react';

import {
  View,
  Tag,
  Text,
  Button,
} from '../../../general/components/coreUIComponents';
import formatSnakeCaseToCapitalize from '../../../general/helpers/formatSnakeCaseToCapitalize';
import {GREY} from '../../../general/constants/colors';

// import type {UserMetadata, NewsFlashMetadata} from '../CMS-type';

import {StyleSheet} from 'react-primitives';

type Metadata =
  | {type: 'MEMBERS'; userLogin: string; name: string}
  | {type: 'WIDGETS'; id: string; name: string}
  | {type: 'REPORTS'; id: string; name: string}
  | {type: 'HELP_LINKS'; id: string; name: string}
  | {type: 'NEWS_FLASHES'; id: string; title: string}; // TODO: add other Metadata
type DataTag =
  | 'MEMBERS'
  | 'WIDGETS'
  | 'REPORTS'
  | 'HELP_LINKS'
  | 'NEWS_FLASHES';

type CategorizedMetadata =
  | {
      // TODO: REMOVE duplication and use metadata
      type: 'MEMBERS';
      userLogin: string;
      name: string;
    }
  | {
      type: 'WIDGETS';
      id: string;
      name: string;
    }
  | {
      type: 'REPORTS';
      id: string;
      name: string;
    }
  | {
      type: 'HELP_LINKS';
      id: string;
      name: string;
    }
  | {
      type: 'NEWS_FLASHES';
      id: string;
      title: string;
    };

type TagItemProps = {
  onAddPress: () => void;
  onTagDeletePress: (key: string | number) => void;
  disabled?: boolean;
  items: {
    type: DataTag;
    data: Array<Metadata>;
  };
};

type TagLabel = {
  id: string;
  label: string;
};

function formatDataToTagLabel(params: CategorizedMetadata): ?TagLabel {
  switch (params.type) {
    case 'MEMBERS': {
      return {
        id: params.userLogin,
        label: params.name,
      };
    }
    case 'WIDGETS': {
      return {
        id: params.id,
        label: params.name,
      };
    }
    case 'REPORTS': {
      return {
        id: params.id,
        label: params.name,
      };
    }
    case 'HELP_LINKS': {
      return {
        id: params.id,
        label: params.name,
      };
    }
    case 'NEWS_FLASHES': {
      return {
        id: params.id,
        label: params.title,
      };
    }
    default:
      return null;
  }
}
function formatTypeToIcon(type: DataTag) {
  switch (type) {
    case 'MEMBERS':
      return 'user';
    case 'REPORTS':
      return 'file';
    case 'HELP_LINKS':
      return 'link';
    case 'NEWS_FLASHES':
      return 'newsflash';
    case 'WIDGETS':
      return 'widget';
    default:
      return 'user';
  }
}

export default function TagItems(props: TagItemProps) {
  let {items, onAddPress, onTagDeletePress, disabled} = props;
  let {type, data} = items;
  let title =
    formatSnakeCaseToCapitalize(type) !== 'Members'
      ? 'Assigned ' + formatSnakeCaseToCapitalize(type)
      : formatSnakeCaseToCapitalize(type);
  let icon = formatTypeToIcon(type);
  return (
    <View>
      <Text>{title}</Text>
      <View style={styles.tagContainer}>
        {data.length > 0 ? (
          data.map((item, index) => {
            let formatted = formatDataToTagLabel(item);
            if (formatted) {
              return (
                <View key={formatted.id || index} style={styles.tagItemWrapper}>
                  <Tag
                    label={formatted.label}
                    icon={icon}
                    iconStyle={{color: GREY}}
                    onRequestDelete={() => {
                      if (!disabled) {
                        onTagDeletePress &&
                          onTagDeletePress((formatted && formatted.id) || '');
                      }
                    }}
                    disabled={disabled}
                  />
                </View>
              );
            } else {
              return null;
            }
          })
        ) : disabled ? (
          <View style={styles.tagItemWrapper}>
            <Tag label={'No ' + title} disabled />
          </View>
        ) : null}
        {!disabled ? (
          <Button
            secondary
            label={'Assign ' + formatSnakeCaseToCapitalize(type)}
            onPress={onAddPress}
            icon="add"
            iconStyle={StyleSheet.flatten(styles.iconButton)}
            style={StyleSheet.flatten(styles.button)}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tagItemWrapper: {
    marginRight: 10,
    marginBottom: 8,
  },
  button: {
    height: 42,
  },
  iconButton: {
    fontSize: 18,
    paddingBottom: 2,
  },
});
