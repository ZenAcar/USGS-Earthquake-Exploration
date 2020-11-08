# USGS Earthquake Visualization

A multi-level Leaflet map visualization that plots United States Geological Survey earthquake data, specifically, "All Earthquakes from the Past 7 Days" from the USGS GeoJSON Feed page, based on longitude and latitude.

The live deployed webpage can be found here: [USGS Earthquake Visualization](https://zenacar.github.io/USGS-Earthquake-Visualization/)

![recent-earthquakes.png](images/recent-earthquakes.png)

### Level 1: Basic Visualization


	* Data markers reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes appear larger and darker in color.

	* Popups that provide additional information about the earthquake when a marker is clicked such as Magnitude, Location and time of occurence.

	* A legend that give a scale of magnitude colors used and provides context for the map data.

- - -

### The second or more advanced level of visualization comprises:

	* A second data set on the above map to illustrate the relationship between tectonic plates and seismic activity. The data on tectonic plates can be found [here](https://github.com/fraxen/tectonicplates).

	* A number of base maps such as Satellite View,Grayscale View and Outdoors View are provided to the user to choose from. Also the two different data sets are separated into overlays that can be turned on and off independently and layer controls were added to give the user the ability to view the overlays / basemaps of their choice.




