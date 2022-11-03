// @flow

import React, {Component} from 'react';
import {StyleSheet, Touchable} from 'react-primitives';
import Dropzone from 'react-dropzone';
import {
  View,
  Text,
  Icon,
  LoadingIndicator,
  Image,
} from '../../../../general/components/coreUIComponents';
import {TEXT_COLOR, THEME_COLOR} from '../../../../general/constants/colors';
import {SMALL_FONT_SIZE} from '../../../../general/constants/text';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';
import getPdfImage from '../../../../general/helpers/getPdfImage';

import {authorization} from '../../CMSSaga';

import type {ID, NewsFlash} from '../NewsFlash-type';

const DROPZONE_WIDTH = 400;
const DROPZONE_HEIGHT = 250;
const THUMBNAIL_WIDTH = 200;
const THUMBNAIL_HEIGHT = 200;

type DroppedFile = File & {preview: string; size: number};

type Props = {
  id: ?ID;
  news: ?NewsFlash;
  values: NewsFlash;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  handleBlur: () => void;
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
};

type State = {
  pdf: ?DroppedFile;
  newsThumbnail: ?DroppedFile;
  errorMessage: ?string;
  isEditMode: boolean;
};

type FormField = 'fileUrl' | 'fileSize' | 'fileName' | 'imageUrl';

export default class UploadPDF extends Component {
  props: Props;
  state: State;
  constructor() {
    super(...arguments);

    this.state = {
      pdf: null,
      newsThumbnail: null,
      errorMessage: '',
      isEditMode: this.props.id != null,
    };
  }
  render() {
    let {
      news,
      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
    } = this.props;
    let {pdf, newsThumbnail, errorMessage, isEditMode} = this.state;

    let content;

    if (isEditMode && news) {
      content = (
        <DetailFile
          news={news}
          onFileRemoved={(type: 'pdf' | 'newsThumbnail') => {
            let field = this._getFormField(type);
            if (field) {
              setFieldValue(`${field}Url`, '');
              this.setState({[type]: null, isEditMode: false});
            }
          }}
        />
      );
    } else if (pdf) {
      content = (
        <UploadedFile
          values={{
            pdfUrl: values.fileUrl,
            newsThumbnailUrl: values.imageUrl,
          }}
          files={{
            pdf,
            newsThumbnail,
          }}
          onFieldChanged={(field: FormField, value: mixed) => {
            setFieldValue(field, value);
            setFieldTouched(field, true);
          }}
          onFileRemoved={(type: 'pdf' | 'newsThumbnail') => {
            let field = this._getFormField(type);
            if (field) {
              setFieldValue(`${field}Url`, '');
              this.setState({[type]: null});
            }
          }}
          onThumbnailChanged={(image: DroppedFile) => {
            this.setState({newsThumbnail: image});
          }}
          onError={(error: Error) => {
            this.setState({errorMessage: error.message});
          }}
        />
      );
    } else {
      content = (
        <Dropzone
          accept="application/pdf"
          multiple={false}
          style={StyleSheet.flatten(styles.dropzoneContainer)}
          onDropAccepted={([pdf]) => this.setState({pdf, isEditMode: false})}
        >
          <NoItem />
        </Dropzone>
      );
    }

    return (
      <View>
        <Text
          style={
            (styles.floatingLabel,
            (errors.fileUrl && touched.fileUrl) || errorMessage
              ? {color: 'red'}
              : {})
          }
        >
          UPLOAD PDF
        </Text>
        {content}
        <View>
          <Text style={styles.errorText}>
            {(errors.fileUrl && touched.fileUrl) || errorMessage
              ? errors.fileUrl || errorMessage
              : ''}
          </Text>
        </View>
      </View>
    );
  }

  _getFormField(type: 'pdf' | 'newsThumbnail') {
    let field;
    if (type === 'pdf') {
      field = 'file';
    } else if (type === 'newsThumbnail') {
      field = 'image';
    }
    return field;
  }
}

function NoItem() {
  return (
    <View style={styles.thumbnailContainer}>
      <Icon name="pdf" style={StyleSheet.flatten(styles.thumbnail)} />
      <View style={{paddingTop: 20}}>
        <Text>Click or Drop file to upload PDF</Text>
      </View>
    </View>
  );
}

type UploadedFileProps = {
  files: {
    pdf: ?DroppedFile;
    newsThumbnail: ?DroppedFile;
  };
  values: {pdfUrl: ?string; newsThumbnailUrl: ?string};
  onFieldChanged: (field: FormField, value: mixed) => void;
  onFileRemoved: (field: 'pdf' | 'newsThumbnail') => void;
  onError: (error: Error) => void;
  onThumbnailChanged: (newsThumbnail: DroppedFile) => void;
};

