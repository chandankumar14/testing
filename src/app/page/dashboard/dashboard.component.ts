import { activity } from './../../actions/filter';
import { Observable } from 'rxjs';
import * as Highcharts from 'highcharts';

import { AfterContentInit, Component, OnInit } from '@angular/core';
import { fromJS } from 'immutable';
import mapStyle from '../../../assets/style.json';
import { HttpClient } from '@angular/common/http';

import {
  CurbFeature,
  CurbFeatureCollection,
  filterCurblrData,
} from '../../common/curblr';
import {
  FeatureCollection,
  featureCollection,
  feature,
  LineString,
} from '@turf/helpers';

declare var $: any;

//loads map style
const defaultMapStyle = fromJS(mapStyle);

//sunset
// const MAXSTAY_COLOR_MAP:{ [key: string]: any } = {
//     "3": "#FFDF00",
//     "15": "#F1B408",
//     "30": "#F1871C",
//     "60": "#F06121",
//     "120": "#F12627",
//     "180": "#C80286",
//     "240": "#63238A",
// }

//opposite of sunset
// const MAXSTAY_COLOR_MAP:{ [key: string]: any } = {
//     "3": "#FFDF00",
//     "15": "#8BBA25",
//     "30": "#018D5A",
//     "60": "#00A8C4",
//     "120": "#1078C3",
//     "180": "#4336A2",
//     "240": "#6D238A",
// }

//blues
const MAXSTAY_COLOR_MAP: { [key: string]: any } = {
  '3': '#e1f5fe',
  '15': '#81d4fa',
  '30': '#4fc3f7',
  '60': '#03a9f4',
  '120': '#0277bd',
  '180': '#01579b',
  '240': '#00345D',
};

//greens
// const MAXSTAY_COLOR_MAP:{ [key: string]: any } = {
//     "3": "#ffee58",
//     "15": "#cddc39",
//     "30": "#7cb342",
//     "60": "#689f38",
//     "120": "#388e3c",
//     "180": "#1b5e20",
//     "240": "#124116",
// }



const scaledOffset = (offset: number) => {
  return {
    type: 'exponential',
    base: 2,
    stops: [
      [12, offset * Math.pow(2, 12 - 16)],
      [16, offset * Math.pow(2, 16 - 16)],
    ],
  };
};

// sets average parking length (roughly 7m, per NACTO) for use in estimating length in # of parking spaces
const avgParkingLength = 7;

