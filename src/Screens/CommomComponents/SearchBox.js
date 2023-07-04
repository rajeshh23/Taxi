import React from 'react';
import ReactDOM from 'react-dom';
import {PropTypes} from 'prop-types';
//import GoogleMapReact from 'google-map-react';

export default class SearchBox extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onPlacesChanged: PropTypes.func
  }
  render() {
    //return <input ref="input" {...this.props} type="text"/>;
    return <input
    ref={(ref) => {
      this.searchInput = ref;
    }}
    type="text"
    onFocus={this.clearSearchBox}
    placeholder="Enter a location"
  />
  }
  onPlacesChanged = ({ map, addplace } = this.props) => {
    /* if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    } */
    const selected = this.searchBox.getPlaces();
    const { 0: place } = selected;
    if (!place.geometry) return;
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    

    addplace(selected);
    this.searchInput.blur();
  }
  componentDidMount({ map, mapApi } = this.props) {
    var input = ReactDOM.findDOMNode(this.searchInput);
    this.searchBox = new mapApi.places.SearchBox(this.searchInput);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
    this.searchBox.bindTo('bounds', map);
  }
  componentWillUnmount({ mapApi } = this.props) {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    //google.maps.event.clearInstanceListeners(this.searchBox);
    mapApi.event.clearInstanceListeners(this.searchInput);
  }
}