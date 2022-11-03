import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../../../general/helpers/fetchJSON';

import watcher, {
  GetReportFolderByIDSaga,
  GetRootReportFolderSaga,
  AddFolderSaga,
  AddFileSaga,
  EditFolderSaga,
  EditFileSaga,
} from '../reportSaga';

describe('Report CMS Saga Test', () => {
  it('Should watch every FETCH_NEWS_FLASH_LIST_REQUESTED, ADD_NEWS_FLASH_REQUESTED, UPDATE_NEWS_FLASH_REQUESTED, and DELETE_NEWS_FLASH_REQUESTED', () => {
    let sagaWatcher = watcher();
    expect(sagaWatcher.next().value).toEqual(
      takeEvery(
        'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED',
        GetReportFolderByIDSaga,
      ),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('FETCH_REPORT_ROOT_FOLDER_REQUESTED', GetRootReportFolderSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('ADD_REPORT_FOLDER_REQUESTED', AddFolderSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('ADD_REPORT_FILE_REQUESTED', AddFileSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('EDIT_REPORT_FOLDER_REQUESTED', EditFolderSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('EDIT_REPORT_FILE_REQUESTED', EditFileSaga),
    );
  });
  it('Should fetch the root report folder list', () => {
    let action = {type: 'FETCH_REPORT_ROOT_FOLDER_REQUESTED'};
    let result = [{id: 123, name: 'foo'}];
    let reportFolders = new Map();
    reportFolders.set(123, result[0]);
    let generator = GetRootReportFolderSaga(action);
    expect(generator.next().value).toEqual(
      call(fetchJSON, '/ReportFolders', {}),
    );
    expect(generator.next(result).value).toEqual(
      put({
        type: 'FETCH_REPORT_ROOT_FOLDER_SUCCEED',
        reportFolders,
      }),
    );
  });
  it('Should return error if fetch root report folder list failed', () => {
    let gen = GetRootReportFolderSaga();
    try {
      expect(gen.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'FETCH_REPORT_ROOT_FOLDER_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });

  it('Should fetch the report folder list by id', () => {
    let action = {
      type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED',
      folderID: 1,
    };
    let reportFolder = {id: 1, name: 'foo'};
    let generator = GetReportFolderByIDSaga(action);
    expect(generator.next().value).toEqual(
      call(fetchJSON, `/ReportFolders/${action.folderID}`, {}),
    );
    expect(generator.next(reportFolder).value).toEqual(
      put({
        type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_SUCCEED',
        reportFolder,
      }),
    );
  });
  it('Should return error if fetch report folder list by id failed', () => {
    let gen = GetRootReportFolderSaga();
    try {
      expect(gen.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });

  it('Should add new report folder in another folder', () => {
    let reportFolder = {name: 'new folder', parentId: 1};
    let action = {
      type: 'ADD_REPORT_FOLDER_REQUESTED',
      reportFolder,
    };
    let generator = AddFolderSaga(action);

    let headers = {
      'Content-Type': 'application/json',
    };
    let body = JSON.stringify(reportFolder);
    expect(generator.next(reportFolder).value).toEqual(
      call(fetchJSON, `/ReportFolders`, {
        headers,
        method: 'POST',
        body,
      }),
    );

    expect(generator.next().value).toEqual(
      put({
        type: 'ADD_REPORT_FOLDER_SUCCEED',
      }),
    );

    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED',
        folderID: reportFolder.parentId,
      }),
    );
  });

  it('Should add new report folder in root folder', () => {
    let reportFolder = {name: 'new folder', parentId: null};
    let action = {
      type: 'ADD_REPORT_FOLDER_REQUESTED',
      reportFolder,
    };
    let generator = AddFolderSaga(action);

    let headers = {
      'Content-Type': 'application/json',
    };
    let body = JSON.stringify(reportFolder);
    expect(generator.next(reportFolder).value).toEqual(
      call(fetchJSON, `/ReportFolders`, {
        headers,
        method: 'POST',
        body,
      }),
    );

    expect(generator.next().value).toEqual(
      put({
        type: 'ADD_REPORT_FOLDER_SUCCEED',
      }),
    );

    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_REPORT_ROOT_FOLDER_REQUESTED',
      }),
    );
  });
  it('Should return error if add new folder failed', () => {
    let reportFolder = {name: 'new folder', parentId: null};
    let action = {
      type: 'ADD_REPORT_FOLDER_REQUESTED',
      reportFolder,
    };
    let gen = AddFolderSaga(action);
    try {
      expect(gen.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'ADD_REPORT_FOLDER_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });

  // it('Should add new news flash', () => {
  //   let newNewsFlash = {name: 'foo'};
  //   let generator = AddNewsFlashSaga({
  //     type: 'ADD_NEWS_FLASH_REQUESTED',
  //     newsFlash: newNewsFlash,
  //   });
  //   let headers = {
  //     ...authorization.headers,
  //     'Content-Type': 'application/json',
  //   };
  //   expect(generator.next().value).toEqual(
  //     call(fetchJSON, '/NewsFlashes', {
  //       headers,
  //       method: 'POST',
  //       body: JSON.stringify(newNewsFlash),
  //     }),
  //   );
  //   expect(generator.next().value).toEqual(
  //     put({
  //       type: 'ADD_NEWS_FLASH_SUCCEED',
  //     }),
  //   );
  //   expect(generator.next().value).toEqual(
  //     put({
  //       type: 'FETCH_NEWS_FLASH_LIST_REQUESTED',
  //     }),
  //   );
  //   expect(generator.next().value).toEqual(
  //     put({
  //       type: 'FETCH_GROUP_LIST_REQUESTED',
  //     }),
  //   );
  // });
  // it('Should return error if add news flash failed', () => {
  //   let newNewsFlash = {name: 'foo'};
  //   let generator = AddNewsFlashSaga({
  //     type: 'ADD_NEWS_FLASH_REQUESTED',
  //     newsFlash: newNewsFlash,
  //   });
  //   try {
  //     expect(generator.throw({message: 'anyErrorMessage'})).toEqual(
  //       put({
  //         type: 'ADD_NEWS_FLASH_FAILED',
  //         error: {message: 'anyErrorMessage'},
  //       }),
  //     );
  //   } catch (error) {
  //     expect(error).toEqual({message: 'anyErrorMessage'});
  //   }
  // });
  //
  // it('Should edit existing news flash', () => {
  //   let newNewsFlash = {name: 'foo'};
  //   let generator = UpdateNewsFlashSaga({
  //     type: 'UPDATE_NEWS_FLASH_REQUESTED',
  //     newsFlash: newNewsFlash,
  //     id: 123,
  //   });
  //   let headers = {
  //     ...authorization.headers,
  //     'Content-Type': 'application/json',
  //   };
  //   expect(generator.next().value).toEqual(
  //     call(fetchJSON, '/NewsFlashes/123', {
  //       headers,
  //       method: 'PUT',
  //       body: JSON.stringify(newNewsFlash),
  //     }),
  //   );
  //   expect(generator.next().value).toEqual(
  //     put({
  //       type: 'UPDATE_NEWS_FLASH_SUCCEED',
  //     }),
  //   );
  //   expect(generator.next().value).toEqual(
  //     put({
  //       type: 'FETCH_NEWS_FLASH_LIST_REQUESTED',
  //     }),
  //   );
  //   expect(generator.next().value).toEqual(
  //     put({
  //       type: 'FETCH_GROUP_LIST_REQUESTED',
  //     }),
  //   );
  // });
  // it('Should return error if edit news flash failed', () => {
  //   let newNewsFlash = {name: 'foo'};
  //   let generator = UpdateNewsFlashSaga({
  //     type: 'UPDATE_NEWS_FLASH_REQUESTED',
  //     newsFlash: newNewsFlash,
  //     id: 123,
  //   });
  //   try {
  //     expect(generator.throw({message: 'anyErrorMessage'})).toEqual(
  //       put({
  //         type: 'UPDATE_NEWS_FLASH_FAILED',
  //         error: {message: 'anyErrorMessage'},
  //       }),
  //     );
  //   } catch (error) {
  //     expect(error).toEqual({message: 'anyErrorMessage'});
  //   }
  // });
  //
  // it('Should delete existing news flash', () => {
  //   let idList = [123];
  //   let generator = DeleteNewsFlashSaga({
  //     type: 'DELETE_NEWS_FLASH_REQUESTED',
  //     idList,
  //   });
  //   let headers = {
  //     ...authorization.headers,
  //   };
  //   for (let id of idList) {
  //     expect(generator.next().value).toEqual(
  //       call(fetchJSON, `/NewsFlashes/${id}`, {
  //         headers,
  //         method: 'DELETE',
  //       }),
  //     );
  //   }
  //   expect(generator.next().value).toEqual(
  //     put({
  //       type: 'DELETE_NEWS_FLASH_SUCCEED',
  //     }),
  //   );
  //   expect(generator.next().value).toEqual(
  //     put({
  //       type: 'FETCH_NEWS_FLASH_LIST_REQUESTED',
  //     }),
  //   );
  //   expect(generator.next().value).toEqual(
  //     put({
  //       type: 'FETCH_GROUP_LIST_REQUESTED',
  //     }),
  //   );
  // });
  // it('Should return error if delete news flash failed', () => {
  //   let idList = [123];
  //   let generator = DeleteNewsFlashSaga({
  //     type: 'DELETE_NEWS_FLASH_REQUESTED',
  //     idList,
  //   });
  //   try {
  //     expect(generator.throw({message: 'anyErrorMessage'})).toEqual(
  //       put({
  //         type: 'DELETE_NEWS_FLASH_FAILED',
  //         error: {message: 'anyErrorMessage'},
  //       }),
  //     );
  //   } catch (error) {
  //     expect(error).toEqual({message: 'anyErrorMessage'});
  //   }
  // });
  // it('Should throw error when fetchJSON is failing', () => {
  //   let gen = dstSaga();
  //   try {
  //     expect(gen.throw({message: 'a'})).toEqual(
  //       put({
  //         type: 'FETCH_DST_FAILED',
  //         error: {message: 'a'},
  //       }),
  //     );
  //   } catch (error) {
  //     expect(error).toEqual({message: 'a'});
  //   }
  // });
});
