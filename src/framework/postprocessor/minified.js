Oskari.clazz.define("Oskari.mapframework.bundle.postprocessor.PostProcessorBundleInstance",function(){this.sandbox=null},{__name:"PostProcessor",getName:function(){return this.__name},start:function(){var e=this,t=this.conf,n=(t?t.sandbox:null)||"sandbox",r=Oskari.getSandbox(n);this.sandbox=r,r.register(this);if(this.state){var i=this.state.highlightFeatureLayerId;this._highlightFeature(i,this.state.highlightFeatureId)}},_highlightFeature:function(e,t){if(t&&e){var n=this.state.featurePoints;n&&this._showPoints(n);var r=this.sandbox.getEventBuilder("WFSFeaturesSelectedEvent"),i=[];Object.prototype.toString.call(t)==="[object Array]"?i=t:i.push(t);var s=this.sandbox.getService("Oskari.mapframework.service.MapLayerService");if(!s)return;var o=s.createLayerTypeInstance("wfslayer");if(!o)return;o.setId(e),o.setOpacity(100);var u=r(i,o);this.sandbox.notifyAll(u)}},_showPoints:function(e){var t=new OpenLayers.Geometry.MultiPoint,n,r,i;for(n=0;n<e.length;++n)r=e[n],i=new OpenLayers.Geometry.Point(r.lat,r.lon),t.addPoint(i);var s=t.getBounds(),o=t.getCentroid(),u=this.sandbox.getRequestBuilder("MapMoveRequest"),a;u&&n>0&&(n===1?(a=u(o.x,o.y,9),this.sandbox.request(this,a)):(a=u(o.x,o.y,s),this.sandbox.request(this,a)))},onEvent:function(e){var t=this.eventHandlers[e.getName()];if(!t)return;return t.apply(this,[e])},eventHandlers:{MapLayerEvent:function(e){"add"===e.getOperation()&&!e.getLayerId()&&this._highlightFeature(this.state.highlightFeatureLayerId,this.state.highlightFeatureId)}},init:function(){return null},update:function(){},stop:function(){}},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.module.Module"]}),define("bundles/framework/bundle/postprocessor/instance",function(){}),define("src/framework/postprocessor/module",["oskari","jquery","bundles/framework/bundle/postprocessor/instance"],function(e,t){return e.bundleCls("postprocessor").category({create:function(){return e.clazz.create("Oskari.mapframework.bundle.postprocessor.PostProcessorBundleInstance")},update:function(e,t,n,r){}})});