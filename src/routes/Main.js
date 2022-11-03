// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {withRouter} from 'react-router';
import {StyleSheet} from 'react-primitives';
import {Route, Redirect} from 'react-router-dom';
import {TransitionGroup} from 'react-transition-group';
import {connect} from 'react-redux';

import routes, {INITIAL_ROUTE} from './routes';
import TitleBar from './components/TitleBar';
import NewsFlashModalDialog from '../scenes/CMS/NewsFlash/NewsFlashModalDialog';

import {
  View,
  FlexImage as Image,
  Text,
  LoadingIndicator,
} from '../general/components/coreUIComponents';

import type {Route as RouteType} from './Route-type';
import type {Dispatch} from '../general/stores/Action';
import type {RootState} from '../general/stores/RootState';
import type {ROLE} from '../features/Access/CurrentUser-type';
import type {NewsFlash} from '../scenes/CMS/NewsFlash/NewsFlash-type';

type Props = {
  userRole: ROLE;
  authorize: () => void;
  newsFlashes: Array<NewsFlash>;
  isLoading: boolean;
};

export class Main extends Component {
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
  }

  componentWillMount() {
    this.props.authorize();
  }

  render() {
    let {userRole, newsFlashes, isLoading} = this.props;
    if (isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <View style={styles.outerContainer}>
        <TitleBar />
        <View style={styles.content}>
          <Route
            exact
            path="/"
            render={() => <Redirect from="/" to={INITIAL_ROUTE} />}
          />
          <Route
            exact
            path="/dashboard"
            render={() => <Redirect from="/dashboard" to={INITIAL_ROUTE} />}
          />
          {routes.map((route: RouteType, index: number) => {
            let {path, SceneComponent, needAuth} = route;
            return (
              <Route key={index} path={path}>
                {({match}) =>
                  match ? (
                    !needAuth || (needAuth && userRole !== 'USER') ? (
                      <TransitionGroup
                        component={View}
                        style={{flex: 1}}
                        appear
                      >
                        <SceneComponent />
                      </TransitionGroup>
                    ) : (
                      <Redirect to={INITIAL_ROUTE} />
                    )
                  ) : null}
              </Route>
            );
          })}
        </View>
        <NewsFlashModalDialog
          data={newsFlashes}
          childComponent={(datum) => (
            <View
              key={datum.id}
              style={{
                minHeight: 600,
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                customStyle="title"
                fontWeight="bold"
                style={{marginBottom: 20}}
              >
                {datum.title}
              </Text>
              <Image source={(datum && datum.imageUrl) || ''} />
            </View>
          )}
        />
      </View>
    );
  }
}

function mapStateToProps(state: RootState) {
  let {isLoading} = state.currentUser;
  let user = state.currentUser.user || {};
  let newsFlashes = (user && user.newsFlashes) || [];
  return {
    userRole: user.role || 'USER',
    newsFlashes: newsFlashes.length > 0 ? newsFlashes : null,
    isLoading,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    authorize() {
      dispatch({type: 'AUTHORIZATION_REQUESTED'});
    },
  };
}
// TODO: use map stateToProps to handle failed authorization (not sure if needed because of SSO)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

// let MOCK_NEWSFLASH_DATA = [
//   {
//     id: 'led123',
//     title: 'Leaders Of Tomorrow',
//     imgUrl:
//       'https://image.slidesharecdn.com/psfqr1st2010-120510165849-phpapp02/95/putera-sampoerna-foundation-report-quarter-1-2010-1-728.jpg?cb=1336669231',
//   },
//   {
//     id: 'samp123',
//     title: 'Independence',
//     imgUrl:
//       'https://cdn.slidesharecdn.com/ss_thumbnails/psfqr2nd2010-120510170054-phpapp01-thumbnail-4.jpg?cb=1336669333',
//   },
// ];

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#f6f7fb',
    cursor: 'auto',
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