type UploadFileState = {
  isImageReady: boolean;
  isImageUploading: boolean;
  isPdfUploading: boolean;
  imageComponent: ?HTMLElement;
};

class UploadedFile extends Component {
  props: UploadedFileProps;
  state: UploadFileState = {
    isImageReady: false,
    isImageUploading: false,
    isPdfUploading: false,
    imageComponent: null,
  };

  componentWillMount() {
    let {files: {pdf}, onFieldChanged} = this.props;
    if (pdf) {
      this.setState({isPdfUploading: true});

      onFieldChanged('fileSize', pdf.size);
      onFieldChanged('fileName', pdf.name);

      this._uploadFile(
        'pdf',
        pdf,
        (res) => this._onUploadSuccess(res, 'isPdfUploading', 'fileUrl'),
        (error) => this._onUploadFailed(error, 'isPdfUploading'),
      );

      this._loadPdfImage(pdf);
    }
  }

  render() {
    let {files: {pdf}, onFileRemoved, onThumbnailChanged} = this.props;
    let {
      isImageReady,
      isImageUploading,
      isPdfUploading,
      imageComponent,
    } = this.state;
    return (
      <View>
        <View style={[styles.dropzoneContainer, {cursor: 'default'}]}>
          <View style={styles.thumbnailContainer}>
            {!isPdfUploading &&
            !isImageUploading &&
            isImageReady &&
            imageComponent ? (
              <Dropzone
                accept=".jpeg,.png,.jpg"
                multiple={false}
                style={StyleSheet.flatten(styles.dropzoneContainer)}
                onDropAccepted={([newsThumbnail]) => {
                  this.setState({isImageUploading: true});

                  this._uploadFile(
                    'image',
                    newsThumbnail,
                    (res) =>
                      this._onUploadSuccess(
                        res,
                        'isImageUploading',
                        'imageUrl',
                      ),
                    (error) => this._onUploadFailed(error, 'isImageUploading'),
                  );

                  onThumbnailChanged(newsThumbnail);

                  // hacky way to make RawElement can process updated image
                  let img = document.createElement('img');
                  img.src = newsThumbnail.preview;
                  img.width = THUMBNAIL_WIDTH;
                  img.height = THUMBNAIL_HEIGHT;
                  this.setState({
                    imageComponent: img,
                  });
                }}
              >
                <View style={styles.thumbnailContainer}>
                  <RawElement
                    style={styles.thumbnail}
                    element={imageComponent}
                  />
                  <Text style={{textAlign: 'center'}}>
                    Click or Drop file to change News Thumbnail
                  </Text>
                </View>
              </Dropzone>
            ) : (
              <LoadingIndicator size={30} />
            )}
          </View>
          <View style={styles.removeButton}>
            <Icon
              name="close"
              onPress={() => {
                onFileRemoved('pdf');
                onFileRemoved('newsThumbnail');
              }}
            />
          </View>
        </View>
        {pdf ? (
          <Touchable
            onPress={() => {
              // TODO: open link
            }}
          >
            <View style={styles.fileDetailContainer}>
              <View style={styles.fileDetailIconContainer}>
                <Icon name="file" />
              </View>
              <Text style={styles.fileName}>{pdf.name}</Text>
              <Text style={{color: THEME_COLOR}}>
                {(pdf.size / 1000000).toFixed(3)} MB
              </Text>
            </View>
          </Touchable>
        ) : null}
      </View>
    );
  }

  async _loadPdfImage(pdf: DroppedFile) {
    let {image, imageBlob} = await getPdfImage(pdf);

    this._uploadFile(
      'image',
      imageBlob,
      (res) => this._onUploadSuccess(res, 'isImageUploading', 'imageUrl'),
      (error) => this._onUploadFailed(error, 'isImageUploading'),
    );

    this.setState({
      imageComponent: image,
      isImageReady: true,
      isImageUploading: true,
    });
  }

  _onUploadSuccess(
    res: Object,
    loadingStateKey: 'isImageUploading' | 'isPdfUploading',
    formField: FormField,
  ) {
    let {onFieldChanged} = this.props;
    this.setState({[loadingStateKey]: false});
    if (res.success) {
      onFieldChanged(formField, res.fileUrl);
    }
  }

  _onUploadFailed(
    error: Error,
    loadingStateKey: 'isImageUploading' | 'isPdfUploading',
  ) {
    let {onError} = this.props;
    this.setState({[loadingStateKey]: false});
    onError(error);
  }

