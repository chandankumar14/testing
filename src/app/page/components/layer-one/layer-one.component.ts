import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { Collection, fromJS } from 'immutable';
import mapStyle from '../../../../assets/style.json';
import { HttpClient } from '@angular/common/http';

import {
  CurbFeature,
  CurbFeatureCollection,
  filterCurblrData,
} from '../../../common/curblr';
import {
  FeatureCollection,
  featureCollection,
  feature,
  LineString,
} from '@turf/helpers';

declare var $: any;
//loads map style
const defaultMapStyle: any = fromJS(mapStyle);

const manifest = {
  createdDate: '2019-12-30T11:40:45Z',
  lastUpdatedDate: '2020-07-30T17:40:45Z',
  priorityHierarchy: [
    'no standing',
    'construction',
    'temporary restriction',
    'restricted standing',
    'standing',
    'no parking',
    'restricted loading',
    'loading',
    'restricted parking',
    'paid parking',
    'free parking',
  ],
  curblrVersion: '1.1.0',
  timeZone: 'America/Los_Angeles',
  currency: 'USD',
  authority: {
    name: 'Portland Bureau of Transportation',
    url: 'https://www.portlandoregon.gov/transportation/',
  },
};

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

const ACTIVITY_COLOR_MAP = {
  'no standing': '#777777',
  'no parking': '#DD2C00',
  'passenger loading': '#FF9100',
  loading: '#FFEA00',
  transit: '#37B34A',
  'free parking': '#00E5FF',
  'paid parking': '#2979FF',
  restricted: '#AA00FF',
};

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

const scaledWidth = (width: number) => {
  return {
    type: 'exponential',
    base: 2,
    stops: [
      [12, width * Math.pow(2, 12 - 16)],
      [16, width * Math.pow(2, 16 - 16)],
    ],
  };
};

const dataLayer = fromJS({
  id: 'dataLayer',
  source: 'curblrData',
  type: 'line',
  interactive: true,
  paint: {
    'line-color': ['get', 'color'],
    'line-offset': ['get', 'offset'],
    'line-width': scaledWidth(6.8),
  },
});

// sets average parking length (roughly 7m, per NACTO) for use in estimating length in # of parking spaces
const avgParkingLength = 7;