const renderCurblrData = (
  data: CurbFeatureCollection
  // day: string,
  // time: string,
  // filterType: string
): FeatureCollection<LineString> => {
  var renderData = featureCollection<LineString>([]);
  // var filteredData = filterCurblrData(data, day, time);

  for (var curbFeature of renderData.features) {
    var renderFeature = feature<LineString>(curbFeature.geometry);
    renderFeature.properties = {};

    for (var regulation of curbFeature.properties.regulations) {
      // marks each feature with its length
      renderFeature.properties.length =
        curbFeature.properties.location.shstLocationEnd -
        curbFeature.properties.location.shstLocationStart;

      renderFeature.properties.priority = regulation.priority;

      var priority = renderFeature.properties.priority;
      // if(priority) {
      var offsetPriority = 0;
      //offsetPriority = (10 * priority);

      var baseOffset = 10 + offsetPriority;
      if (curbFeature.properties.location.sideOfStreet === 'left')
        baseOffset = 0 - 10 - offsetPriority;

      renderFeature.properties['offset'] = baseOffset; //scaledOffset(baseOffset);

      // renderFeature.properties['color'] = ACTIVITY_COLOR_MAP['passenger loading'];

      // if (filterType === "maxStay") {
      //   if (regulation.rule.maxStay) {
      //     var maxStay = regulation.rule.maxStay + "";
      //     if (MAXSTAY_COLOR_MAP[maxStay]) {
      //       renderFeature.properties["color"] = MAXSTAY_COLOR_MAP[maxStay];
      //       renderFeature.properties.maxStay = maxStay;
      //       renderData.features.push(renderFeature);
      //     }
      //   }
      // }
      // // Splits out common activities and variants for an overall view. Features that fall into more than one "bucket" are duplicated, but handled by ensuring that they ultimately fall into the more specific bucket via painter's algorithm.
      // // Requires ts.3.7 because of null arrays - I lucked out on mine but this will break on a different environment
      // else if (filterType === "activity") {

      //   if (regulation.rule.activity === "no parking") {
      //     renderFeature.properties["color"] =
      //       ACTIVITY_COLOR_MAP["no parking"];
      //     // set the activty to use later in hooking up chart to map data
      //     renderFeature.properties.activity = "no parking";
      //     renderData.features.push(renderFeature);
      //   }
      //   // if (
      //   //   regulation.rule.activity === "no standing"
      //   // ) {
      //   //   renderFeature.properties["color"] =
      //   //     ACTIVITY_COLOR_MAP["no standing"];
      //   //   // set the activty to use later in hooking up chart to map data
      //   //   renderFeature.properties.activity = "no standing";
      //   //   renderData.features.push(renderFeature);
      //   // }
      //   if (
      //     regulation.rule.activity === "parking" &&
      //     !regulation.rule.payment &&
      //     !regulation.userClasses?.some(uc => uc.classes?.length > 0)
      //   ) {
      //     renderFeature.properties["color"] =
      //       ACTIVITY_COLOR_MAP["free parking"];
      //     renderFeature.properties.activity = "free parking";
      //     renderData.features.push(renderFeature);
      //   }
      //   if (
      //     regulation.rule.activity === "parking" &&
      //     regulation.rule.payment &&
      //     !regulation.userClasses?.some(uc => uc.classes?.length > 0)
      //   ) {
      //     renderFeature.properties["color"] =
      //       ACTIVITY_COLOR_MAP["paid parking"];
      //     renderFeature.properties.activity = "paid parking";
      //     renderData.features.push(renderFeature);
      //   }
      //   if (regulation.rule.activity === "loading") {
      //     renderFeature.properties["color"] = ACTIVITY_COLOR_MAP["loading"];
      //     renderFeature.properties.activity = "loading";
      //     renderData.features.push(renderFeature);
      //   }
      //   if (
      //     regulation.userClasses?.some(uc =>
      //       [
      //         "motorcycle",
      //         "hotel guest",
      //         "permit",
      //         "reserved",
      //         "handicap",
      //         "scooter",
      //         "bicycle",
      //         "USPS",
      //         "car share",
      //         "police",
      //         "tour bus"
      //       ].some(c => uc.classes?.includes(c))
      //     )
      //   ) {
      //     renderFeature.properties["color"] =
      //       ACTIVITY_COLOR_MAP["restricted"];
      //     renderFeature.properties.activity = "restricted";
      //     renderData.features.push(renderFeature);
      //   }
      //   if (
      //     regulation.userClasses?.some(uc =>
      //       ["taxi", "passenger", "TNC", "rideshare"].some(c =>
      //         uc.classes?.includes(c)
      //       )
      //     )
      //   ) {
      //     renderFeature.properties["color"] =
      //       ACTIVITY_COLOR_MAP["passenger loading"];
      //     renderFeature.properties.activity = "passenger loading";
      //     renderData.features.push(renderFeature);
      //   }
      //   if (
      //     regulation.userClasses?.some(uc => uc.classes?.includes("transit"))
      //   ) {
      //     renderFeature.properties["color"] = ACTIVITY_COLOR_MAP["transit"];
      //     renderFeature.properties.activity = "transit";
      //     renderData.features.push(renderFeature);
      //   }
      // }
    }
  }

  return renderData;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterContentInit {
  config1: any = {};
  config2: any = {};
  selectedLayer = '1';

  cameraData: any = {};
  // url =
    // 'http://localhost:4200/assets/data/downtown_portland_2020-07-30.curblr.json';
  segsUrl = 'http://34.218.20.24:5000/curb/segs';
  sensUrl = "http://34.218.20.24:5000/curb/sens";

  
  ACTIVITY_COLOR_MAP = {
    'no standing': '#777777',
    'no parking': '#DD2C00',
    'passenger loading': '#FF9100',
    loading: '#FFEA00',
    transit: '#37B34A',
    'free parking': '#00E5FF',
    'paid parking': '#2979FF',
    restricted: '#AA00FF',
  };
  
  colorsList = Object.keys(this.ACTIVITY_COLOR_MAP)
  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  getRandomColor() {
    return Object.values(this.ACTIVITY_COLOR_MAP)[this.randomIntFromInterval(0, 7)]
  }

  defaultMapStyle = fromJS(mapStyle);

  state = {
    mode: 'activity',
    day: 'mo',
    time: '08:01',
    mapStyle: this.defaultMapStyle,
  };

  // buildingSource = {
  //   data: 'http://34.218.20.24:5000/curb/sens',
  //   type: 'geojson'
  // };
  buildingSource = {
    data: '{}',
    // data: 'http://localhost:4200/assets/data/downtown_portland_2020-07-30.curblr.json',
    // data: 'http://34.218.20.24:5000/curb/segs',
    // data: "http://34.218.20.24:5000/curb/sens",
    type: 'geojson',
  };

  constructor(private http: HttpClient) {
    this.fetchSegsData();
    this.fetchSensData();
  }

  fetchSegsData() {
    this.getJSON(this.segsUrl).subscribe((data) => {
      console.log('segs data', data);
      data.features.forEach((element) => {
        // const activity = JSON.parse(element.properties.regulations)[0].rule.activity;
        let regulations = {};
        if (typeof element.properties.regulations === "string") {
          regulations = JSON.parse(element.properties.regulations)
        } else {
          regulations = element.properties.regulations;
        }
        const activity = regulations[0].rule.activity;
        if(!(activity in this.ACTIVITY_COLOR_MAP)) {
          element.properties['color'] = this.getRandomColor();
        } else {
          element.properties['color'] = this.ACTIVITY_COLOR_MAP[activity];
        }
      });
      this.buildingSource.data = data;
    });
  }

  fetchSensData() {
    this.getJSON(this.sensUrl).subscribe((data) => {
      console.log('sens data', data);
     
      this.cameraData = data;
    });
  }


  scaledWidth(width: number) {
    return {
      type: 'exponential',
      base: 2,
      stops: [
        [12, width * Math.pow(2, 12 - 16)],
        [16, width * Math.pow(2, 16 - 16)],
      ],
    };
  }

  // dataLayer = fromJS({
  //   id: 'dataLayer',
  //   // source: 'curblrData',
  //   source: this.buildingSource,
  //   type: 'line',
  //   interactive: true,
  //   paint: {
  //     'line-color': ['get', 'color'],
  //     'line-offset': ['get', 'offset'],
  //     'line-width': this.scaledWidth(6.8),
  //   },
  // });

  dataLayer = {
    id: 'dataLayer',
    // source: 'curblrData',
    source: this.buildingSource,
    type: 'line',
    interactive: true,
    paint: {
      'line-color': ['get', 'color'],
      'line-offset': ['get', 'offset'],
      'line-width': this.scaledWidth(6.8),
    },
  };

  ngOnInit(): void {
    this.config1 = this.getConfig();
    this.config2 = this.getConfig();
    console.log('dataLayer', this.dataLayer);
  }

  ngAfterContentInit() {
    // mapboxgl.accessToken = '<your access token here>';
    // const map = new mapboxgl.Map({
    //     container: 'map', // container ID
    //     style: 'mapbox://styles/mapbox/streets-v11', // style URL
    //     center: [-74.5, 40], // starting position [lng, lat]
    //     zoom: 9 // starting zoom
    // });
  }

  getConfig() {
    return {
      title: {
        text: ' ',
      },
      chart: {
        backgroundColor: '#2f3242',
        height: '30%',
      },

      yAxis: {
        title: {
          text: 'Count',
          style: {
            fontSize: 14,
            color: '#FFFFFF',
          },
        },
        tickLength: 2,
        labels: {
          style: {
            fontSize: 11,
            fontWeight: 'bold',
            color: '#FFFFFF',
          },
        },
        // gridLineColor: 'transparent',
        // gridLineWidth: 0,
        lineWidth: 1,
        plotLines: [
          {
            color: '#FFFFFF',
            width: 1,
            value: 0,
          },
        ],
      },

      xAxis: {
        title: {
          text: 'Date Range',
          style: {
            fontSize: 14,
            color: '#FFFFFF',
          },
        },
        lineWidth: 1,
        gridLineColor: 'transparent',

        type: 'datetime',
        // tickInterval: 1000 * 3600 * 24 * 30, // 1 month
        labels: {
          dateTimeLabelFormats: {
            day: '%d %b %Y', //ex- 01 Jan 2016
          },
          formatter() {
            return Highcharts.dateFormat('%d %b %Y', this.value);
          },
          style: {
            fontSize: 11,
            fontWeight: 'bold',
            color: '#FFFFFF',
          },
        },
      },

      // legend: {
      //   enabled: false,
      // },
      legend: {
        layout: 'horizontal',
        // align: 'right',
        // verticalAlign: 'middle',
        itemStyle: {
          color: '#FFFFFF',
        },
      },
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      itemStyle: {
        color: '#FFFFFF',
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
            style: {
              fontSize: 14,
              // fontWeight: 'bold',
              color: '#FFFFFF',
            },
          },
          pointStart: 0,
        },
      },

      series: [
        {
          name: 'EV Charging car',
          type: 'line',
          data: [
            [Date.UTC(2020, 0, 1), 100],
            [Date.UTC(2020, 0, 15), 110],
            [Date.UTC(2020, 1, 1), 300],
            [Date.UTC(2020, 1, 15), 310],
            [Date.UTC(2020, 2, 1), 300],
            [Date.UTC(2020, 2, 15), 310],
            [Date.UTC(2020, 3, 1), 200],
            [Date.UTC(2020, 3, 15), 210],
            [Date.UTC(2020, 4, 1), 200],
            [Date.UTC(2020, 4, 15), 210],
            [Date.UTC(2020, 5, 1), 100],
            [Date.UTC(2020, 5, 15), 110],
            [Date.UTC(2020, 6, 1), 300],
            [Date.UTC(2020, 6, 15), 310],
          ],
        },
        {
          name: 'Passenger Loading/Unloading',
          type: 'line',
          data: [
            [Date.UTC(2020, 0, 1), 300],
            [Date.UTC(2020, 0, 15), 320],
            [Date.UTC(2020, 1, 1), 100],
            [Date.UTC(2020, 1, 15), 120],
            [Date.UTC(2020, 2, 1), 200],
            [Date.UTC(2020, 2, 15), 220],
            [Date.UTC(2020, 3, 1), 300],
            [Date.UTC(2020, 3, 15), 320],
            [Date.UTC(2020, 4, 1), 100],
            [Date.UTC(2020, 4, 15), 120],
            [Date.UTC(2020, 5, 1), 300],
            [Date.UTC(2020, 5, 15), 320],
            [Date.UTC(2020, 6, 1), 200],
            [Date.UTC(2020, 6, 15), 220],
          ],
        },

        {
          name: 'Commerical Loading',
          type: 'line',
          data: [
            [Date.UTC(2020, 0, 1), 200],
            [Date.UTC(2020, 0, 15), 230],
            [Date.UTC(2020, 1, 1), 100],
            [Date.UTC(2020, 1, 15), 130],
            [Date.UTC(2020, 2, 1), 300],
            [Date.UTC(2020, 2, 15), 330],
            [Date.UTC(2020, 3, 1), 300],
            [Date.UTC(2020, 3, 15), 330],
            [Date.UTC(2020, 4, 1), 100],
            [Date.UTC(2020, 4, 15), 130],
            [Date.UTC(2020, 5, 1), 200],
            [Date.UTC(2020, 5, 15), 230],
            [Date.UTC(2020, 6, 1), 300],
            [Date.UTC(2020, 6, 15), 330],
          ],
        },

        {
          name: 'Rules Non-Compliance',
          type: 'line',
          data: [
            [Date.UTC(2020, 0, 1), 200],
            [Date.UTC(2020, 0, 15), 230],
            [Date.UTC(2020, 1, 1), 200],
            [Date.UTC(2020, 1, 15), 230],
            [Date.UTC(2020, 2, 1), 100],
            [Date.UTC(2020, 2, 15), 130],
            [Date.UTC(2020, 3, 1), 300],
            [Date.UTC(2020, 3, 15), 330],
            [Date.UTC(2020, 4, 1), 100],
            [Date.UTC(2020, 4, 15), 130],
            [Date.UTC(2020, 5, 1), 300],
            [Date.UTC(2020, 5, 15), 330],
            [Date.UTC(2020, 6, 1), 300],
            [Date.UTC(2020, 6, 15), 330],
          ],
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 400,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
      credits: {
        enabled: false,
      },
    };
  }

  onLayerSelect(event, layer) {
    this.selectedLayer = layer;
  }

  public getJSON(url): Observable<any> {
    return this.http.get(url);
  }
}
