// // @flow
//
// import React, {Component} from 'react';
// import {Animated, StyleSheet} from 'react-primitives';
// import {
//   Text,
//   View,
//   Icon,
//   ScrollView,
// } from '../general/components/coreUIComponents';
// import {withRouter} from 'react-router';
// import widgets, {secondWidgetList} from '../routes/widgets';
// import WidgetThumbnail from './WidgetThumbnailItem';
// import {DragDropContext} from 'react-dnd';
// import HTML5Backend from 'react-dnd-html5-backend';
// import {LIGHT_GREY} from '../general/constants/colors';
//
// type WidgetList = Array<*>; //TODO change the type to Array<WidgetThumbnail>
//
// type State = {
//   isOpen: boolean;
//   lanes: Array<WidgetList>;
// };
//
// type Props = {
//   animatedvalue: Animated.Value;
//   onClose: () => void;
// };
//
// class WidgetLibrary extends Component {
//   props: Props;
//   state: State;
//
//   constructor() {
//     super(...arguments);
//
//     // This state is for removing the overlay completely
//     this.state = {
//       isOpen: this.props.animatedvalue._value > 0 ? true : false,
//       lanes: [[...widgets], [...secondWidgetList]],
//     };
//
//     this.props.animatedvalue.addListener(({value}) => {
//       let {isOpen} = this.state;
//       if (value > 0 && !isOpen) {
//         this.setState({isOpen: true});
//       } else if (value === 0 && isOpen) {
//         this.setState({isOpen: false});
//       }
//     });
//   }
//
//   render() {
//     let {lanes} = this.state;
//     let {animatedvalue, onClose, ...otherProps} = this.props;
//
//     if (!this.state.isOpen) {
//       return null;
//     }
//
//     let width = animatedvalue.interpolate({
//       inputRange: [0, 1],
//       outputRange: ['0%', '36%'],
//     });
//
//     let backgroundColor = animatedvalue.interpolate({
//       inputRange: [0, 1],
//       outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)'],
//     });
//
//     let opacity = animatedvalue.interpolate({
//       inputRange: [0.5, 1],
//       outputRange: [0, 1],
//     });
//
//     return (
//       <Animated.View style={[styles.overlay, {backgroundColor}]}>
//         <Animated.View style={[styles.root, {width, opacity}]}>
//           <View style={{alignSelf: 'flex-end'}}>
//             <Icon
//               name="close"
//               onPress={onClose}
//               style={{height: 15, width: 15}}
//               containerStyle={StyleSheet.flatten(styles.iconContainer)}
//             />
//           </View>
//           <View style={styles.header}>
//             <View style={styles.headerTextContainer}>
//               <Text>Current Widgets</Text>
//             </View>
//             <View style={styles.headerTextContainer}>
//               <Text>Widget Library</Text>
//             </View>
//           </View>
//           <View style={styles.container}>
//             {lanes.map((widgetList, laneIndex) => {
//               return (
//                 <View key={laneIndex} style={styles.scrollView}>
//                   <ScrollView {...otherProps}>
//                     {widgetList.map((widget, index) => (
//                       <View key={widget.key}>
//                         <WidgetThumbnail
//                           id={widget.key}
//                           widget={widget}
//                           laneIndex={laneIndex}
//                           index={index}
//                           showSelected={false}
//                           moveCard={this._moveCard}
//                         />
//                       </View>
//                     ))}
//                   </ScrollView>
//                 </View>
//               );
//             })}
//           </View>
//         </Animated.View>
//       </Animated.View>
//     );
//   }
//
//   _moveCard(
//     dragIndex: number,
//     hoverIndex: number,
//     dragLaneIndex: number,
//     hoverLaneIndex: number,
//   ) {
//     let newLanes = [...this.state.lanes];
//     const dragCard = newLanes[dragLaneIndex][dragIndex];
//     newLanes[dragLaneIndex].splice(dragIndex, 1); // drag...
//
//     if (dragLaneIndex !== hoverLaneIndex) {
//       let startToIndex = newLanes[hoverLaneIndex].slice(0, hoverIndex);
//       let indexToEnd = newLanes[hoverLaneIndex].slice(
//         hoverIndex,
//         newLanes[hoverLaneIndex].length,
//       );
//       startToIndex.push(dragCard); // and drop
//       newLanes[hoverLaneIndex] = startToIndex.concat(indexToEnd);
//     } else {
//       newLanes[dragLaneIndex].splice(hoverIndex, 0, dragCard); // and drop
//     }
//     this.setState({lanes: newLanes});
//   }
// }
//
// export default withRouter(DragDropContext(HTML5Backend)(WidgetLibrary));
//
// const styles = StyleSheet.create({
//   overlay: {
//     position: 'fixed',
//     top: 88,
//     left: 0,
//     zIndex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   root: {
//     backgroundColor: 'white',
//     borderLeftColor: LIGHT_GREY,
//     borderLeftWidth: 1,
//     height: '100%',
//     paddingHorizontal: 10,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   headerTextContainer: {
//     flex: 1,
//     paddingTop: 10,
//     alignItems: 'center',
//   },
//   iconContainer: {
//     marginTop: 10,
//     width: 'auto',
//     height: 'auto',
//     padding: 0,
//   },
// });
