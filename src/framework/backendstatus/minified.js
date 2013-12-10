Oskari.clazz.define("Oskari.mapframework.bundle.backendstatus.BackendStatusBundleInstance",function(){this._localization=null,this._sandbox=null,this._started=!1,this._pendingAjaxQuery={busy:!1,jqhr:null,timestamp:null},this.timeInterval=this.ajaxSettings.defaultTimeThreshold,this.backendStatus={},this.backendExtendedStatus={},this.gotStartupEvent=!1,this.gotStartupTimeoutEvent=!1,this.gotStartupProcessCall=!1,this._mapLayerService=null},{ajaxSettings:{defaultTimeThreshold:15e3},getLocalization:function(e){return this._localization||(this._localization=Oskari.getLocalization(this.getName())),e?this._localization[e]:this._localization},__name:"BackendStatus",getName:function(){return this.__name},setSandbox:function(e){this._sandbox=e},getSandbox:function(){return this._sandbox},getAjaxUrl:function(e,t){var n=this.getSandbox().getAjaxUrl(),r=null;return t?r=n+"action_route=GetBackendStatus&Subset=AllKnown":r=n+"action_route=GetBackendStatus&Subset=Alert",r},start:function(){var e=this;if(e._started)return;e._started=!0;var t=e.conf,n=(t?t.sandbox:null)||"sandbox",r=Oskari.getSandbox(n),i;e._sandbox=r,e._mapLayerService=r.getService("Oskari.mapframework.service.MapLayerService"),r.register(e);for(i in e.eventHandlers)e.eventHandlers.hasOwnProperty(i)&&r.registerForEventByName(e,i);e._mapLayerService.isAllLayersLoaded()&&!e.gotStartupProcessCall&&e.updateBackendStatus(!0)},init:function(){return null},update:function(){},onEvent:function(e){var t=this.eventHandlers[e.getName()];if(!t)return;return t.apply(this,[e])},extensionsByName:{LayerSelector:!0},extensionStatesByName:{attach:!0,detach:!0},eventHandlers:{"userinterface.ExtensionUpdatedEvent":function(e){var t=e.getExtension();if(!t)return;var n=t.getName();if(!n)return;if(!this.extensionsByName[n])return;var r=e.getViewState();if(!this.extensionStatesByName[r])return;this.updateBackendStatus()},AfterShowMapLayerInfoEvent:function(e){var t=e.getMapLayer(),n=t.getId(),r=t.getBackendStatus(),i=this.backendExtendedStatus[n];if(!i){this.showFeedbackDialog("missing_backendstatus_information");return}var s=i.infourl;if(!s){this.showFeedbackDialog("missing_backendstatus_infourl");return}this.openURLinWindow(s)},MapLayerEvent:function(e){if(e.getLayerId()!==null&&e.getLayerId()!==undefined||e.getOperation()!=="add")return;var t=this;t.gotStartupEvent=!0,window.setTimeout(function(){t.gotStartupTimeoutEvent=!0,t.updateBackendStatus(!0)},15)}},showFeedbackDialog:function(e){var t=this.getLocalization("feedback")[e],n=Oskari.clazz.create("Oskari.userinterface.component.Popup");n.show(t.title,t.message),n.fadeout()},openURLinWindow:function(e){var t="location=1,status=1,scrollbars=1,width=850,height=1200",n=e;window.open(n,"BackendStatus",t)},stop:function(){var e=this,t=e._sandbox,n;e._cancelAjaxRequest();for(n in e.eventHandlers)e.eventHandlers.hasOwnProperty(n)&&t.unregisterFromEventByName(this,n);t.unregister(this),this._started=!1,this._sandbox=null},getTitle:function(){return"Backend Status"},getDescription:function(){return"Backend Status"},_cancelAjaxRequest:function(){var e=this;if(!e._pendingAjaxQuery.busy)return;var t=e._pendingAjaxQuery.jqhr;e._pendingAjaxQuery.jqhr=null;if(!t)return;this._sandbox.printDebug("[BackendStatus] Abort jqhr ajax request"),t.abort(),t=null,e._pendingAjaxQuery.busy=!1},_startAjaxRequest:function(e){var t=this;t._pendingAjaxQuery.busy=!0,t._pendingAjaxQuery.timestamp=e},_finishAjaxRequest:function(){var e=this;e._pendingAjaxQuery.busy=!1,e._pendingAjaxQuery.jqhr=null,this._sandbox.printDebug("[BackendStatus] finished jqhr ajax request")},_notifyAjaxFailure:function(){var e=this;e._sandbox.printDebug("[BackendStatus] BackendStatus AJAX failed"),e._processResponse({backendstatus:[]})},_isAjaxRequestBusy:function(){var e=this;return e._pendingAjaxQuery.busy},updateBackendStatus:function(e){var t=this;t.gotStartupProcessCall=t.gotStartupProcessCall||e;var n=t._sandbox;if(!e&&t._pendingAjaxQuery.busy){n.printDebug("[BackendStatus] updateBackendStatus NOT SENT previous query is busy");return}var r=new Date,i=r.getTime();if(!e&&t._pendingAjaxQuery.timestamp&&i-t._pendingAjaxQuery.timestamp<t.timeInterval){n.printDebug("[BackendStatus] updateBackendStatus NOT SENT (time difference < "+t.timeInterval+"ms)");return}t._cancelAjaxRequest(),t._startAjaxRequest(i);var s=t.getAjaxUrl(null,e);jQuery.ajax({beforeSend:function(e){t._pendingAjaxQuery.jqhr=e,e&&e.overrideMimeType&&e.overrideMimeType("application/j-son;charset=UTF-8")},success:function(n){t._finishAjaxRequest(),t._processResponse(n,e)},error:function(){t._finishAjaxRequest(),t._notifyAjaxFailure()},always:function(){t._finishAjaxRequest()},complete:function(){t._finishAjaxRequest()},data:{},type:"POST",dataType:"json",url:s})},_processResponse:function(e,t){var n=this,r=this._sandbox;if(!e){r.printDebug("[BackendStatus] empty data from server");return}var i=e.backendstatus;if(!i||i.length===undefined){r.printDebug("[BackendStatus] backendStatus NO data");return}var s=r.getEventBuilder("MapLayerEvent"),o={},u=t?{}:this.backendExtendedStatus,a,f,l,c;for(a=0;a<i.length;a+=1)f=i[a],l=f.maplayer_id,this.backendStatus[l]?this.backendStatus[l].status!==f.status?(o[l]={status:f.status,changed:!0},u[l]=f):(o[l]={status:f.status,changed:!1},u[l]=f):(o[l]={status:f.status,changed:!0},u[l]=f);for(c in n.backendStatus)n.backendStatus.hasOwnProperty(c)&&!o[c]&&this.backendStatus[c].status!==null&&this.backendStatus[c].status!==undefined&&(o[c]={status:null,changed:!0});this.backendExtendedStatus=u;var h={};for(c in o)if(o.hasOwnProperty(c)){this.backendStatus[c]=o[c];var p=r.findMapLayerFromAllAvailable(c);if(p){p.setBackendStatus(this.backendStatus[c].status);if(o[c].changed||"DOWN"===p.getBackendStatus())h[c]=p}}if(t)n._pendingAjaxQuery.timestamp=null,n.backendStatus={};else{var d;for(c in h)h.hasOwnProperty(c)&&(d=s(c,"update"),r.notifyAll(d))}}},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.module.Module"]}),define("bundles/framework/bundle/backendstatus/instance",function(){}),Oskari.registerLocalization({lang:"fi",key:"BackendStatus",value:{title:"",desc:"",feedback:{missing_backendstatus_status:{title:"Karttatasot",message:"Karttapalvelun tilatietoja ei ole saatavilla tälle karttatasolle"},missing_backendstatus_information:{title:"Karttatasot",message:"Karttapalvelun tilatietoja ei ole saatavilla tälle karttatasolle"},missing_backendstatus_infourl:{title:"Karttatasot",message:"Karttapalvelun tilatietoja ei ole saatavilla tälle karttatasolle"}}}}),define("bundles/framework/bundle/backendstatus/locale/fi",function(){}),Oskari.registerLocalization({lang:"sv",key:"BackendStatus",value:{title:"",desc:"",feedback:{missing_backendstatus_status:{title:"Kartlager",message:"Kartlagrets tillgänglighetinformation finns ej"},missing_backendstatus_information:{title:"Kartlager",message:"Kartlagrets tillgänglighetinformation finns ej"},missing_backendstatus_infourl:{title:"Kartlager",message:"Kartlagrets tillgänglighetinformation finns ej"}}}}),define("bundles/framework/bundle/backendstatus/locale/sv",function(){}),Oskari.registerLocalization({lang:"en",key:"BackendStatus",value:{title:"Backend Status",desc:"",feedback:{missing_backendstatus_status:{title:"Map layers",message:"Map Layer Service health information is not available for this layer"},missing_backendstatus_information:{title:"Map layers",message:"Map Layer Service health information is not available for this layer"},missing_backendstatus_infourl:{title:"Map layers",message:"Map Layer Service health information is not available for this layer"}}}}),define("bundles/framework/bundle/backendstatus/locale/en",function(){}),define("src/framework/backendstatus/module",["oskari","jquery","bundles/framework/bundle/backendstatus/instance","bundles/framework/bundle/backendstatus/locale/fi","bundles/framework/bundle/backendstatus/locale/sv","bundles/framework/bundle/backendstatus/locale/en"],function(e,t){return e.bundleCls("backendstatus").category({create:function(){var t=this,n=e.clazz.create("Oskari.mapframework.bundle.backendstatus.BackendStatusBundleInstance");return n},update:function(e,t,n,r){}})});