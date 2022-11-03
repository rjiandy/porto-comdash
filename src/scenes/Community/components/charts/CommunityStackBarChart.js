// // @flow
// import React from 'react';
// import {
//   VictoryChart,
//   VictoryBar,
//   VictoryStack,
//   VictoryTheme,
//   VictoryAxis,
// } from 'victory';
// import {View} from '../../../../general/components/coreUIComponents';
// import Legend from '../Legend';
//
// type CommunityProgramDatum = {
//   product: string;
//   primaryCC: number;
//   secondaryCC: number;
// };
//
// type Props = {
//   data: Array<CommunityProgramDatum>;
//   primaryColor: string;
//   secondaryColor: string;
//   xAxis: string;
//   yValue: Array<string>;
// };
//
// function CommunityStackBarChart(props: Props) {
//   let {data, primaryColor, secondaryColor, xAxis, yValue} = props;
//   return (
//     <View style={{justifyContent: 'space-between', alignItems: 'center'}}>
//       <VictoryChart
//         theme={VictoryTheme.material}
//         domainPadding={20}
//         width={400}
//         height={400}
//         style={{
//           data: {
//             width: 50,
//           },
//         }}
//         padding={{left: 70, rigth: 10, top: 10, bottom: 40}}
//       >
//         <VictoryAxis
//           style={{
//             axis: {
//               stroke: 'black',
//               strokeOpacity: 0,
//             },
//           }}
//           tickFormat={(tick) => tick}
//         />
//         <VictoryAxis
//           dependentAxis
//           style={{
//             axis: {
//               stroke: '#eee',
//               strokeOpacity: 0.5,
//             },
//             parent: {
//               padding: 100,
//             },
//           }}
//           tickFormat={data.map((datum) => datum.product)}
//         />
//         <VictoryStack
//           style={{
//             data: {
//               width: 25,
//             },
//           }}
//           horizontal
//         >
//           <VictoryBar data={data} x={xAxis} y={yValue[0]} />
//           <VictoryBar data={data} x={xAxis} y={yValue[1]} />
//         </VictoryStack>
//       </VictoryChart>
//       <Legend
//         legends={[
//           {color: primaryColor, text: 'Primary'},
//           {color: secondaryColor, text: 'Secondary'},
//         ]}
//       />
//     </View>
//   );
// }
//
// export default CommunityStackBarChart;