  _uploadFile(
    type: 'pdf' | 'image',
    file: DroppedFile | Blob,
    onUploadSuccess?: (res: Object) => void,
    onUploadFailed?: (error: Error) => void,
  ) {
    let data = new FormData();
    data.append(type === 'pdf' ? 'File' : 'Image', file);
    fetchJSON('/Upload', {
      headers: {...authorization.headers}, // TODO: remove this after production
      method: 'POST',
      body: data,
    })
      .then((res) => {
        onUploadSuccess && !Array.isArray(res) && onUploadSuccess(res);
      })
      .catch((error) => {
        onUploadFailed && onUploadFailed(error);
      });
  }
}

type RawElementProps = {element: HTMLElement};

class RawElement extends Component {
  props: RawElementProps;
  _view: ?HTMLElement;

  componentDidMount() {
    let {element} = this.props;
    let resizedElement = this._setComponentSize(element);
    this._view && this._view.appendChild(resizedElement);
  }

  componentWillReceiveProps(newProps: RawElementProps) {
    let oldProps = this.props;
    if (newProps.element !== oldProps.element) {
      let resizedElement = this._setComponentSize(newProps.element);

      this._view && this._view.removeChild(oldProps.element);
      this._view && this._view.appendChild(resizedElement);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    let {element, ...otherProps} = this.props;
    let divStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
    return (
      <View {...otherProps}>
        <div style={divStyle} ref={(ref) => (this._view = ref)} />
      </View>
    );
  }

  _setComponentSize(element: HTMLElement) {
    let newElement = element;
    let {width, height} = sizeContain(
      Number(newElement.width || 0),
      Number(newElement.height || 0),
      THUMBNAIL_WIDTH,
      THUMBNAIL_HEIGHT,
    );
    newElement.style.width = `${width}px`;
    newElement.style.height = `${height}px`;

    return newElement;
  }
}

type DetailFileProps = {
  news: NewsFlash;
  onFileRemoved: (field: 'pdf' | 'newsThumbnail') => void;
};

function DetailFile(props: DetailFileProps) {
  let {news, onFileRemoved} = props;
  return (
    <View>
      <View style={styles.dropzoneContainer}>
        <View style={styles.thumbnailContainer}>
          <Image source={{uri: news.imageUrl}} style={styles.thumbnail} />
        </View>
        <View style={styles.removeButton}>
          <Icon
            name="close"
            onPress={() => {
              onFileRemoved('pdf');
              onFileRemoved('newsThumbnail');
            }}
          />
        </View>
      </View>
      <Touchable
        onPress={() => {
          // TODO: open link
        }}
      >
        <View style={styles.fileDetailContainer}>
          <View style={styles.fileDetailIconContainer}>
            <Icon name="file" />
          </View>
          <Text style={styles.fileName}>{news.fileName}</Text>
          <Text style={{color: THEME_COLOR}}>
            {(news.fileSize / 1000000).toFixed(3)} MB
          </Text>
        </View>
      </Touchable>
    </View>
  );
}

function sizeContain(
  currentWidth: number,
  currentHeight: number,
  maxWidth: number,
  maxHeight: number,
) {
  let ratio = currentWidth / currentHeight;
  let height;
  let width;
  if (ratio < maxWidth / maxHeight) {
    // Image is taller than container
    height = maxHeight;
    width = height * ratio;
  } else {
    // Image is wider than container
    width = maxWidth;
    height = width / ratio;
  }
  return {width, height};
}

const styles = StyleSheet.create({
  floatingLabel: {
    fontSize: 12,
    lineHeight: 22,
    pointerEvents: 'none',
    userSelect: 'none',
    color: TEXT_COLOR,
    marginBottom: 3,
  },
  dropzoneContainer: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    width: DROPZONE_WIDTH,
    height: DROPZONE_HEIGHT,
    minWidth: 0,
    minHeight: 0,
    cursor: 'pointer',
    borderStyle: 'solid',
    borderWidth: 'thin',
    borderColor: 'rgb(228, 235, 230)',
    borderRadius: 4,
  },
  thumbnailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
  },
  removeButton: {
    position: 'absolute',
    right: 10,
    top: 0,
  },
  fileDetailContainer: {
    width: DROPZONE_WIDTH,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  fileName: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetailIconContainer: {
    padding: 10,
    borderRadius: 4,
  },
  errorText: {
    fontSize: SMALL_FONT_SIZE,
    lineHeight: 12,
    color: 'red',
    marginTop: 5,
    maxWidth: 200,
    paddingLeft: 15,
  },
});
