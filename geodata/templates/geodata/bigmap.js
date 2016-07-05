{% extends "geodata/map_base.js" %}
{% load l10n %}
{% load staticfiles %}

{% block cluster_layer %}
var clusterlayer{{ module }} = new L.markerClusterGroup();
var declusterlayer{{ module }} = new L.layerGroup();
{% endblock %}

{% block layers_getson_extra %}
    clusterlayer{{ module }}.addLayer(geojsonlayer{{ module }});
    map{{ module }}.addLayer(clusterlayer{{ module }});
    declusterlayer{{ module }}.addLayer(geojsonlayer{{ module }});
{% endblock %}


{% block extra_layers %}
var datacontrol{{ module }} = '';

function togglegeodatacontrol{{ module }} (control) {
    return function () {
        if (datacontrol{{ module }} == control) {
            $('#{{ module }}_map').removeClass('col-md-9');
            $('#{{ module }}_toolbox').removeClass('col-md-3');
            $('#{{ module }}_toolbox').css("display", "none");
            datacontrol{{ module }} = '';
        } else {
            $('#{{ module }}_map').addClass('col-md-9');
            $('#{{ module }}_toolbox').addClass('col-md-3');
            $('#{{ module }}_toolbox').css("display", "block");
            datacontrol{{ module }} = control;
        };
    };
};

L.Control.Data{{ module }} = L.Control.extend(
{
    options:
    {
        position: 'topright',
    },
    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-control-toolbar leaflet-bar');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
            .addListener(controlDiv, 'click', togglegeodatacontrol{{ module }}('data'));

        var controlUI = L.DomUtil.create('a', 'leaflet-control-data', controlDiv);
        controlUI.title = 'Select data to show';
        controlUI.href = '#';
        return controlDiv;
    }
});
var dataControl{{ module }} = new L.Control.Data{{ module }}();
map{{ module }}.addControl(dataControl{{ module }});

var cluster{{ module }} = true;

L.Control.Decluster{{ module }} = L.Control.extend(
{
    options:
    {
        position: 'topright',
    },
    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-control-toolbar leaflet-bar');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
        .addListener(controlDiv, 'click', function () {
            if (cluster{{ module }}) {
                map{{ module }}.removeLayer(clusterlayer{{ module }});
                map{{ module }}.addLayer(declusterlayer{{ module }});
                cluster{{ module }} = false;
            } else {
                map{{ module }}.removeLayer(declusterlayer{{ module }});
                map{{ module }}.addLayer(clusterlayer{{ module }});
                cluster{{ module }} = true;
            };
        });

        var controlUI = L.DomUtil.create('a', 'leaflet-control-cluster', controlDiv);
        controlUI.title = 'Cluster ON/OFF';
        controlUI.href = '#';
        return controlDiv;
    }
});
var declusterControl{{ module }} = new L.Control.Decluster{{ module }}();
map{{ module }}.addControl(declusterControl{{ module }});

var hasclustercontrol{{ module }} = true;

function geodataCheckbox (id, markerclassname) {
    $(id).change(function(event) {
        if (hasclustercontrol{{ module }}) {
            map{{ module }}.removeControl(declusterControl{{ module }});
            hasclustercontrol{{ module }} = false;
        }
        if (cluster{{ module }}) {
            map{{ module }}.removeLayer(clusterlayer{{ module }});
            map{{ module }}.addLayer(declusterlayer{{ module }});
            cluster{{ module }} = false;
        };
        var checkbox = event.target;
        if (checkbox.checked) {
            $('.' + markerclassname).css("display", "");
        } else {
            $('.' + markerclassname).css("display", "none");
        }
    }) ;
};

geodataCheckbox('#buildingCheckbox', 'geodata-marker-buildings');
geodataCheckbox('#worksiteCheckbox', 'geodata-marker-worksites');
geodataCheckbox('#eventCheckbox', 'geodata-marker-events');
geodataCheckbox('#stakeholderCheckbox', 'geodata-marker-stakeholders');
{% endblock %}