const renderCurblrData = (
  data: CurbFeatureCollection
): FeatureCollection<LineString> => {
  var renderData = featureCollection<LineString>([]);
  console.log('data', data);
  var filteredData = filterCurblrData(data);

  for (var curbFeature of filteredData.features) {
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
      console.log('^^^^ ', regulation.rule.activity);
      if (regulation.rule.activity === 'no standing') {
        renderFeature.properties['color'] = ACTIVITY_COLOR_MAP['no standing'];
        // set the activty to use later in hooking up chart to map data
        renderFeature.properties.activity = 'no standing';
        renderData.features.push(renderFeature);
      } else if (regulation.rule.activity === 'no parking') {
        renderFeature.properties['color'] = ACTIVITY_COLOR_MAP['no parking'];
        // set the activty to use later in hooking up chart to map data
        renderFeature.properties.activity = 'no parking';
        renderData.features.push(renderFeature);
      } else if (
        regulation.rule.activity === 'parking' &&
        !regulation.rule.payment &&
        !regulation.userClasses?.some((uc) => uc.classes?.length > 0)
      ) {
        renderFeature.properties['color'] = ACTIVITY_COLOR_MAP['free parking'];
        renderFeature.properties.activity = 'free parking';
        renderData.features.push(renderFeature);
      } else if (
        regulation.rule.activity === 'parking' &&
        regulation.rule.payment &&
        !regulation.userClasses?.some((uc) => uc.classes?.length > 0)
      ) {
        renderFeature.properties['color'] = ACTIVITY_COLOR_MAP['paid parking'];
        renderFeature.properties.activity = 'paid parking';
        renderData.features.push(renderFeature);
      } else if (regulation.rule.activity === 'loading') {
        renderFeature.properties['color'] = ACTIVITY_COLOR_MAP['loading'];
        renderFeature.properties.activity = 'loading';
        renderData.features.push(renderFeature);
      } else if (
        regulation.userClasses?.some((uc) =>
          [
            'motorcycle',
            'hotel guest',
            'permit',
            'reserved',
            'handicap',
            'scooter',
            'bicycle',
            'USPS',
            'car share',
            'police',
            'tour bus',
          ].some((c) => uc.classes?.includes(c))
        )
      ) {
        renderFeature.properties['color'] = ACTIVITY_COLOR_MAP['restricted'];
        renderFeature.properties.activity = 'restricted';
        renderData.features.push(renderFeature);
      } else if (
        regulation.userClasses?.some((uc) =>
          ['taxi', 'passenger', 'TNC', 'rideshare'].some((c) =>
            uc.classes?.includes(c)
          )
        )
      ) {
        renderFeature.properties['color'] =
          ACTIVITY_COLOR_MAP['passenger loading'];
        renderFeature.properties.activity = 'passenger loading';
        renderData.features.push(renderFeature);
      } else if (
        regulation.userClasses?.some((uc) => uc.classes?.includes('transit'))
      ) {
        renderFeature.properties['color'] = ACTIVITY_COLOR_MAP['transit'];
        renderFeature.properties.activity = 'transit';
        renderData.features.push(renderFeature);
      }
    }
  }

  return renderData;
};

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrls: ['./layer-one.component.css'],
})
export class LayerOneComponent implements OnInit, AfterViewInit {
  @ViewChild('map') map: ElementRef;
  mapEl: any;
  // segsUrl = "http://localhost:4200/assets/data/downtown_portland_2020-07-30.curblr.json";
  segsUrl = 'http://34.218.20.24:5000/curb/segs';
  mapStyle = defaultMapStyle;

  constructor(private http: HttpClient, private router: Router) {
    this.fetchSegsData();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {}

  fetchSegsData() {
    this.getJSON(this.segsUrl).subscribe((data) => {
      console.log('segs data', data);
      const fixedFeatures = data.features.map((f) => ({
        ...f,
        properties: {
          ...f.properties,
          regulations: JSON.parse(f.properties.regulations),
        },
      }));
      this._loadData({
        ...data,
        manifest: manifest,
        features: fixedFeatures,
      });

      // this._loadData({
      //   ...data,
      // });
    });
  }

  _loadData(data) {
    let self = this;

    mapboxgl.accessToken = environment.mapboxAccessToken;
    this.mapEl = new mapboxgl.Map({
      container: this.map.nativeElement,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-122.6795, 45.5197],
      zoom: 16.5,
    });

    this.mapEl.on('load', () => {
      this.mapEl.addSource('curblrData', {
        type: 'geojson',
        data: renderCurblrData(data),
      });
      this.mapEl.addLayer({
        id: 'dataLayer',
        source: 'curblrData',
        type: 'line',
        interactive: true,
        paint: {
          'line-color': ['get', 'color'],
          'line-offset': ['get', 'offset'],
          'line-width': scaledWidth(6.8),
        },
      });
      this.mapEl.on('click', 'dataLayer', (e) => {
        console.log("CLICK")
        self.router.navigate(['/app/curb-view']);
      });
      this.mapEl.on('mouseenter', 'places', () => {
        this.mapEl.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      this.mapEl.on('mouseleave', 'places', () => {
        this.mapEl.getCanvas().style.cursor = '';
      });
    });
  }

  _setMapData = (newData: any) => {
    // const map = this._getMap();
    // if (map) {
    //   map.getSource('curblrData').setData(newData);
    // }
  };

  _getMap = () => {
    console.log('this.map.nativeElement');
    return this.map ? this.mapEl : null;
  };

  public getJSON(url): Observable<any> {
    return this.http.get(url);
  }
}
